# Sitio web (GitHub Pages)

Esta carpeta es la **landing pública** del proyecto:

**https://ferminrp.github.io/google-sheets-argento/**

## Contenido

| Archivo | Rol |
|---------|-----|
| `index.html` | Landing: qué es, instalación, uso, catálogo, API, fuentes, FAQ |
| `styles.css` | Estilos (light / dark con `prefers-color-scheme`) |
| `script.js` | Menú mobile, nav activa, copiar código |
| `favicon.svg` | Icono |
| `api/cedears.json` | API estática de CEDEARs + ratios (generada por `npm run build`) |

La documentación detallada de cada función sigue en [`../doc/`](../doc/) del repo (no se duplica acá).

## API estática

Publicada en Pages (sin backend):

| Endpoint | Descripción |
|----------|-------------|
| [`/api/cedears.json`](https://ferminrp.github.io/google-sheets-argento/api/cedears.json) | Listado de CEDEARs con `Cedears`, `Name`, `Ratio` + metadata |

Fuente canónica: [`data/cedears.json`](../data/cedears.json) (array plano).  
`npm run build` regenera `docs/api/cedears.json` con un envelope para agentes/scripts.  
CI falla si el archivo de Pages no está commiteado al día.

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
