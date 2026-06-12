# AGENTS.md

## Cursor Cloud specific instructions

This is a **Google Apps Script library** (not a web app/server). Source files in `src/` are designed for the Apps Script runtime. Local Node.js tooling is used only for building and testing.

### Key commands

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Build | `npm run build` (concatenates `src/*.js` into `all-in-one.js`) |
| Test | `npm test` (Jest, includes integration tests with 30s timeout) |

### Notes

- **No linter** is configured in this project.
- **Build before test**: Tests load `all-in-one.js` via `tests/test-wrapper.js`, so you must run `npm run build` before `npm test` whenever source files change.
- **Integration tests call live APIs** (DolarAPI, ArgentinaDatos, Data912, etc.). These may occasionally fail due to API downtime or rate limiting — this is expected and not a code issue.
- **No environment variables or secrets** are required.
- **No Docker, no database, no backend server** — the only service needed is Node.js with npm.
