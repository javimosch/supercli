#!/usr/bin/env bash
# Start scrumboy via docker-compose
set -e
cd "$(dirname "$0")/.."

DATA_DIR="${SCRUMBOY_DATA_DIR:-$HOME/.scrumboy/data}"
mkdir -p "$DATA_DIR"

if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^scrumboy$"; then
  echo "scrumboy is already running"
  exit 0
fi

docker run -d \
  --name scrumboy \
  --restart unless-stopped \
  -p "${SCRUMBOY_PORT:-8081}:8080" \
  -v "$DATA_DIR:/data" \
  -e DATA_DIR=/data \
  -e SCRUMBOY_MODE="${SCRUMBOY_MODE:-full}" \
  markrai/scrumboy:latest 2>/dev/null || {
    # Build from source if image not found
    echo "Building scrumboy from source..."
    TMPDIR=$(mktemp -d)
    git clone --depth=1 https://github.com/markrai/scrumboy.git "$TMPDIR"
    cd "$TMPDIR"
    docker compose up --build -d
    cd / && rm -rf "$TMPDIR"
  }

echo "scrumboy started on http://localhost:${SCRUMBOY_PORT:-8081}"
