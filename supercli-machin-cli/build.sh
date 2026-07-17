#!/usr/bin/env bash
# build.sh — compile sc-machin from src/*.src.
# Requires: machin (https://github.com/javimosch/machin) and a C compiler on PATH.
set -euo pipefail
cd "$(dirname "$0")"

SRC_ORDER="src/strutil.src src/pathutil.src src/argv.src src/lockfile.src src/commands.src src/registry.src src/executor.src src/plugins.src src/bootstrap.src src/mcp.src src/main.src"

echo "== encode =="
machin encode $SRC_ORDER > app.mfl

echo "== build =="
machin build app.mfl -o sc-machin "$@"

echo "== test =="
machin test src/strutil.src src/pathutil.src src/lockfile.src src/argv.src src/executor.src src/mcp.src src/tests.src

echo "built ./sc-machin"
