#!/usr/bin/env bash
# Stop scrumboy
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^scrumboy$"; then
  docker stop scrumboy && docker rm scrumboy
  echo "scrumboy stopped"
else
  echo "scrumboy is not running"
fi
