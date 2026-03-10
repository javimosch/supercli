#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="${ROOT_DIR}/cli/supercli.js"

echo "== mysql smoke test =="

if ! command -v mysql >/dev/null 2>&1; then
  echo "mysql not found in PATH."
  echo "Install it first and verify with: mysql --version"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found in PATH"
  exit 1
fi

echo "Installing/refreshing mysql plugin..."
node "${CLI}" plugins install mysql --on-conflict replace --json >/dev/null

echo "Running wrapped version command..."
node "${CLI}" mysql cli version --json

if [[ -n "${MYSQL_HOST:-}" && -n "${MYSQL_USER:-}" && -n "${MYSQL_DATABASE:-}" ]]; then
  echo "Running wrapped query command..."
  node "${CLI}" mysql query execute --execute "select 1" --host "${MYSQL_HOST}" --user "${MYSQL_USER}" --database "${MYSQL_DATABASE}" --json
else
  echo "Skipping live query test; set MYSQL_HOST, MYSQL_USER, and MYSQL_DATABASE to enable it."
fi

echo "Running passthrough smoke test..."
node "${CLI}" mysql --help

echo "Smoke test completed."
