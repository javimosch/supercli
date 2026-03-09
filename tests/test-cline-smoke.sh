#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="${ROOT_DIR}/cli/supercli.js"

echo "== cline smoke test (interactive) =="

if ! command -v cline >/dev/null 2>&1; then
  echo "cline not found in PATH."
  echo "Install it first and verify with: cline --version"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found in PATH"
  exit 1
fi

echo "Installing/refreshing cline plugin..."
node "${CLI}" plugins install cline --on-conflict replace --json >/dev/null

echo "Running wrapped version command..."
node "${CLI}" cline cli version --json

echo "Running wrapped non-interactive task command..."
node "${CLI}" cline task run --prompt "List files with more LOC in cwd" --cwd . --timeout 30 --json

echo "Running passthrough smoke test..."
node "${CLI}" cline --help

echo "Syncing and checking local skill catalog..."
node "${CLI}" skills sync --json >/dev/null
node "${CLI}" skills get repo:cline-non-interactive >/dev/null

echo "Smoke test completed."
