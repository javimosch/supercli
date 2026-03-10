#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="${ROOT_DIR}/cli/supercli.js"

echo "== himalaya smoke test =="

if ! command -v himalaya >/dev/null 2>&1; then
  echo "himalaya not found in PATH."
  echo "Install it first and verify with: himalaya --version"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found in PATH"
  exit 1
fi

echo "Installing/refreshing himalaya plugin..."
node "${CLI}" plugins install himalaya --on-conflict replace --json >/dev/null

echo "Running wrapped version command..."
node "${CLI}" himalaya cli version --json

echo "Running wrapped account list command..."
node "${CLI}" himalaya account list --json

if [[ -n "${HIMALAYA_ACCOUNT:-}" ]]; then
  echo "Running wrapped folder list command..."
  node "${CLI}" himalaya folder list --account "${HIMALAYA_ACCOUNT}" --json

  if [[ -n "${HIMALAYA_FOLDER:-}" ]]; then
    echo "Running wrapped envelope list command..."
    node "${CLI}" himalaya envelope list --account "${HIMALAYA_ACCOUNT}" --folder "${HIMALAYA_FOLDER}" --page 1 --json
  else
    echo "Skipping envelope list test; set HIMALAYA_FOLDER to enable it."
  fi
else
  echo "Skipping account-scoped tests; set HIMALAYA_ACCOUNT to enable them."
fi

echo "Running passthrough smoke test..."
node "${CLI}" himalaya --help

echo "Smoke test completed."
