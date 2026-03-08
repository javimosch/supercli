#!/usr/bin/env bash
set -euo pipefail

dcli docker container ls --all --format "{{.ID}}\t{{.Image}}\t{{.Status}}" --json
