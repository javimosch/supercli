---
name: khi
description: Use this skill when the user wants to view and filter Kubernetes logs
---

# Khi Plugin

view and filter Kubernetes logs

## Commands
- `khi self version` — Print khi version
- `khi _ _` — Passthrough to khi CLI

## Usage Examples
- "View logs for this pod"
- "Filter Kubernetes logs by keyword"
- "Stream logs from all pods"

## Installation

```bash
go install github.com/nicholasgasior/khi@latest
```

## Examples
```bash
khi logs my-pod
khi logs --namespace production --filter "error"
khi stream --selector app=web
```

## Key Features
- Fast log streaming
- Multi-pod log aggregation
- Regex filtering
- Colorized output
