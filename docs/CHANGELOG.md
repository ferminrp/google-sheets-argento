# Changelog — GitHub Pages (`docs/`)

## [Unreleased]

### Modificado
- Landing API: ejemplo de respuesta y textos incluyen el campo **`Market`** (mercado del subyacente), alineado a `data/cedears.json` y a `docs/api/cedears.json` tras #26.
- Catálogo: `=cedear("AAPL";"market")` como ejemplo.

### Añadido
- **Hero demo con datos en vivo** (client-side): las 4 celdas de resultado llaman a las mismas APIs públicas que las fórmulas de Sheets, con skeleton mientras cargan.
  - Blue / MEP → [DolarAPI](https://dolarapi.com/v1/dolares)
  - GGAL → [data912](https://data912.com/live/arg_stocks)
  - Riesgo país → [Argentina Datos `/ultimo`](https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo)
- Badge “Datos en vivo” en la barra del mock cuando al menos una celda carga bien.
- Mensaje de error solo si fallan las 4 celdas.

### Modificado
- Se eliminó el disclaimer del hero: *“Los valores de la tabla son ilustrativos…”*.
- `script.js`: fetch con timeout ~10s, `credentials: 'omit'`, formato `es-AR`.
- `styles.css`: skeleton shimmer (respeta `prefers-reduced-motion`).

### Archivos afectados
- `docs/index.html`
- `docs/script.js`
- `docs/styles.css`
- `docs/README.md`

### Decisiones técnicas
- Client-side puro (CORS abierto en las 3 APIs); sin proxy.
- Riesgo país usa `/ultimo` en lugar del histórico completo (~400 KB) que consume Apps Script.
- Un solo request a DolarAPI alimenta blue + mep.
- Errores por celda (`—`) sin bloquear el resto del sitio.

## [1.0.0] - 2026-07-08

### Añadido
- Landing estática en GitHub Pages.
- API estática `api/cedears.json` (generada por `npm run build`).
- `og.png` alineado a la social preview del repo.
