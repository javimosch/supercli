#!/bin/bash
set -e

# Smoke test for resend plugin
# Usage: ./tests/test-resend-smoke.sh

echo "Running resend smoke test..."

# Setup isolated home
export SUPERCLI_HOME=$(mktemp -d)
trap "rm -rf $SUPERCLI_HOME" EXIT

# Find node
NODE_DIR=$(dirname $(which node))

# 1. Install plugin
node cli/supercli.js plugins install ./plugins/resend --on-conflict replace --json

# 2. Check doctor (node/npm checks should pass)
node cli/supercli.js plugins doctor resend --json | grep -q '"ok":true'

# 3. Check skills
node cli/supercli.js skills list --catalog --provider resend --json | grep -q "resend:root.readme"

# 4. Check doctor (expect dependency error when resend is hidden)
# We expect exit 1 because dep is missing
set +e
# Use a restricted PATH that includes node but NOT the global resend
OUT=$(PATH="$NODE_DIR" node cli/supercli.js resend cli doctor --json 2>&1)
EXIT_CODE=$?
set -e

echo "$OUT" | grep -q "Missing dependency 'resend'"
echo "$OUT" | grep -q "Please run 'dcli resend cli setup'"

echo "Resend smoke test passed!"
