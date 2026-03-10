#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="${ROOT_DIR}/cli/supercli.js"

echo "== wacli smoke test =="

if ! command -v wacli >/dev/null 2>&1; then
  echo "wacli not found in PATH."
  echo "Install it first and verify with: wacli --version"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found in PATH"
  exit 1
fi

echo "Installing/refreshing wacli plugin..."
node "${CLI}" plugins install wacli --on-conflict replace --json >/dev/null

echo "Running wrapped version command..."
node "${CLI}" wacli cli version --json

TEMP_STORE="$(mktemp -d)"
trap 'rm -rf "${TEMP_STORE}"' EXIT

echo "Running safe diagnostics..."
node "${CLI}" wacli doctor run --store "${TEMP_STORE}" --json
node "${CLI}" wacli auth status --store "${TEMP_STORE}" --json

if [[ -n "${WACLI_STORE:-}" ]]; then
  echo "Running read-only store-backed commands..."
  node "${CLI}" wacli chats list --store "${WACLI_STORE}" --json
  if [[ -n "${WACLI_CHAT_JID:-}" ]]; then
    node "${CLI}" wacli messages list --store "${WACLI_STORE}" --chat "${WACLI_CHAT_JID}" --limit 10 --json
  else
    echo "Skipping messages list test; set WACLI_CHAT_JID to enable it."
  fi
else
  echo "Skipping store-backed chat/message tests; set WACLI_STORE to enable them."
fi

echo "Smoke test completed."
