# Sitio web (GitHub Pages)

Esta carpeta es la **landing pública** del proyecto:

**https://ferminrp.github.io/google-sheets-argento/**

## Contenido

| Archivo | Rol |
|---------|-----|
| `index.html` | Landing: qué es, instalación, uso, **listado CEDEARs con filtro por tags**, catálogo, API, fuentes, FAQ |
| `changelog.html` | **Changelog público** del producto, agrupado por fecha |
| `styles.css` | Estilos (light / dark con `prefers-color-scheme`) |
| `script.js` | Menú mobile, nav activa, copiar código, demo live del hero, **tabla CEDEARs + filtro** |
| `favicon.svg` | Icono |
| `og.png` | Imagen Open Graph / Twitter (misma social preview del repo) |
| `api/cedears.json` | API estática de CEDEARs + ratios + tags (generada por `npm run build`) |
| `categoria/{slug}/` | Landings SEO por tag (ej. `tecnologia`, `semiconductores`); generadas por el build |
| `sitemap.xml` | Sitemap (home, changelog, categorías); generado por el build |
| `CHANGELOG.md` | Historial de cambios del **sitio** (`docs/`) para devs |

La documentación detallada de cada función sigue en [`../doc/`](../doc/) del repo (no se duplica acá).

## Changelog público

URL: [changelog.html](https://ferminrp.github.io/google-sheets-argento/changelog.html)

Timeline curada a mano (no se auto-genera desde la API de GitHub). Cuando se mergee un PR con impacto de usuario:

1. Agregar un ítem bajo la fecha de merge en `changelog.html` (o crear el bloque de fecha).
2. Usar tags consistentes: `Nuevo`, `Mejora`, `Fix`, `Datos`, `Sitio`, `Docs`.
3. Linkear al PR (`#N`).

## Demo live del hero

La tabla del hero (`=DOLAR`, `=ACCIONES`, `=RIESGOPAIS`) **no usa valores fijos**: al abrir la página, `script.js` hace 3 `fetch` client-side a las APIs públicas (CORS abierto) y muestra skeleton hasta que llegan los datos.

| Celda | Endpoint |
|-------|----------|
| Blue + MEP | `https://dolarapi.com/v1/dolares` |
| GGAL | `https://data912.com/live/arg_stocks` |
| Riesgo país | `https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo` |

Si una fuente falla, esa celda muestra `—`. Si fallan las cuatro, aparece un mensaje breve bajo la tabla.

## API estática

Publicada en Pages (sin backend):

| Endpoint | Descripción |
|----------|-------------|
| [`/api/cedears.json`](https://ferminrp.github.io/google-sheets-argento/api/cedears.json) | Listado de CEDEARs con `Cedears`, `Name`, `Market`, `Ratio`, `TickerOriginal`, `tags` + metadata |

Fuente canónica: [`data/cedears.json`](../data/cedears.json) (array plano).  
`npm run build` regenera `docs/api/cedears.json` con un envelope para agentes/scripts.  
CI falla si el archivo de Pages no está commiteado al día.

## Listado y categorías SEO

- En la home (`#cedears`), `script.js` carga `api/cedears.json` y muestra una tabla filtrable por tag (`<select>`).
- Cada tag genera una página estática en `/categoria/{slug}/` (HTML sin JS obligatorio) vía `scripts/cedear-category-pages.js`.
- Override de slug/título: tag `Tech` → slug `tecnologia`, título “CEDEARs de Tecnología”.
- `docs/sitemap.xml` incluye home, changelog y todas las categorías.

## Activar Pages en el repo

1. GitHub → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` · Folder: `/docs`
4. Save

Opcional: homepage del repo → `https://ferminrp.github.io/google-sheets-argento/`

## Vista local

```bash
cd docs
python3 -m http.server 8080
# abrir http://localhost:8080
```

No hay build ni dependencias npm para el sitio.
