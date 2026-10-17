---
name: port-check
description: Test TCP port connectivity.
---
# port-check Plugin
Check if a remote TCP port is open.

## Commands
- `port-check <resource> <action>` — Execute port-check commands
- `port check tcp` — Check if a TCP port is open

## Usage
- `port check tcp google.com 80` → OPEN
- `port check tcp localhost 8080` → CLOSED
