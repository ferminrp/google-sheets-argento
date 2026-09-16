# Caución

Caución lets a user compute net amounts for colocadora (lending cash) and tomadora (borrowing) operations in the sheet, including BYMA derechos, garantía, IVA, and aranceles. The calculation is local arithmetic: Jest calls the same functions with no UrlFetch.

## Sub-features

- `caucion-colocadora-neto` returns a number greater than the gross amount and less than gross plus raw TNA interest for a 30-day colocadora.
- `caucion-tomadora-neto` returns a number greater than the gross amount for a 30-day tomadora.
- `caucion-zero-dias` rejects `CALCULARCAUCION(0, …)` with a message that days cannot be 0.
- `acciones-empty-symbol` (same Jest file) throws `Símbolo no proporcionado` for empty `ACCIONES` — do not treat this as caución proof.

## How to get to it (user POV)

- In Google Sheets (not driveable here): `=CAUCIONCOLOCADORA(7; 50%; 500000)`, `=CAUCIONTOMADORA(dias; tna; importe)`, `=CAUCION(dias; tna; importe)` (negative days = colocadora).
- Catalog on the docs site: `#funciones` example `=CAUCIONCOLOCADORA(7; 50%; 500000)`.
- Local stand-in: Jest file `tests/all-in-one.test.js`.

## Driving it with verify-sheets-argento

Preconditions:

- `helpers/verify.sh doctor` prints `DOCTOR_OK`.
- `all-in-one.js` contains `function CAUCIONCOLOCADORA`, `function CAUCIONTOMADORA`, and `function CALCULARCAUCION`.
- No network is required. If a test hangs on HTTP, you are in the wrong file.

- **Colocadora.** Run `.cursor/skills/verify-sheets-argento/helpers/verify.sh drive caucion`. Describe block `CAUCIONCOLOCADORA` passes with `dias=30`, `tna=1.2`, `importeBruto=1000000`. Result is a number `> 1000000` and `< importe + interes` at TNA pro-rata.
- **Tomadora.** Describe block `CAUCIONTOMADORA` passes; result is a number `> 1000000`.
- **Zero days.** Title `rechaza dias === 0` throws text containing `no puede ser 0`.
- **Proof.** `${VERIFY_PROOF_DIR}/caucion/jest.txt` contains `CAUCIONCOLOCADORA`, `CAUCIONTOMADORA`, `rechaza dias === 0`, and `jest_exit=0`.

## Gotchas

- TNA in the test is `1.2` meaning 120% in Sheets percent format. Do not feed `120` or `0.012` and expect the same net.
- Colocadora uses **positive** days in `CAUCIONCOLOCADORA` (the implementation negates internally). `=CAUCION(-dias; …)` is the signed form. Assert the wrapper you actually called.
- Fees (arancel, derechos, IVA) mean neto is not gross × (1 + TNA×días/365). Assert inequalities from the recipe, not an ad-hoc spreadsheet of your own unless you re-derive the same fees from `src/caucion.js`.
- `tests/all-in-one.test.js` also has `ACCIONES` empty-symbol. That passing is not caución. Mention it as skipped for this feature if you only came for caución.
- Integration-style caución tests do not hit the network. A failure here is logic or bundle-stale, not API downtime.
