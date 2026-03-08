#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:-nginx:latest}"
NAME="${2:-demo-nginx}"

dcli docker container run --image "$IMAGE" --detach --publish 8080:80 --name "$NAME" --rm --json
