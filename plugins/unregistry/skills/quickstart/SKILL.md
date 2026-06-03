---
name: unregistry
description: Use this skill when the user wants to push Docker images to remote hosts via SSH
---

# Unregistry Plugin

push Docker images to remote hosts via SSH

## Commands
- `unregistry self version` — Print unregistry version
- `unregistry _ _` — Passthrough to unregistry CLI

## Usage Examples
- "Push this Docker image to the server"
- "Deploy container without a registry"
- "Transfer image over SSH"

## Installation

```bash
go install github.com/psviderski/unregistry@latest
```

## Examples
```bash
unregistry push myimage:latest user@server:/path
unregistry deploy nginx:alpine --host prod-server
```

## Key Features
- No Docker registry needed
- Direct SSH image transfer
- Compressed transfer
- Atomic deployment
