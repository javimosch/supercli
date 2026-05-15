#!/usr/bin/env bash
# List todos for a scrumboy project (uses board.get since no todos.list tool exists)
PORT="${SCRUMBOY_PORT:-8081}"
HOST="${SCRUMBOY_HOST:-http://localhost}"
COOKIE_FILE="${SCRUMBOY_COOKIE_FILE:-$HOME/.scrumboy/cookies.txt}"
SLUG="$1"

if [ -z "$SLUG" ]; then
  echo 'Usage: sc scrumboy todo list <project-slug>'
  exit 1
fi

if [ ! -f "$COOKIE_FILE" ]; then
  echo 'No session cookie found. Run sc scrumboy self login first.'
  exit 1
fi

response=$(curl -sf "$HOST:$PORT/mcp" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -d "{\"tool\":\"board.get\",\"input\":{\"projectSlug\":\"$SLUG\"}}" 2>/dev/null)

if [ -z "$response" ]; then
  echo "Cannot connect to scrumboy at $HOST:$PORT. Is it running?"
  exit 1
fi

echo "Board: $(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('data',{}).get('projectName','?'))" 2>/dev/null)"
echo "$response" | python3 -c "
import sys,json
d=json.load(sys.stdin)
if not d.get('ok'):
  print(json.dumps(d))
  sys.exit(0)
cols=d['data'].get('columns',[])
total=sum(len(c.get('items',[])) for c in cols)
print(f'  {total} items across {len(cols)} columns')
for c in cols:
  items=c.get('items',[])
  key=c.get('key','?')
  name=c.get('name','?')
  if items:
    print(f'  [{key}] {name}:')
  for t in items:
    lid=t.get('localId','?')
    title=t.get('title','?')
    print(f'        #{lid} {title}')
"
