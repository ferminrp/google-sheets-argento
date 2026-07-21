const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ferminrp.github.io/google-sheets-argento';
const SLUG_OVERRIDES = { Tech: 'tecnologia' };
const TITLE_OVERRIDES = { Tech: 'Tecnología' };

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function slugifyTag(tag) {
    if (Object.prototype.hasOwnProperty.call(SLUG_OVERRIDES, tag)) {
        return SLUG_OVERRIDES[tag];
    }
    return String(tag)
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function titleForTag(tag) {
    return 'CEDEARs de ' + (TITLE_OVERRIDES[tag] || tag);
}

function displayNameForTag(tag) {
    return TITLE_OVERRIDES[tag] || tag;
}

function collectUniqueTags(items) {
    const tags = new Set();
    for (const item of items) {
        if (!Array.isArray(item.tags)) {
            continue;
        }
        for (const tag of item.tags) {
            if (tag != null && String(tag).trim() !== '') {
                tags.add(String(tag));
            }
        }
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b, 'es'));
}

function renderCategoryPage(tag, tagItems) {
    const slug = slugifyTag(tag);
    const pageTitle = titleForTag(tag);
    const fullTitle = pageTitle + ' — Google Sheets Argento';
    const displayName = displayNameForTag(tag);
    const description =
        'Listado de CEDEARs de ' +
        displayName +
        ' en BYMA: tickers, nombres, mercados y ratios.';
    const pageUrl = BASE_URL + '/categoria/' + slug + '/';
    const count = tagItems.length;

    const rows = tagItems
        .slice()
        .sort((a, b) => String(a.Cedears).localeCompare(String(b.Cedears), 'es'))
        .map(function (item) {
            return (
                '              <tr>\n' +
                '                <td><code>' +
                escapeHtml(item.Cedears) +
                '</code></td>\n' +
                '                <td>' +
                escapeHtml(item.Name) +
                '</td>\n' +
                '                <td>' +
                escapeHtml(item.Market || '') +
                '</td>\n' +
                '                <td>' +
                escapeHtml(item.Ratio) +
                '</td>\n' +
                '              </tr>'
            );
        })
        .join('\n');

    return (
        '<!DOCTYPE html>\n' +
        '<html lang="es">\n' +
        '<head>\n' +
        '  <meta charset="utf-8" />\n' +
        '  <meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
        '  <title>' +
        escapeHtml(fullTitle) +
        '</title>\n' +
        '  <meta name="description" content="' +
        escapeHtml(description) +
        '" />\n' +
        '  <meta name="theme-color" content="#0b3d91" />\n' +
        '  <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />\n' +
        '  <meta property="og:title" content="' +
        escapeHtml(fullTitle) +
        '" />\n' +
        '  <meta property="og:description" content="' +
        escapeHtml(description) +
        '" />\n' +
        '  <meta property="og:type" content="website" />\n' +
        '  <meta property="og:url" content="' +
        escapeHtml(pageUrl) +
        '" />\n' +
        '  <meta property="og:image" content="' +
        BASE_URL +
        '/og.png" />\n' +
        '  <meta property="og:image:type" content="image/png" />\n' +
        '  <meta property="og:image:width" content="1280" />\n' +
        '  <meta property="og:image:height" content="640" />\n' +
        '  <meta property="og:image:alt" content="Google Sheets Argento" />\n' +
        '  <meta name="twitter:card" content="summary_large_image" />\n' +
        '  <meta name="twitter:title" content="' +
        escapeHtml(fullTitle) +
        '" />\n' +
        '  <meta name="twitter:description" content="' +
        escapeHtml(description) +
        '" />\n' +
        '  <meta name="twitter:image" content="' +
        BASE_URL +
        '/og.png" />\n' +
        '  <link rel="stylesheet" href="../../styles.css" />\n' +
        '</head>\n' +
        '<body>\n' +
        '  <header class="site-nav">\n' +
        '    <div class="wrap">\n' +
        '      <a class="brand" href="../../index.html">\n' +
        '        <img src="../../favicon.svg" alt="" width="28" height="28" />\n' +
        '        Sheets Argento\n' +
        '      </a>\n' +
        '      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu">\n' +
        '        Menú\n' +
        '      </button>\n' +
        '      <ul class="nav-links" id="nav-menu">\n' +
        '        <li><a href="../../index.html#que-hace">Qué hace</a></li>\n' +
        '        <li><a href="../../index.html#instalacion">Instalar</a></li>\n' +
        '        <li><a href="../../index.html#uso">Uso</a></li>\n' +
        '        <li><a href="../../index.html#funciones">Funciones</a></li>\n' +
        '        <li><a href="../../index.html#cedears">CEDEARs</a></li>\n' +
        '        <li><a href="../../index.html#api">API</a></li>\n' +
        '        <li><a href="../../index.html#fuentes">Fuentes</a></li>\n' +
        '        <li><a href="../../index.html#faq">FAQ</a></li>\n' +
        '        <li><a href="../../changelog.html">Changelog</a></li>\n' +
        '      </ul>\n' +
        '    </div>\n' +
        '  </header>\n' +
        '\n' +
        '  <main>\n' +
        '    <section class="page-hero" id="inicio">\n' +
        '      <div class="wrap">\n' +
        '        <p class="page-kicker">CEDEARs por categoría</p>\n' +
        '        <h1>' +
        escapeHtml(pageTitle) +
        '</h1>\n' +
        '        <p class="section-lead page-hero-lead">\n' +
        '          ' +
        count +
        ' CEDEAR' +
        (count === 1 ? '' : 's') +
        ' en la categoría ' +
        escapeHtml(displayName) +
        '.\n' +
        '          Datos de BYMA con ticker, nombre, mercado del subyacente y ratio de conversión.\n' +
        '        </p>\n' +
        '      </div>\n' +
        '    </section>\n' +
        '\n' +
        '    <section class="section" aria-label="Listado de CEDEARs">\n' +
        '      <div class="wrap">\n' +
        '        <div class="table-wrap">\n' +
        '          <table class="data-table">\n' +
        '            <thead>\n' +
        '              <tr>\n' +
        '                <th>Ticker</th>\n' +
        '                <th>Nombre</th>\n' +
        '                <th>Mercado</th>\n' +
        '                <th>Ratio</th>\n' +
        '              </tr>\n' +
        '            </thead>\n' +
        '            <tbody>\n' +
        rows +
        '\n' +
        '            </tbody>\n' +
        '          </table>\n' +
        '        </div>\n' +
        '        <p style="margin-top: 1.5rem;">\n' +
        '          <a href="../../index.html#cedears">← Volver al listado completo de CEDEARs</a>\n' +
        '        </p>\n' +
        '      </div>\n' +
        '    </section>\n' +
        '  </main>\n' +
        '\n' +
        '  <footer class="site-footer">\n' +
        '    <div class="wrap">\n' +
        '      <div class="footer-brand">Google Sheets Argento</div>\n' +
        '      <ul class="footer-links">\n' +
        '        <li><a href="../../index.html">Inicio</a></li>\n' +
        '        <li><a href="../../changelog.html">Changelog</a></li>\n' +
        '        <li><a href="https://github.com/ferminrp/google-sheets-argento" target="_blank" rel="noopener">GitHub</a></li>\n' +
        '        <li><a href="https://github.com/ferminrp/google-sheets-argento/issues" target="_blank" rel="noopener">Issues</a></li>\n' +
        '        <li><a href="https://raw.githubusercontent.com/ferminrp/google-sheets-argento/main/all-in-one.js" target="_blank" rel="noopener">all-in-one.js</a></li>\n' +
        '        <li><a href="../../api/cedears.json">API CEDEARs</a></li>\n' +
        '        <li><a href="https://cafecito.app/ferminrp" target="_blank" rel="noopener">Cafecito</a></li>\n' +
        '      </ul>\n' +
        '      <p class="footer-note">\n' +
        '        Hecho para argentinos de bien · Datos de DolarAPI, Argentina Datos, data912, CriptoYa, Coinbase y BCRA ·\n' +
        '        No es consejo financiero.\n' +
        '      </p>\n' +
        '    </div>\n' +
        '  </footer>\n' +
        '\n' +
        '  <script src="../../script.js"></script>\n' +
        '</body>\n' +
        '</html>\n'
    );
}

function renderSitemap(slugs) {
    const urls = [
        BASE_URL + '/',
        BASE_URL + '/changelog.html',
    ];
    for (const slug of slugs) {
        urls.push(BASE_URL + '/categoria/' + slug + '/');
    }

    const body = urls
        .map(function (loc) {
            return '  <url>\n    <loc>' + escapeHtml(loc) + '</loc>\n  </url>';
        })
        .join('\n');

    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        body +
        '\n</urlset>\n'
    );
}

function publishCedearCategoryPages(items) {
    if (!Array.isArray(items)) {
        throw new Error('publishCedearCategoryPages: items debe ser un array');
    }

    const docsDir = path.join(__dirname, '..', 'docs');
    const categoriaDir = path.join(docsDir, 'categoria');

    if (fs.existsSync(categoriaDir)) {
        fs.rmSync(categoriaDir, { recursive: true, force: true });
    }
    fs.mkdirSync(categoriaDir, { recursive: true });

    const tags = collectUniqueTags(items);
    const slugs = [];

    for (const tag of tags) {
        const slug = slugifyTag(tag);
        slugs.push(slug);

        const tagItems = items.filter(function (item) {
            return Array.isArray(item.tags) && item.tags.includes(tag);
        });

        const pageDir = path.join(categoriaDir, slug);
        fs.mkdirSync(pageDir, { recursive: true });
        fs.writeFileSync(
            path.join(pageDir, 'index.html'),
            renderCategoryPage(tag, tagItems)
        );
    }

    const sitemapPath = path.join(docsDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, renderSitemap(slugs));

    console.log(
        'Páginas de categoría CEDEAR publicadas en docs/categoria/ (' +
            tags.length +
            ' tags, sitemap en docs/sitemap.xml)'
    );

    return { tags, slugs };
}

module.exports = {
    BASE_URL,
    SLUG_OVERRIDES,
    TITLE_OVERRIDES,
    escapeHtml,
    slugifyTag,
    titleForTag,
    collectUniqueTags,
    publishCedearCategoryPages,
};
