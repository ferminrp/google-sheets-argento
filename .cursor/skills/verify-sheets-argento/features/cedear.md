# CEDEAR formulas and JSON API

CEDEAR lets a user look up BYMA certificates (`=CEDEAR("AAPL";"ratio")` and live panel fields) and lets scripts download the same ratio table as JSON. Locally, metadata/ratio fields are proven through Jest; the public list is proven with `GET /api/cedears.json` on the docs server.

## Sub-features

- `cedear-yfinance-sector` returns `sector` from `yfinance-metadata` for AAPL.
- `cedear-yfinance-website-industry` returns website and industry for AAPL.
- `cedear-missing-metadata-field` returns an empty string when the metadata key is absent.
- `cedear-yfinance-error` exposes `error` for tickers like WBA when Yahoo had no data.
- `cedear-no-metadata-block` throws when `yfinance-metadata` is missing on the row.
- `cedear-api-json` serves the Pages envelope (`schema_version`, `name`, `items`) including AAPL.

## How to get to it (user POV)

- In Google Sheets (not driveable here): `=CEDEAR("AAPL";"c")` for last price, `=CEDEAR("AAPL";"ratio")`, `=CEDEAR("AAPL";"sector")`, `=CEDEARLISTA()`.
- In a browser or script: `https://ferminrp.github.io/google-sheets-argento/api/cedears.json` (production) or `http://127.0.0.1:${VERIFY_DOCS_PORT}/api/cedears.json` (this run).
- Landing page section `#api` links to `api/cedears.json`.

## Driving it with verify-sheets-argento

Preconditions:

- `helpers/verify.sh doctor` prints `DOCTOR_OK`.
- `tests/cedear.test.js` mocks the CEDEAR JSON fetch with AAPL / WBA / XYZ fixtures.
- Docs server is this run’s PID. Do not use another host’s Pages deployment as proof of an uncommitted `docs/api/cedears.json`.

- **Sector metadata.** Run `.cursor/skills/verify-sheets-argento/helpers/verify.sh drive cedear`. Jest title `sector devuelve metadata yfinance del JSON` passes (`Technology` for AAPL).
- **Website and industry.** Title `website e industry devuelven metadata yfinance` passes.
- **Empty metadata field.** Title `campo ausente en metadata devuelve string vacío` passes.
- **Explicit Yahoo error.** Title `error de yfinance se puede consultar explícitamente` passes (`WBA` → `no_data`).
- **Missing metadata block.** Title `sin bloque yfinance-metadata lanza error claro` throws `Metadata yfinance no disponible para 'XYZ'`.
- **HTTP API.** The same drive GETs `/api/cedears.json`. Status is 200; JSON has `schema_version` `1`, `name` `cedears`, `count` equal to the file on disk, and an item with `Cedears` `AAPL` and a `Ratio` string.
- **Proof.** `${VERIFY_PROOF_DIR}/cedear/jest.txt` has `jest_exit=0`. `${VERIFY_PROOF_DIR}/cedear/http-cedears.json` is the served body. `${VERIFY_PROOF_DIR}/cedear/meta.txt` lists both entry points.

## Gotchas

- Live panel fields (`c`, `v`, `pct_change`) hit `data912.com` in production. The Jest file in this repo covers JSON/yfinance attributes, not the live panel. Do not mark `=CEDEAR("AAPL";"c")` as locally verified.
- `docs/api/cedears.json` is a build artifact. If you edited `data/cedears.json`, run `npm run build` before the HTTP GET or doctor will disagree with disk.
- Production Pages can lag `main`. Local proof is the loopback server, not ferminrp.github.io.
- `count` must match `items.length`. Assert both, not only that the file is non-empty.
- Sheets locale uses `;` (`=CEDEAR("AAPL";"ratio")`). Jest uses commas.
