#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:-alpine:latest}"
NAME="${2:-demo-alpine}"

dcli docker image pull --image "$IMAGE" --json
dcli docker container run --image "$IMAGE" --detach --name "$NAME" --json
dcli docker container logs --container "$NAME" --tail 20 --json
dcli docker container rm --container "$NAME" --force --json
