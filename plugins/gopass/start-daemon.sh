#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Find the daemon script
DAEMON_PATH=$(find "$SCRIPT_DIR" -name 'daemon.js' -maxdepth 1 2>/dev/null)

if [ -z "$DAEMON_PATH" ]; then
    echo "❌ daemon.js not found in $SCRIPT_DIR"
    exit 1
fi

# Start the daemon in background immediately (no wait for supercli compatibility)
nohup node "$DAEMON_PATH" start > /dev/null 2>&1 &
echo "✅ gopass daemon started in background"
