#!/usr/bin/env bash
set -euo pipefail

CONTEXT_DIR="${1:-.}"
TAG="${2:-local/demo:latest}"

dcli docker image build --context "$CONTEXT_DIR" --tag "$TAG" --json
