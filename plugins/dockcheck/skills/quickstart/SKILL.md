---
name: dockcheck
description: Use this skill when the user wants to automatically update Docker container images
---

# Dockcheck Plugin

automatically update Docker container images

## Commands
- `dockcheck self version` — Print dockcheck version
- `dockcheck _ _` — Passthrough to dockcheck CLI

## Usage Examples
- "Check for container updates"
- "Update all containers"
- "Auto-update Docker images"

## Installation

```bash
curl -sSL https://raw.githubusercontent.com/nicholasgasior/dockcheck/main/install.sh | bash
```

## Examples
```bash
dockcheck check
dockcheck update --all
dockcheck update container_name
```

## Key Features
- Automatic update detection
- Selective container updates
- Rollback support
- Cron-friendly
