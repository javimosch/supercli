#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="${ROOT_DIR}/cli/supercli.js"
LOCAL_LINEAR_BIN="${ROOT_DIR}/node_modules/.bin/linear"

LINEAR_CMD=()
LINEAR_CMD_LABEL=""

resolve_linear_cmd() {
  if command -v linear >/dev/null 2>&1; then
    LINEAR_CMD=("linear")
    LINEAR_CMD_LABEL="linear"
    return 0
  fi
  if [[ -x "${LOCAL_LINEAR_BIN}" ]]; then
    LINEAR_CMD=("${LOCAL_LINEAR_BIN}")
    LINEAR_CMD_LABEL="${LOCAL_LINEAR_BIN}"
    return 0
  fi
  if npx --no-install linear --help >/dev/null 2>&1; then
    LINEAR_CMD=("npx" "--no-install" "linear")
    LINEAR_CMD_LABEL="npx --no-install linear"
    return 0
  fi
  return 1
}

run_linear() {
  "${LINEAR_CMD[@]}" "$@"
}

echo "== Linear smoke test (interactive) =="

if ! resolve_linear_cmd; then
  echo "Linear CLI not found."
  echo "Checked:"
  echo "  - PATH binary: linear"
  echo "  - Local bin: ${LOCAL_LINEAR_BIN}"
  echo "  - npx --no-install linear"
  echo "Install one of these and rerun:"
  echo "  npm install -g @schpet/linear-cli"
  echo "  npm install -D @schpet/linear-cli"
  exit 1
fi

echo "Using Linear command: ${LINEAR_CMD_LABEL}"

# Ensure dcli process-adapter preflight can resolve `linear` via PATH even when
# the CLI is only installed locally in node_modules/.bin.
if [[ -x "${LOCAL_LINEAR_BIN}" ]]; then
  export PATH="$(dirname "${LOCAL_LINEAR_BIN}"):${PATH}"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found in PATH"
  exit 1
fi

echo "Installing/refreshing linear plugin..."
node "${CLI}" plugins install linear --on-conflict replace --json >/dev/null

echo "Checking Linear authentication (auth whoami)..."
if ! run_linear auth whoami >/dev/null 2>&1; then
  if [[ ! -t 0 ]]; then
    echo "Not authenticated and no TTY available. Run a Linear login command manually, then rerun this script."
    exit 1
  fi

  echo "Linear login is required for live smoke tests."
  read -r -p "Run 'linear auth login' now? [Y/n] " ANSWER
  ANSWER="${ANSWER:-Y}"
  if [[ "${ANSWER}" =~ ^[Yy]$ ]]; then
    run_linear auth login
  else
    echo "Cancelled. Run a Linear login command and retry when ready."
    exit 1
  fi

  if ! run_linear auth whoami >/dev/null 2>&1; then
    echo "Linear authentication check still failed after login."
    echo "Verify with: ${LINEAR_CMD_LABEL} auth whoami"
    exit 1
  fi
else
  echo "Linear CLI is already authenticated. Skipping login."
fi

echo "Running wrapped command smoke test..."
node "${CLI}" linear account whoami --json

echo "Running passthrough smoke test..."
node "${CLI}" linear --help

echo "Smoke test completed."
