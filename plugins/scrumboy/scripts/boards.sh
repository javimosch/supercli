#!/usr/bin/env bash
# List scrumboy boards/projects
PORT="${SCRUMBOY_PORT:-8080}"
HOST="${SCRUMBOY_HOST:-http://localhost}"

response=$(curl -sf "$HOST:$PORT/mcp" \
  -H "Content-Type: application/json" \
  -d '{"tool":"projects.list","input":{}}' 2>/dev/null)

if [ -z "$response" ]; then
  echo '{"ok":false,"error":"Cannot connect to scrumboy at '"$HOST:$PORT"'. Is it running?"}'
  exit 0
fi

echo "$response"
