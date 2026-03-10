#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="${ROOT_DIR}/cli/supercli.js"

echo "== blogwatcher smoke test =="

if ! command -v blogwatcher >/dev/null 2>&1; then
  echo "blogwatcher not found in PATH."
  echo "Install it first and verify with: blogwatcher --version"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl not found in PATH"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found in PATH"
  exit 1
fi

TEMP_HOME="$(mktemp -d)"
trap 'rm -rf "${TEMP_HOME}"' EXIT
export HOME="${TEMP_HOME}"

echo "Installing/refreshing blogwatcher plugin..."
node "${CLI}" plugins install blogwatcher --on-conflict replace --json >/dev/null

echo "Checking indexed skills..."
node "${CLI}" skills list --catalog --provider blogwatcher --json
node "${CLI}" skills get blogwatcher:root.skill >/dev/null

echo "Running wrapped version command..."
node "${CLI}" blogwatcher cli version --json

echo "Running wrapped add/list/remove flow..."
node "${CLI}" blogwatcher blogs add --name "Example" --url "https://example.com/blog" --feed-url "https://example.com/feed.xml" --json
node "${CLI}" blogwatcher blogs list --json
node "${CLI}" blogwatcher blogs remove --name "Example" --json

echo "Running passthrough smoke test..."
node "${CLI}" blogwatcher --version

echo "Smoke test completed."
