#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="${ROOT_DIR}/cli/supercli.js"
TEMP_HOME="$(mktemp -d)"

cleanup() {
  rm -rf "${TEMP_HOME}"
}

trap cleanup EXIT

echo "== nullclaw skills plugin smoke test (interactive) =="

if ! command -v curl >/dev/null 2>&1; then
  echo "curl not found in PATH."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found in PATH"
  exit 1
fi

if ! command -v nullclaw >/dev/null 2>&1; then
  echo "nullclaw not found in PATH."
  echo "Install it first: brew install nullclaw"
  exit 1
fi

echo "Installing/refreshing nullclaw plugin..."
SUPERCLI_HOME="${TEMP_HOME}" node "${CLI}" plugins install nullclaw --on-conflict replace --json >/dev/null

echo "Listing indexed nullclaw skills..."
SUPERCLI_HOME="${TEMP_HOME}" node "${CLI}" skills list --catalog --provider nullclaw --json

echo "Fetching agent protocol skill..."
SUPERCLI_HOME="${TEMP_HOME}" node "${CLI}" skills get nullclaw:root.agents

echo "Fetching command reference skill..."
SUPERCLI_HOME="${TEMP_HOME}" node "${CLI}" skills get nullclaw:docs.en.commands

echo "Running wrapped version command..."
SUPERCLI_HOME="${TEMP_HOME}" node "${CLI}" nullclaw cli version --json

echo "Running passthrough command..."
SUPERCLI_HOME="${TEMP_HOME}" node "${CLI}" nullclaw --help

echo "Smoke test completed."
