#!/usr/bin/env node
/**
 * Compare data/cedears.json against external CEDEAR ratio sources.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(__dirname, 'output');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'cedear-compare/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/** Normalize ratio to canonical "N:1" or "1:N" string */
function normalizeRatio(raw) {
  if (raw == null || raw === '') return null;
  const s = String(raw).trim().replace(/\s+/g, '');
  if (/^\d+$/.test(s)) return `${s}:1`;
  if (/^\d+:\d+$/.test(s)) {
    const [a, b] = s.split(':').map(Number);
    if (a >= b) return `${a}:${b}`;
    return `${a}:${b}`;
  }
  return s;
}

/** Compare two normalized ratios (same meaning) */
function ratiosEqual(a, b) {
  const na = normalizeRatio(a);
  const nb = normalizeRatio(b);
  if (!na || !nb) return na === nb;
  if (na === nb) return true;
  // 1:3 vs fractional interpretations
  const parse = (r) => {
    const [x, y] = r.split(':').map(Number);
    return x / y; // cedears per share when format is N:1
  };
  try {
    const va = parse(na);
    const vb = parse(nb);
    return Math.abs(va - vb) < 1e-9;
  } catch {
    return false;
  }
}

function loadOurs() {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/cedears.json'), 'utf8'));
  const map = new Map();
  for (const row of data) {
    map.set(row.Cedears.toUpperCase(), {
      ticker: row.Cedears.toUpperCase(),
      name: row.Name,
      ratio: row.Ratio,
    });
  }
  return map;
}

async function loadGabriel() {
  const html = await fetch('https://www.gabrielmartin.yt/tools/ratio');
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('Gabriel Martin: __NEXT_DATA__ not found');
  const data = JSON.parse(m[1]);
  const rows = data.props.pageProps.cedears;
  const map = new Map();
  for (const row of rows) {
    map.set(row.denomination.toUpperCase(), {
      ticker: row.denomination.toUpperCase(),
      name: row.marketIdentification,
      ratio: row.ratioCedearADR,
    });
  }
  return map;
}

async function loadLogos() {
  const json = await fetch('https://logos-cedears.vercel.app/api/cedears');
  const data = JSON.parse(json);
  const map = new Map();
  for (const row of data.rows) {
    map.set(row.tickerLocal.toUpperCase(), {
      ticker: row.tickerLocal.toUpperCase(),
      name: row.empresa,
      ratio: row.ratioFormato || String(row.ratio),
      underlying: row.tickerYF,
    });
  }
  return map;
}

async function loadMarcos() {
  const html = await fetch('https://marcosemmi.com/ratios-de-cedears/');
  const map = new Map();
  const rowRe = /<tr class="row-\d+">\s*<td class="column-1">([^<]+)<\/td><td class="column-2">([^<]*)<\/td><td class="column-3">([^<]+)<\/td><td class="column-4">([^<]+)<\/td>/g;
  let m;
  while ((m = rowRe.exec(html)) !== null) {
    const ticker = m[1].trim().toUpperCase();
    map.set(ticker, {
      ticker,
      name: m[2].trim(),
      ratio: m[3].trim(),
      underlying: m[4].trim().toUpperCase(),
    });
  }
  if (map.size === 0) throw new Error('Marcos Emmi: no table rows parsed');
  return map;
}

function compareSets(ours, external, sourceName) {
  const onlyOurs = [];
  const onlyExternal = [];
  const ratioDiff = [];
  const nameDiff = [];

  for (const [ticker, our] of ours) {
    const ext = external.get(ticker);
    if (!ext) {
      onlyOurs.push(our);
      continue;
    }
    if (!ratiosEqual(our.ratio, ext.ratio)) {
      ratioDiff.push({
        ticker,
        ours: { ratio: our.ratio, name: our.name },
        external: { ratio: ext.ratio, name: ext.name },
      });
    }
  }

  for (const [ticker, ext] of external) {
    if (!ours.has(ticker)) {
      onlyExternal.push(ext);
    }
  }

  return { onlyOurs, onlyExternal, ratioDiff, sourceName };
}

/** Map our tickers to Marcos tickers via underlying symbol when local ticker differs */
function buildMarcosAliasMap(marcos) {
  const byUnderlying = new Map();
  for (const [ticker, row] of marcos) {
    if (row.underlying) {
      const u = row.underlying.toUpperCase();
      if (!byUnderlying.has(u)) byUnderlying.set(u, []);
      byUnderlying.get(u).push({ ticker, ...row });
    }
  }
  return byUnderlying;
}

function resolveMarcosRow(ticker, marcos, byUnderlying) {
  const direct = marcos.get(ticker);
  if (direct) return direct;
  const candidates = byUnderlying.get(ticker) || [];
  return candidates.length === 1 ? candidates[0] : null;
}

function compareMarcosWithAliases(ours, marcos) {
  const byUnderlying = buildMarcosAliasMap(marcos);
  const matchedMarcos = new Set();
  const onlyOurs = [];
  const ratioDiff = [];
  const tickerAlias = [];

  for (const [ticker, our] of ours) {
    let ext = marcos.get(ticker);
    let marcosTicker = ticker;

    if (!ext) {
      // try match by underlying symbol = our ticker (when our ticker is underlying style)
      const candidates = byUnderlying.get(ticker) || [];
      if (candidates.length === 1) {
        ext = candidates[0];
        marcosTicker = ext.ticker;
        tickerAlias.push({ ours: ticker, marcos: marcosTicker, underlying: ext.underlying });
      }
    }

    if (!ext) {
      onlyOurs.push(our);
      continue;
    }

    matchedMarcos.add(marcosTicker);
    if (!ratiosEqual(our.ratio, ext.ratio)) {
      ratioDiff.push({
        ticker,
        marcosTicker,
        ours: { ratio: our.ratio, name: our.name },
        marcos: { ratio: ext.ratio, name: ext.name },
      });
    }
  }

  const onlyMarcos = [];
  for (const [ticker, ext] of marcos) {
    if (!matchedMarcos.has(ticker)) {
      onlyMarcos.push(ext);
    }
  }

  return { onlyOurs, onlyMarcos, ratioDiff, tickerAlias };
}

async function main() {
  const ours = loadOurs();
  console.log(`Nuestro archivo: ${ours.size} CEDEARs\n`);

  const [gabriel, logos, marcos] = await Promise.all([
    loadGabriel(),
    loadLogos(),
    loadMarcos(),
  ]);

  console.log(`Gabriel Martin: ${gabriel.size}`);
  console.log(`LOGOS: ${logos.size}`);
  console.log(`Marcos Emmi: ${marcos.size}\n`);

  const sources = [
    { name: 'Gabriel Martin', map: gabriel, compare: (o, e) => compareSets(o, e, 'Gabriel Martin') },
    { name: 'LOGOS', map: logos, compare: (o, e) => compareSets(o, e, 'LOGOS') },
  ];

  const report = { generatedAt: new Date().toISOString(), ours: ours.size, comparisons: {} };

  for (const src of sources) {
    const c = src.compare(ours, src.map);
    report.comparisons[src.name] = {
      externalCount: src.map.size,
      onlyInOurs: c.onlyOurs.map((r) => r.ticker).sort(),
      onlyInExternal: c.onlyExternal.map((r) => r.ticker).sort(),
      ratioDifferences: c.ratioDiff.map((d) => ({
        ticker: d.ticker,
        oursRatio: d.ours.ratio,
        externalRatio: d.external.ratio,
        oursName: d.ours.name,
        externalName: d.external.name,
      })),
    };

    console.log(`=== ${src.name} ===`);
    console.log(`Solo en nuestro archivo (${c.onlyOurs.length}):`, c.onlyOurs.map((r) => r.ticker).join(', ') || '(ninguno)');
    console.log(`Solo en ${src.name} (${c.onlyExternal.length}):`, c.onlyExternal.map((r) => r.ticker).join(', ') || '(ninguno)');
    console.log(`Ratios distintos (${c.ratioDiff.length}):`);
    for (const d of c.ratioDiff) {
      console.log(`  ${d.ticker}: nosotros=${d.ours.ratio} | ${src.name}=${d.external.ratio}`);
    }
    console.log('');
  }

  const marcosCmp = compareMarcosWithAliases(ours, marcos);
  report.comparisons['Marcos Emmi'] = {
    externalCount: marcos.size,
    tickerAliases: marcosCmp.tickerAlias,
    onlyInOurs: marcosCmp.onlyOurs.map((r) => r.ticker).sort(),
    onlyInMarcos: marcosCmp.onlyMarcos.map((r) => r.ticker).sort(),
    ratioDifferences: marcosCmp.ratioDiff.map((d) => ({
      ticker: d.ticker,
      marcosTicker: d.marcosTicker,
      oursRatio: d.ours.ratio,
      marcosRatio: d.marcos.ratio,
    })),
  };

  console.log('=== Marcos Emmi (con alias por ticker subyacente) ===');
  console.log(`Alias ticker distinto (${marcosCmp.tickerAlias.length}):`);
  for (const a of marcosCmp.tickerAlias.slice(0, 15)) {
    console.log(`  ${a.ours} (nosotros) ↔ ${a.marcos} (Marcos, subyacente ${a.underlying})`);
  }
  if (marcosCmp.tickerAlias.length > 15) console.log(`  ... y ${marcosCmp.tickerAlias.length - 15} más`);
  console.log(`Solo en nuestro archivo (${marcosCmp.onlyOurs.length}):`, marcosCmp.onlyOurs.map((r) => r.ticker).join(', ') || '(ninguno)');
  console.log(`Solo en Marcos (${marcosCmp.onlyMarcos.length}):`, marcosCmp.onlyMarcos.map((r) => r.ticker).join(', ') || '(ninguno)');
  console.log(`Ratios distintos (${marcosCmp.ratioDiff.length}):`);
  for (const d of marcosCmp.ratioDiff) {
    const label = d.ticker === d.marcosTicker ? d.ticker : `${d.ticker} / ${d.marcosTicker}`;
    console.log(`  ${label}: nosotros=${d.ours.ratio} | Marcos=${d.marcos.ratio}`);
  }

  const marcosByUnderlying = buildMarcosAliasMap(marcos);

  // Cross-source: items in all 3 externals but not ours
  const inAllExternal = [];
  for (const [ticker] of gabriel) {
    if (logos.has(ticker) && resolveMarcosRow(ticker, marcos, marcosByUnderlying) && !ours.has(ticker)) {
      inAllExternal.push(ticker);
    }
  }
  report.inAllExternalNotOurs = inAllExternal.sort();

  // Ratios where all 3 externals agree but differ from ours
  const allExternalAgreeDiffOurs = [];
  for (const [ticker, our] of ours) {
    const g = gabriel.get(ticker);
    const l = logos.get(ticker);
    const m = resolveMarcosRow(ticker, marcos, marcosByUnderlying);
    if (!g || !l || !m) continue;
    const gL = ratiosEqual(g.ratio, l.ratio);
    const gM = ratiosEqual(g.ratio, m.ratio);
    const lM = ratiosEqual(l.ratio, m.ratio);
    if (gL && gM && lM && !ratiosEqual(our.ratio, g.ratio)) {
      allExternalAgreeDiffOurs.push({
        ticker,
        ours: our.ratio,
        consensus: normalizeRatio(g.ratio),
        gabriel: g.ratio,
        logos: l.ratio,
        marcos: m.ratio,
      });
    }
  }
  report.allExternalAgreeDiffOurs = allExternalAgreeDiffOurs;

  console.log('\n=== Consenso externo vs nosotros ===');
  console.log(`En las 3 fuentes pero no en nuestro archivo: ${inAllExternal.join(', ') || '(ninguno)'}`);
  console.log(`Las 3 fuentes coinciden pero nosotros difieren (${allExternalAgreeDiffOurs.length}):`);
  for (const d of allExternalAgreeDiffOurs) {
    console.log(`  ${d.ticker}: nosotros=${d.ours} | consenso=${d.consensus}`);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const reportPath = path.join(OUTPUT_DIR, 'cedears-comparison.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReporte JSON guardado en ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
