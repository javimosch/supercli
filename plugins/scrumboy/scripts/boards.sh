#!/usr/bin/env bash
# List scrumboy boards/projects
PORT="${SCRUMBOY_PORT:-8081}"
HOST="${SCRUMBOY_HOST:-http://localhost}"
COOKIE_FILE="${SCRUMBOY_COOKIE_FILE:-$HOME/.scrumboy/cookies.txt}"

if [ -f "$COOKIE_FILE" ]; then
  response=$(curl -sf "$HOST:$PORT/mcp" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d '{"tool":"projects.list","input":{}}' 2>/dev/null)
else
  response='{"ok":false,"error":"No session cookie found. Run sc scrumboy self login first."}'
fi

if [ -z "$response" ]; then
  echo '{"ok":false,"error":"Cannot connect to scrumboy at '"$HOST:$PORT"'. Is it running?"}'
  exit 0
fi

echo "$response" | python3 -c "
import sys,json
d=json.load(sys.stdin)
if not d.get('ok'):
  print(json.dumps(d))
  sys.exit(0)
items=d['data'].get('items',[])
print(f'Projects ({len(items)}):')
for p in items:
  name=p.get('name','?')
  slug=p.get('projectSlug','?')
  role=p.get('role','?')
  print(f'  {slug:20s} {name:30s} role={role}')
"
