#!/usr/bin/env bash
# List todos for a scrumboy project
PORT="${SCRUMBOY_PORT:-8080}"
HOST="${SCRUMBOY_HOST:-http://localhost}"
SLUG="${1:-}"

if [ -z "$SLUG" ]; then
  echo '{"ok":false,"error":"Usage: scrumboy todo list <project-slug>"}'
  exit 0
fi

response=$(curl -sf "$HOST:$PORT/mcp" \
  -H "Content-Type: application/json" \
  -d "{\"tool\":\"todos.list\",\"input\":{\"projectSlug\":\"$SLUG\"}}" 2>/dev/null)

if [ -z "$response" ]; then
  echo '{"ok":false,"error":"Cannot connect to scrumboy. Is it running?"}'
  exit 0
fi

echo "$response"
