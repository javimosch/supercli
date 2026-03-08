#!/usr/bin/env bash
set -euo pipefail

CONTAINER="${1:-demo-nginx}"

dcli docker container inspect --container "$CONTAINER" --json
