---
name: verify-sheets-argento
description: >-
  Verify Google Sheets Argento locally: launch the Node build/Jest stack and
  the static docs site, then prove formula behavior (DOLAR, CEDEAR, caución)
  and the public CEDEAR JSON. Use after src/, tests/, data/, or docs/ changes.
  A real Google Sheet is not driveable here.
---

# Verify Google Sheets Argento

Agent-facing control skill. Read this file, then `features/README.md`, then the matching feature file. Do not invent a Google Sheets session.

## Surfaces (honest)

| Surface | Driveable here? | What it is |
| --- | --- | --- |
| Google Sheets custom functions (`=DOLAR()`, `=CEDEAR()`, `=CAUCIONCOLOCADORA()`, …) via `all-in-one.js` pasted into Apps Script | **No.** There is no Sheet, no Apps Script runtime, and no OAuth on this VM. Do not report Sheets cell evaluation as verified. | Primary user product. |
| Local formula library | **Yes.** `npm run build` concatenates `src/*.js` into `all-in-one.js`. Jest loads that bundle through `tests/test-wrapper.js` (mocks `UrlFetchApp` / `CacheService`). | Closest stand-in for calling the custom functions. |
| Static docs site (`docs/`) | **Yes.** `python3 -m http.server` serving `docs/` on loopback. | Landing, install steps, formula catalog, changelog. |
| Public CEDEAR JSON | **Yes.** `docs/api/cedears.json` (published by `npm run build` from `data/cedears.json`). Also live at `https://ferminrp.github.io/google-sheets-argento/api/cedears.json`. | Agent/script API for CEDEAR ratios. |

**Primary driveable surface:** the local verification stack (build + Jest + docs HTTP). Treat the Sheets library as documented-but-not-driveable.

## Launch

There is no long-running Apps Script process. Launch means: install deps, build the bundle, start a **dedicated** docs server owned by this run.

```bash
export VERIFY_RUN_ID="${VERIFY_RUN_ID:-$(date +%Y%m%d%H%M%S)-$$}"
export VERIFY_DOCS_PORT="${VERIFY_DOCS_PORT:-8765}"
export VERIFY_PROOF_DIR="${VERIFY_PROOF_DIR:-/tmp/sheets-argento-verify-proof-$VERIFY_RUN_ID}"
.cursor/skills/verify-sheets-argento/helpers/verify.sh launch
```

Ready when the helper prints:

```
LAUNCH_OK repo=<abs> port=<port> pid=<pid> proof=<proof-dir>
```

and `curl -sf "http://127.0.0.1:${VERIFY_DOCS_PORT}/"` contains `Google Sheets Argento`.

Build side effects (must succeed before Jest):

- stdout includes `Archivo consolidado generado exitosamente en all-in-one.js`
- stdout includes `API CEDEARs publicada en docs/api/cedears.json`
- `all-in-one.js` and `docs/api/cedears.json` exist at repo root / `docs/api/`

Teardown is **Cleanup**, not Ctrl-C by name. Keep the docs server until cleanup. Jest drives are short-lived and do not need a daemon.

If `npm run build` fails, stop. Do not drive tests against a stale `all-in-one.js`. Tests always load the bundle via `tests/test-wrapper.js`; `src/` edits are invisible to Jest until rebuild.

## Doctor

Read-only. Run first whenever anything looks off. Never start a second docs server to “fix” doctor.

```bash
.cursor/skills/verify-sheets-argento/helpers/verify.sh doctor
```

Pass means all of:

- `node` and `npm` on PATH; `node_modules/jest` present.
- `all-in-one.js` contains the function declarations `function DOLAR`, `function CEDEAR`, `function CAUCIONCOLOCADORA`.
- `tests/test-wrapper.js` exists and `require()`s `../all-in-one.js`.
- `data/cedears.json` is a JSON array; `docs/api/cedears.json` has `"schema_version": 1` and `"name": "cedears"`.
- State file for this `VERIFY_RUN_ID` exists; `DOCS_PID` is alive; `/proc/$DOCS_PID/cmdline` is `python3 -m http.server` (or `python`) for this port.
- `curl -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:${VERIFY_DOCS_PORT}/"` is `200`.
- Body of `/` contains `<title>Google Sheets Argento` and `id="funciones"`.
- Body of `/api/cedears.json` parses as JSON with `count` ≥ 1 and at least one item whose `Cedears` is `AAPL`.

Fail and **refuse to drive** if:

- Port `VERIFY_DOCS_PORT` answers but there is no matching PID file for this run (someone else’s server).
- `all-in-one.js` is missing (build did not run).
- Doctor prints `DOCTOR_FAIL`.

## Drive

Harness: `helpers/verify.sh` (Jest for formulas, `curl` for docs/API). Stable handles are **function names**, Jest test titles, HTML ids, and JSON keys — not pixel coordinates.

```bash
.cursor/skills/verify-sheets-argento/helpers/verify.sh drive <feature>
```

`<feature>` is one of: `dolar` | `cedear` | `caucion` | `docs-site`.

Read `features/<feature>.md` and execute **that** recipe. A single Jest file or a single HTTP GET is incomplete when the map lists more entry points for that feature.

Conventions:

- Always `npm run build` before Jest if `src/` or `data/cedears.json` changed in this run (launch already did this).
- Jest must go through `tests/test-wrapper.js` → `all-in-one.js`. Do not `require()` `src/*.js` as a substitute proof.
- Pass `--coverage=false` on targeted Jest runs so `coverage/` noise is not treated as proof.
- Live market HTTP from this VM is **not** the user path for `=DOLAR()`. Unit tests mock `UrlFetchApp`. Do not call `dolarapi.com` and claim `=DOLAR("blue")` worked in Sheets.
- Argentine Sheets locales use `;` as the argument separator (`=DOLAR("blue";"venta")`). Jest calls use JavaScript commas. Both are the same function.

Isolation:

- Docs server: one port per `VERIFY_RUN_ID`. Default `8765`. Override with `VERIFY_DOCS_PORT` if that port is taken **before** launch. Do not reuse a port that already serves some other `docs/` tree.
- Jest: no shared mutable disk state. Safe to run one feature at a time on this checkout. Do not start a second verification run against the same working tree if you are about to mutate `all-in-one.js`.
- Never kill by process name. Only the PID recorded at launch.

## Evidence

Proof directory (survives cleanup):

```text
${VERIFY_PROOF_DIR}/           # default /tmp/sheets-argento-verify-proof-$VERIFY_RUN_ID
  <feature>/
    meta.txt                   # feature id, entry points driven, UTC time, git HEAD
    jest.txt                   # full Jest stdout+stderr + exit code (formula features)
    http-index.txt             # curl -sS -D - for / (docs-site)
    http-changelog.txt         # curl for /changelog.html
    http-cedears.json          # body of /api/cedears.json (cedear + docs-site)
    http-cedears.headers.txt   # response headers for the JSON
```

The helper writes these files. Do not delete `$VERIFY_PROOF_DIR` in cleanup.

Standards:

- Drive the mapped user path. For formulas that is `DOLAR`/`CEDEAR`/`CAUCION*` through the wrapper, not a reimplementation in the shell.
- Capture the command and the result (Jest assertion output or HTTP status + body), not only “tests passed”.
- Side effects: after `drive cedear` or `docs-site`, the JSON file on disk (`docs/api/cedears.json`) must match the served body (same `schema_version` and `count`).
- Mocks: `UrlFetchApp` is the production HTTP boundary inside Apps Script. Jest mocks it. That is allowed. Calling a test-only function that does not exist in `all-in-one.js` is not allowed.
- `npm test` is a full-suite sweep, not a substitute for a feature recipe, unless you then map each failing/passing file back to feature ids.
- After cleanup, confirm `$VERIFY_PROOF_DIR/<feature>/` still exists and is non-empty.

## Cleanup

```bash
.cursor/skills/verify-sheets-argento/helpers/verify.sh cleanup
```

This:

- Sends `TERM` then `KILL` to **only** `DOCS_PID` from this run’s state file, after verifying the PID’s cmdline still looks like `http.server`.
- Removes `/tmp/sheets-argento-verify-$VERIFY_RUN_ID/` (PID, state.env, server log).
- Does **not** remove `$VERIFY_PROOF_DIR`.
- Does **not** revert `all-in-one.js`, `docs/api/cedears.json`, or `coverage/`.
- Does **not** `pkill python` or `pkill node`.

If launch failed after the server started, still run cleanup.

## Helpers

All helpers live in `.cursor/skills/verify-sheets-argento/helpers/`. `verify.sh` is executable.

| Invocation | What it does |
| --- | --- |
| `helpers/verify.sh launch` | `npm ci` or `npm install` if `node_modules/jest` missing; `npm run build`; start loopback docs server; write state; wait until `/` returns 200. |
| `helpers/verify.sh doctor` | Read-only health check; exit 0 prints `DOCTOR_OK`, else `DOCTOR_FAIL` and exit 1. |
| `helpers/verify.sh drive dolar` | Jest `tests/dolar.test.js`. |
| `helpers/verify.sh drive cedear` | Jest `tests/cedear.test.js` plus GET `/api/cedears.json`. |
| `helpers/verify.sh drive caucion` | Jest `tests/all-in-one.test.js` (caución + `ACCIONES` empty-symbol). |
| `helpers/verify.sh drive docs-site` | GET `/`, `/changelog.html`, `/api/cedears.json`; assert catalog strings. |
| `helpers/verify.sh cleanup` | Stop this run’s docs server; delete scratch; keep proof. |

Repo-relative paths assume cwd is the repository root (`google-sheets-argento`). The helper locates the repo from its own path, so it may be invoked by absolute path.

Environment:

| Variable | Default | Role |
| --- | --- | --- |
| `VERIFY_RUN_ID` | timestamp-pid | Isolates state dir and proof dir names. |
| `VERIFY_DOCS_PORT` | `8765` | Loopback port for `docs/`. |
| `VERIFY_PROOF_DIR` | `/tmp/sheets-argento-verify-proof-$VERIFY_RUN_ID` | Evidence; not deleted. |
| `VERIFY_STATE_DIR` | `/tmp/sheets-argento-verify-$VERIFY_RUN_ID` | PID + `state.env`; deleted on cleanup. |

## Maintenance

When formulas, Jest files, or `docs/` change, update the matching file under `features/` so the map stays honest. Use `/maintain-verification-skill`.
