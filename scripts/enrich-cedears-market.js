#!/usr/bin/env node
/**
 * Adds the Market field to data/cedears.json from a BYMA markdown table.
 *
 * Usage: node scripts/enrich-cedears-market.js [path-to-byma.md]
 */
const fs = require('fs');
const path = require('path');

const bymaPath =
  process.argv[2] ||
  path.join(__dirname, '..', 'data', 'cedears_byma.md');
const cedearsPath = path.join(__dirname, '..', 'data', 'cedears.json');

function normalizeRatio(raw) {
  const s = String(raw).trim().replace(/\s+/g, '');
  if (/^\d+$/.test(s)) return s + ':1';
  return s;
}

function parseBymaMarkdown(markdown) {
  const lines = markdown
    .split('\n')
    .filter((line) => line.startsWith('|') && !line.includes('---') && !line.includes('Nombre de la'));

  const rows = [];
  for (const line of lines) {
    const cols = line.split('|').map((s) => s.trim()).filter(Boolean);
    if (cols.length < 4) continue;
    rows.push({
      code: cols[1].toUpperCase(),
      market: cols[2],
      ratio: cols[3].replace(/\s+/g, ''),
    });
  }
  return rows;
}

function findMarket(bymaRows, item) {
  const code = item.Cedears.toUpperCase();
  const targetRatio = normalizeRatio(item.Ratio);

  const exact = bymaRows.filter(
    (row) => row.code === code && normalizeRatio(row.ratio) === targetRatio
  );
  if (exact.length === 1) return exact[0].market;
  if (exact.length > 1) {
    throw new Error('Multiple BYMA rows for ' + code + ' with ratio ' + targetRatio);
  }

  const byCode = bymaRows.filter((row) => row.code === code);
  if (byCode.length === 1) return byCode[0].market;

  return null;
}

function main() {
  const bymaMarkdown = fs.readFileSync(bymaPath, 'utf8');
  const bymaRows = parseBymaMarkdown(bymaMarkdown);
  const cedears = JSON.parse(fs.readFileSync(cedearsPath, 'utf8'));

  const missing = [];
  const enriched = cedears.map((item) => {
    const market = findMarket(bymaRows, item);
    if (!market) {
      missing.push(item.Cedears);
      return item;
    }
    return {
      Cedears: item.Cedears,
      Name: item.Name,
      Market: market,
      Ratio: item.Ratio,
    };
  });

  if (missing.length > 0) {
    console.error('No BYMA market match for:', missing.join(', '));
    process.exit(1);
  }

  fs.writeFileSync(cedearsPath, JSON.stringify(enriched, null, 2) + '\n');
  console.log('Updated ' + enriched.length + ' CEDEARs with Market field');
}

main();
