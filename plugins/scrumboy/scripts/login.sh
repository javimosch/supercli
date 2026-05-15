#!/usr/bin/env bash
# Login to scrumboy and save session cookie
set -e
DATA_DIR="${SCRUMBOY_DATA_DIR:-$HOME/.scrumboy}"
COOKIE_FILE="$DATA_DIR/cookies.txt"
mkdir -p "$DATA_DIR"

EMAIL="${SCRUMBOY_EMAIL:-}"
PASSWORD="${SCRUMBOY_PASSWORD:-}"

if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  echo "Set SCRUMBOY_EMAIL and SCRUMBOY_PASSWORD env vars, or edit this script."
  exit 1
fi

PORT="${SCRUMBOY_PORT:-8081}"
HOST="${SCRUMBOY_HOST:-http://localhost}"

curl -s "$HOST:$PORT/api/auth/login" -X POST \
  -H "Content-Type: application/json" \
  -H "X-Scrumboy: 1" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -c "$COOKIE_FILE" > /dev/null

echo "Logged in as $EMAIL — cookie saved to $COOKIE_FILE"
