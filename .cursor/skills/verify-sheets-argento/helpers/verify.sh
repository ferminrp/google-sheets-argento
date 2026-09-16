#!/usr/bin/env bash
# Local verification harness for Google Sheets Argento.
# Usage (from repo root or via absolute path):
#   VERIFY_RUN_ID=... VERIFY_DOCS_PORT=8765 helpers/verify.sh launch|doctor|drive <feature>|cleanup
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${SKILL_DIR}/../../.." && pwd)"

VERIFY_RUN_ID="${VERIFY_RUN_ID:-$$}"
VERIFY_DOCS_PORT="${VERIFY_DOCS_PORT:-8765}"
VERIFY_STATE_DIR="${VERIFY_STATE_DIR:-/tmp/sheets-argento-verify-${VERIFY_RUN_ID}}"
VERIFY_PROOF_DIR="${VERIFY_PROOF_DIR:-/tmp/sheets-argento-verify-proof-${VERIFY_RUN_ID}}"
STATE_FILE="${VERIFY_STATE_DIR}/state.env"
SERVER_LOG="${VERIFY_STATE_DIR}/docs-server.log"

FEATURES_HELP="dolar|cedear|caucion|docs-site"

die() {
  echo "ERROR: $*" >&2
  exit 1
}

load_state() {
  if [[ ! -f "${STATE_FILE}" ]]; then
    die "no state file at ${STATE_FILE}. Run launch first (same VERIFY_RUN_ID)."
  fi
  # shellcheck disable=SC1090
  source "${STATE_FILE}"
}

write_state() {
  mkdir -p "${VERIFY_STATE_DIR}"
  cat > "${STATE_FILE}" <<EOF
REPO_ROOT=$(printf '%q' "${REPO_ROOT}")
VERIFY_RUN_ID=$(printf '%q' "${VERIFY_RUN_ID}")
VERIFY_DOCS_PORT=$(printf '%q' "${VERIFY_DOCS_PORT}")
VERIFY_PROOF_DIR=$(printf '%q' "${VERIFY_PROOF_DIR}")
DOCS_PID=$(printf '%q' "${DOCS_PID}")
EOF
}

docs_url() {
  echo "http://127.0.0.1:${VERIFY_DOCS_PORT}"
}

wait_for_docs() {
  local i
  for i in $(seq 1 25); do
    if curl -sf "$(docs_url)/" >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.2
  done
  die "docs server did not become ready on $(docs_url)/ (log: ${SERVER_LOG})"
}

pid_is_our_docs_server() {
  local pid="$1"
  [[ -n "${pid}" && -d "/proc/${pid}" ]] || return 1
  local cmd
  cmd="$(tr '\0' ' ' < "/proc/${pid}/cmdline" 2>/dev/null || true)"
  echo "${cmd}" | grep -q "http.server" || return 1
  echo "${cmd}" | grep -q "${VERIFY_DOCS_PORT}" || return 1
  return 0
}

port_in_use() {
  python3 - "${VERIFY_DOCS_PORT}" <<'PY'
import socket, sys
port = int(sys.argv[1])
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
try:
    s.bind(("127.0.0.1", port))
except OSError:
    sys.exit(0)
finally:
    s.close()
sys.exit(1)
PY
}

cmd_launch() {
  mkdir -p "${VERIFY_STATE_DIR}" "${VERIFY_PROOF_DIR}"
  cd "${REPO_ROOT}"

  if [[ ! -d "${REPO_ROOT}/node_modules/jest" ]]; then
    if [[ -f "${REPO_ROOT}/package-lock.json" ]]; then
      npm ci
    else
      npm install
    fi
  fi

  npm run build

  [[ -f "${REPO_ROOT}/all-in-one.js" ]] || die "build did not write all-in-one.js"
  [[ -f "${REPO_ROOT}/docs/api/cedears.json" ]] || die "build did not write docs/api/cedears.json"

  if [[ -f "${STATE_FILE}" ]]; then
    # shellcheck disable=SC1090
    source "${STATE_FILE}"
    if pid_is_our_docs_server "${DOCS_PID:-}"; then
      echo "LAUNCH_OK repo=${REPO_ROOT} port=${VERIFY_DOCS_PORT} pid=${DOCS_PID} proof=${VERIFY_PROOF_DIR} (already running)"
      return 0
    fi
  fi

  if port_in_use; then
    die "port ${VERIFY_DOCS_PORT} is already in use. Set VERIFY_DOCS_PORT to a free loopback port. Do not drive a server this run did not start."
  fi

  python3 -m http.server "${VERIFY_DOCS_PORT}" --bind 127.0.0.1 --directory "${REPO_ROOT}/docs" \
    >"${SERVER_LOG}" 2>&1 &
  DOCS_PID=$!
  write_state
  wait_for_docs

  if ! pid_is_our_docs_server "${DOCS_PID}"; then
    die "started pid ${DOCS_PID} but cmdline is not our http.server"
  fi

  echo "LAUNCH_OK repo=${REPO_ROOT} port=${VERIFY_DOCS_PORT} pid=${DOCS_PID} proof=${VERIFY_PROOF_DIR}"
}

cmd_doctor() {
  cd "${REPO_ROOT}"
  local fail=0
  say() { echo "DOCTOR: $*"; }
  bad() { echo "DOCTOR: FAIL: $*" >&2; fail=1; }

  command -v node >/dev/null || bad "node not on PATH"
  command -v npm >/dev/null || bad "npm not on PATH"
  command -v python3 >/dev/null || bad "python3 not on PATH"
  command -v curl >/dev/null || bad "curl not on PATH"
  [[ -d "${REPO_ROOT}/node_modules/jest" ]] || bad "node_modules/jest missing (run launch)"
  [[ -f "${REPO_ROOT}/all-in-one.js" ]] || bad "all-in-one.js missing (run launch / npm run build)"
  [[ -f "${REPO_ROOT}/tests/test-wrapper.js" ]] || bad "tests/test-wrapper.js missing"

  if [[ -f "${REPO_ROOT}/all-in-one.js" ]]; then
    grep -q "function DOLAR" "${REPO_ROOT}/all-in-one.js" || bad "all-in-one.js missing function DOLAR"
    grep -q "function CEDEAR" "${REPO_ROOT}/all-in-one.js" || bad "all-in-one.js missing function CEDEAR"
    grep -q "function CAUCIONCOLOCADORA" "${REPO_ROOT}/all-in-one.js" || bad "all-in-one.js missing function CAUCIONCOLOCADORA"
  fi

  if [[ -f "${REPO_ROOT}/tests/test-wrapper.js" ]]; then
    grep -q "all-in-one.js" "${REPO_ROOT}/tests/test-wrapper.js" || bad "test-wrapper.js does not load all-in-one.js"
  fi

  python3 - "${REPO_ROOT}" <<'PY' || bad "cedears JSON failed schema checks"
import json, sys
root = sys.argv[1]
raw_path = f"{root}/data/cedears.json"
api_path = f"{root}/docs/api/cedears.json"
with open(raw_path) as f:
    raw = json.load(f)
if not isinstance(raw, list) or not raw:
    print("data/cedears.json must be a non-empty array", file=sys.stderr)
    sys.exit(1)
with open(api_path) as f:
    api = json.load(f)
if api.get("schema_version") != 1 or api.get("name") != "cedears":
    print("docs/api/cedears.json missing schema_version=1 or name=cedears", file=sys.stderr)
    sys.exit(1)
if not isinstance(api.get("items"), list) or not api["items"]:
    print("docs/api/cedears.json items empty", file=sys.stderr)
    sys.exit(1)
tickers = {i.get("Cedears") for i in api["items"]}
if "AAPL" not in tickers:
    print("docs/api/cedears.json has no AAPL item", file=sys.stderr)
    sys.exit(1)
PY

  if [[ ! -f "${STATE_FILE}" ]]; then
    bad "no launch state at ${STATE_FILE}"
  else
    load_state
    if ! pid_is_our_docs_server "${DOCS_PID:-}"; then
      bad "DOCS_PID ${DOCS_PID:-unset} is not our http.server on port ${VERIFY_DOCS_PORT}"
    fi
    local code body
    code="$(curl -sS -o /tmp/sheets-argento-doctor-index-$$.html -w "%{http_code}" "$(docs_url)/" || true)"
    [[ "${code}" == "200" ]] || bad "GET / returned ${code:-curl-failed}"
    if [[ -f /tmp/sheets-argento-doctor-index-$$.html ]]; then
      body="$(cat /tmp/sheets-argento-doctor-index-$$.html)"
      echo "${body}" | grep -q "<title>Google Sheets Argento" || bad "GET / missing <title>Google Sheets Argento"
      echo "${body}" | grep -q 'id="funciones"' || bad "GET / missing id=funciones"
      echo "${body}" | grep -q 'id="instalacion"' || bad "GET / missing id=instalacion"
      rm -f /tmp/sheets-argento-doctor-index-$$.html
    fi
    code="$(curl -sS -o /tmp/sheets-argento-doctor-api-$$.json -w "%{http_code}" "$(docs_url)/api/cedears.json" || true)"
    [[ "${code}" == "200" ]] || bad "GET /api/cedears.json returned ${code:-curl-failed}"
    if [[ -f /tmp/sheets-argento-doctor-api-$$.json ]]; then
      python3 - /tmp/sheets-argento-doctor-api-$$.json <<'PY' || bad "served cedears.json invalid"
import json, sys
api = json.load(open(sys.argv[1]))
assert api.get("schema_version") == 1
assert api.get("name") == "cedears"
assert any(i.get("Cedears") == "AAPL" for i in api.get("items") or [])
PY
      rm -f /tmp/sheets-argento-doctor-api-$$.json
    fi
  fi

  if [[ "${fail}" -ne 0 ]]; then
    echo "DOCTOR_FAIL"
    exit 1
  fi
  echo "DOCTOR_OK repo=${REPO_ROOT} port=${VERIFY_DOCS_PORT} proof=${VERIFY_PROOF_DIR}"
}

feature_meta() {
  local feature="$1"
  local dir="$2"
  mkdir -p "${dir}"
  {
    echo "feature=${feature}"
    echo "utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "repo=${REPO_ROOT}"
    echo "head=$(git -C "${REPO_ROOT}" rev-parse HEAD 2>/dev/null || echo unknown)"
    echo "docs_url=$(docs_url)"
  } > "${dir}/meta.txt"
}

run_jest() {
  local spec="$1"
  local out="$2"
  cd "${REPO_ROOT}"
  set +e
  npx jest "${spec}" --coverage=false --verbose >"${out}" 2>&1
  local code=$?
  set -e
  echo "jest_exit=${code}" >> "${out}"
  return "${code}"
}

assert_file_contains() {
  local file="$1"
  local needle="$2"
  grep -F -q "${needle}" "${file}" || die "expected ${file} to contain: ${needle}"
}

cmd_drive() {
  local feature="${1:-}"
  [[ -n "${feature}" ]] || die "drive requires a feature: ${FEATURES_HELP}"
  load_state
  pid_is_our_docs_server "${DOCS_PID}" || die "docs server not healthy; run doctor"
  local proof="${VERIFY_PROOF_DIR}/${feature}"
  mkdir -p "${proof}"
  feature_meta "${feature}" "${proof}"

  case "${feature}" in
    dolar)
      echo "entry_points=jest:tests/dolar.test.js" >> "${proof}/meta.txt"
      run_jest "tests/dolar.test.js" "${proof}/jest.txt"
      assert_file_contains "${proof}/jest.txt" "alias mep resuelve a bolsa"
      assert_file_contains "${proof}/jest.txt" "alias ccl resuelve a contadoconliqui"
      assert_file_contains "${proof}/jest.txt" "operacion por defecto es venta"
      assert_file_contains "${proof}/jest.txt" "jest_exit=0"
      ;;
    cedear)
      echo "entry_points=jest:tests/cedear.test.js,http:/api/cedears.json" >> "${proof}/meta.txt"
      run_jest "tests/cedear.test.js" "${proof}/jest.txt"
      assert_file_contains "${proof}/jest.txt" "sector devuelve metadata yfinance del JSON"
      assert_file_contains "${proof}/jest.txt" "jest_exit=0"
      curl -sS -D "${proof}/http-cedears.headers.txt" -o "${proof}/http-cedears.json" "$(docs_url)/api/cedears.json"
      python3 - "${proof}/http-cedears.json" "${REPO_ROOT}/docs/api/cedears.json" <<'PY'
import json, sys
served = json.load(open(sys.argv[1]))
disk = json.load(open(sys.argv[2]))
assert served.get("schema_version") == 1
assert served.get("name") == "cedears"
assert served.get("count") == disk.get("count")
aapl = next(i for i in served["items"] if i.get("Cedears") == "AAPL")
assert "Ratio" in aapl
PY
      grep -q "200" "${proof}/http-cedears.headers.txt" || grep -qi "HTTP/" "${proof}/http-cedears.headers.txt"
      ;;
    caucion)
      echo "entry_points=jest:tests/all-in-one.test.js" >> "${proof}/meta.txt"
      run_jest "tests/all-in-one.test.js" "${proof}/jest.txt"
      assert_file_contains "${proof}/jest.txt" "CAUCIONCOLOCADORA"
      assert_file_contains "${proof}/jest.txt" "CAUCIONTOMADORA"
      assert_file_contains "${proof}/jest.txt" "rechaza dias === 0"
      assert_file_contains "${proof}/jest.txt" "jest_exit=0"
      ;;
    docs-site)
      echo "entry_points=http:/,http:/changelog.html,http:/api/cedears.json" >> "${proof}/meta.txt"
      curl -sS -D "${proof}/http-index.headers.txt" -o "${proof}/http-index.html" "$(docs_url)/"
      curl -sS -D "${proof}/http-changelog.headers.txt" -o "${proof}/http-changelog.html" "$(docs_url)/changelog.html"
      curl -sS -D "${proof}/http-cedears.headers.txt" -o "${proof}/http-cedears.json" "$(docs_url)/api/cedears.json"
      grep -q "200" "${proof}/http-index.headers.txt" || grep -qi "HTTP/1.0 200" "${proof}/http-index.headers.txt"
      assert_file_contains "${proof}/http-index.html" "<title>Google Sheets Argento"
      assert_file_contains "${proof}/http-index.html" 'id="instalacion"'
      assert_file_contains "${proof}/http-index.html" 'id="funciones"'
      assert_file_contains "${proof}/http-index.html" 'id="api"'
      assert_file_contains "${proof}/http-index.html" '=DOLAR("blue")'
      assert_file_contains "${proof}/http-index.html" "Catálogo de funciones"
      assert_file_contains "${proof}/http-changelog.html" "Changelog"
      python3 - "${proof}/http-cedears.json" <<'PY'
import json, sys
api = json.load(open(sys.argv[1]))
assert api["schema_version"] == 1
assert api["name"] == "cedears"
assert api["count"] >= 1
PY
      ;;
    *)
      die "unknown feature '${feature}'. Use ${FEATURES_HELP}"
      ;;
  esac

  echo "DRIVE_OK feature=${feature} proof=${proof}"
}

cmd_cleanup() {
  if [[ ! -f "${STATE_FILE}" ]]; then
    echo "CLEANUP_OK nothing to stop (no state at ${STATE_FILE}); proof=${VERIFY_PROOF_DIR}"
    return 0
  fi
  load_state
  if [[ -n "${DOCS_PID:-}" ]] && pid_is_our_docs_server "${DOCS_PID}"; then
    kill -TERM "${DOCS_PID}" 2>/dev/null || true
    local i
    for i in $(seq 1 20); do
      if ! kill -0 "${DOCS_PID}" 2>/dev/null; then
        break
      fi
      sleep 0.1
    done
    if kill -0 "${DOCS_PID}" 2>/dev/null; then
      kill -KILL "${DOCS_PID}" 2>/dev/null || true
    fi
    echo "CLEANUP: stopped docs pid ${DOCS_PID}"
  elif [[ -n "${DOCS_PID:-}" ]]; then
    echo "CLEANUP: pid ${DOCS_PID} is not our http.server; not killing"
  fi
  rm -rf "${VERIFY_STATE_DIR}"
  echo "CLEANUP_OK proof=${VERIFY_PROOF_DIR} (not deleted)"
}

main() {
  local cmd="${1:-}"
  shift || true
  case "${cmd}" in
    launch) cmd_launch "$@" ;;
    doctor) cmd_doctor "$@" ;;
    drive) cmd_drive "$@" ;;
    cleanup) cmd_cleanup "$@" ;;
    *) die "usage: verify.sh launch|doctor|drive ${FEATURES_HELP}|cleanup" ;;
  esac
}

main "$@"
