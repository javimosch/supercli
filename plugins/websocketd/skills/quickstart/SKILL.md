---
name: websocketd
description: Use this skill when the user wants to expose a script or program over WebSocket, prototype a realtime socket backend, or test WebSocket clients without writing server code.
---

# websocketd Plugin

websocketd turns any program into a WebSocket server. Each incoming connection spawns the given command; socket messages become stdin lines and stdout lines are sent back as messages.

## Commands

- `websocketd self version` — Print websocketd version
- `websocketd server run` — Start a WebSocket server bridging each connection to a command/script (websocketd --port=8080 ./handler.sh). Long-running
- `websocketd server devconsole` — Serve the built-in developer console for browser testing (websocketd --devconsole --port=8080 ./handler)
- `websocketd _ _` — Passthrough to websocketd CLI

## Usage Examples

- "Expose a bash script as a WebSocket service on port 8080"
- "Open the dev console to test my socket handler in a browser"
- "Serve every script in ./handlers as a websocket endpoint"

## Installation

```bash
brew install websocketd
# or: go install github.com/joewalnes/websocketd@latest
# or: download from https://github.com/joewalnes/websocketd/releases
```

## Examples

```bash
websocketd --port=8080 ./handler.sh          # bridge sockets to a script
websocketd --devconsole --port=8080 ./handler  # built-in test page
websocketd --port=8080 --dir ./handlers        # serve all scripts in a dir
websocketd --staticdir=./public --port=8080 ./app  # static files + socket
```

## Key Features

- Language-agnostic: the handler can be bash, Python, a binary — anything that reads stdin
- --devconsole gives an instant in-browser test client
- Supports --dir, --staticdir, --ssl/--sslkey, --binary mode, and CGI-style env vars per connection
