# Dólar quotes

Dólar quotes let a user type `=DOLAR("tipo")` in Google Sheets and get compra, venta, or promedio for blue, oficial, MEP/bolsa, and CCL. Locally this is proven by calling `DOLAR()` from the built bundle under Jest with a mocked `UrlFetchApp` body — not by evaluating a live cell.

## Sub-features

- `dolar-default-venta` returns venta when the operación argument is omitted.
- `dolar-promedio` averages compra and venta, or uses venta when compra is null.
- `dolar-alias-mep` treats `mep` as `bolsa`.
- `dolar-alias-ccl` treats `ccl` as `contadoconliqui`.
- `dolar-empty-tipo` throws a readable error when tipo is empty.

## How to get to it (user POV)

- In Google Sheets (not driveable here): `=DOLAR("blue")`, `=DOLAR("mep";"venta")`, `=DOLAR("ccl";"promedio")`. Argentine locale uses `;` between arguments.
- Paste `all-in-one.js` into Apps Script, then enter those formulas (first use asks Google to authorize UrlFetch).
- Local stand-in: run the `DOLAR` Jest file against the built bundle.

## Driving it with verify-sheets-argento

Preconditions:

- `helpers/verify.sh doctor` prints `DOCTOR_OK`.
- `all-in-one.js` contains `function DOLAR`.
- `tests/dolar.test.js` is present. The test injects a dolarapi-shaped array (`casa` / `compra` / `venta`) via mocked `UrlFetchApp`.

- **Default venta.** Prove `=DOLAR("blue")` means venta. Run `.cursor/skills/verify-sheets-argento/helpers/verify.sh drive dolar`. Jest title `operacion por defecto es venta` passes and the mock blue venta is `1200`.
- **Promedio with null compra.** Prove blue promedio. Same command; title `promedio usa venta cuando compra es null` passes (`1200`).
- **Promedio with both sides.** Title `promedio calcula correctamente con compra y venta` passes (`925` for oficial).
- **MEP alias.** Title `alias mep resuelve a bolsa` passes (`venta` `1010`).
- **CCL alias.** Title `alias ccl resuelve a contadoconliqui` passes (`compra` `1020`).
- **Empty tipo.** Title `tipo vacío lanza error legible` passes with message containing `Tipo no proporcionado`.
- **Proof.** `${VERIFY_PROOF_DIR}/dolar/jest.txt` contains those titles and `jest_exit=0`. `${VERIFY_PROOF_DIR}/dolar/meta.txt` records `feature=dolar`.

## Gotchas

- Google Sheets is not running. A passing Jest file does not prove authorization prompts, semicolon separators, or cache TTL in Apps Script.
- Do not curl `https://dolarapi.com/v1/dolares` and call that `=DOLAR()`. The user path is the custom function; locally that is `DOLAR()` inside `all-in-one.js`.
- Rebuild before driving if `src/dolar.js` or `src/http.js` changed. Jest never reads `src/` directly.
- `npm test` also runs this file. Driving `dolar` still requires the dedicated Jest log so the feature id is attached to evidence.
- Aliases are `mep` → `bolsa` and `ccl` → `contadoconliqui`. Assert the resolved quote, not the string the user typed.
