#!/usr/bin/env bash
# Check scrumboy container status
OUT=$(docker ps --filter name=scrumboy --format '{{.Names}} {{.Status}}' 2>/dev/null)
PORT="${SCRUMBOY_PORT:-8081}"
if [ -z "$OUT" ]; then
  echo '{"ok":false,"error":"scrumboy container is not running"}'
else
  echo "{\"ok\":true,\"data\":\"$OUT\",\"port\":$PORT}"
fi
