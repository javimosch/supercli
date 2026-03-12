#!/bin/bash
set -e

# Smoke test for monty plugin
# Usage: ./tests/test-monty-smoke.sh

echo "Running monty smoke test..."

# Setup isolated home
export SUPERCLI_HOME=$(mktemp -d)
trap "rm -rf $SUPERCLI_HOME" EXIT

# 1. Install plugin
node cli/supercli.js plugins install ./plugins/monty --on-conflict replace --json

# 2. Check doctor
node cli/supercli.js plugins doctor monty --json | grep -q '"ok":true'

# 3. Check skills
node cli/supercli.js skills list --catalog --provider monty --json | grep -q "monty:root.skill"
node cli/supercli.js skills list --catalog --provider monty --json | grep -q "monty:root.usage"

# 4. Check version (expect dependency error but valid JSON)
# We expect exit 1 because dep is missing
set +e
OUT=$(node cli/supercli.js monty cli version --json 2>&1)
EXIT_CODE=$?
set -e

echo "$OUT" | grep -q "@pydantic/monty not found"

echo "Monty smoke test passed!"
