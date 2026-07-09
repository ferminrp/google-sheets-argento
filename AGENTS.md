# AGENTS.md

## Cursor Cloud specific instructions

This is a **Google Apps Script library** (not a web app/server). Source files in `src/` are designed for the Apps Script runtime. Local Node.js tooling is used only for building and testing.

### Key commands

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Build | `npm run build` (concatenates `src/*.js` into `all-in-one.js`, sorted alphabetically; also publishes `docs/api/cedears.json` from `data/cedears.json`) |
| Test | `npm test` (Jest; unit tests mock UrlFetchApp/CacheService) |

### Architecture notes

- **`src/http.js`**: `fetchJson(url, options)` centralizes HTTP (`muteHttpExceptions`, status check, JSON parse) and optional `CacheService.getScriptCache()` via `cacheKey` / `cacheTtlSeconds`.
- **`src/market_panel.js`**: shared helpers for data912 live panels (`panelCotizacion`, `panelLista`).
- **`src/fecha.js`**: shared date parsing (`YYYY-MM-DD` and Argentine `DD/MM/YYYY`).
- Public custom functions must use `function name()` declarations (Apps Script hoist); avoid assigning helpers to `const`/`var` if other files call them.
- Cache is best-effort: values may expire early; payloads &gt; ~90KB are not cached.

### Notes

- **No linter** is configured in this project.
- **Build before test**: Tests load `all-in-one.js` via `tests/test-wrapper.js`, so you must run `npm run build` before `npm test` whenever source files change.
- **Commit `all-in-one.js`** after build so the shipped bundle matches `src/`.
- **Commit `docs/api/cedears.json`** after build if `data/cedears.json` changed (GitHub Pages API for CEDEAR ratios).
- **Integration-style caucion tests** do not hit the network; most unit tests mock APIs.
- **No environment variables or secrets** are required.
- **No Docker, no database, no backend server** — the only service needed is Node.js with npm.
