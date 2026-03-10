#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="${ROOT_DIR}/cli/supercli.js"

echo "== mongosh smoke test =="

if ! command -v mongosh >/dev/null 2>&1; then
  echo "mongosh not found in PATH."
  echo "Install it first and verify with: mongosh --version"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found in PATH"
  exit 1
fi

echo "Installing/refreshing mongosh plugin..."
node "${CLI}" plugins install mongosh --on-conflict replace --json >/dev/null

echo "Running wrapped version command..."
node "${CLI}" mongosh cli version --json

if [[ -n "${MONGOSH_HOST:-}" ]]; then
  echo "Running wrapped server ping command..."
  node "${CLI}" mongosh server ping --host "${MONGOSH_HOST}" --json
elif [[ -n "${MONGODB_URI:-}" ]]; then
  echo "Running passthrough ping command with MONGODB_URI..."
  node "${CLI}" mongosh "${MONGODB_URI}" --quiet --json=relaxed --eval "db.adminCommand({ ping: 1 })" --json
else
  echo "Skipping live ping test; set MONGOSH_HOST or MONGODB_URI to enable it."
fi

echo "Running passthrough smoke test..."
node "${CLI}" mongosh --help

echo "Smoke test completed."
