# Google Sheets Argento verification map

This directory is the maintained source for verifying user-facing behavior of Google Sheets Argento. Read the index before driving, then use the matching feature file as the recipe.

The product users actually type is `=DOLAR("blue")` in a Google Sheet. **That surface is not available on this VM.** Local verification drives the shipped bundle (`all-in-one.js`) through Jest and the static docs/API HTTP server started by `helpers/verify.sh launch`.

## Baseline preconditions

- Repository root is `google-sheets-argento` (contains `package.json`, `src/`, `tests/`, `docs/`, `all-in-one.js`).
- Set `VERIFY_RUN_ID` to a unique id and `VERIFY_PROOF_DIR` if you need a non-default evidence path.
- Run `.cursor/skills/verify-sheets-argento/helpers/verify.sh launch` then `… doctor`.
- Require `DOCTOR_OK`, a docs server on `http://127.0.0.1:${VERIFY_DOCS_PORT}` (default `8765`) owned by this run’s PID, and `all-in-one.js` containing `function DOLAR`.
- Never drive a docs server this run did not start. Never open or claim a real Google Sheet.

## Driving conventions

- Start every recipe from the launched stack unless the feature file says otherwise.
- Formula features: `helpers/verify.sh drive <feature>` (Jest via `tests/test-wrapper.js`).
- HTTP features: the same helper `curl`s loopback; do not use the GitHub Pages URL as the only proof of a local change.
- Treat every command as literal. Keep test file paths and HTML ids unchanged.
- Rebuild with `npm run build` after any `src/` or `data/cedears.json` edit before driving formulas or the CEDEAR API.
- Restore nothing on disk for formula tests (they are stateless). Do not delete proof artifacts during cleanup.

## Proof and skip reporting

- Capture the command output and the resulting assertion or HTTP body, not only a green summary line.
- Formula proof includes the Jest file path, matching test titles, and `jest_exit=0`.
- HTTP proof includes status 200, a body snippet with the expected id or JSON key, and (for CEDEAR JSON) `schema_version` plus `count` matching `docs/api/cedears.json` on disk.
- Record the feature id and entry points in `meta.txt`.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report Google Sheets as verified. Do not report a skipped entry point as verified through a different path.
- Live fetches to `dolarapi.com` / `data912.com` are not a substitute for `=DOLAR()` / `=CEDEAR()` in Sheets.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with verify-sheets-argento` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Dólar quotes](./dolar.md) covers `=DOLAR()` aliases, default venta, promedio, and empty-tipo errors via Jest.
- [CEDEAR formulas and JSON API](./cedear.md) covers `=CEDEAR()` metadata via Jest and `GET /api/cedears.json`.
- [Caución](./caucion.md) covers colocadora/tomadora net amounts and zero-day rejection (no network).
- [Docs site](./docs-site.md) covers the local landing: install, catalog, changelog, and the static CEDEAR API link.
