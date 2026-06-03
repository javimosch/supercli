---
name: snitch
description: Use this skill when the user wants to inspect network connections and processes
---

# Snitch Plugin

inspect network connections and processes

## Commands
- `snitch self version` — Print snitch version
- `snitch _ _` — Passthrough to snitch CLI

## Usage Examples
- "Show all active network connections"
- "Which process is using port 8080?"
- "Monitor network traffic"

## Installation

```bash
go install github.com/nicholasgasior/snitch@latest
```

## Examples
```bash
snitch list
snitch port 8080
snitch watch
```

## Key Features
- Real-time connection monitoring
- Process-to-port mapping
- Connection statistics
- Filterable output
