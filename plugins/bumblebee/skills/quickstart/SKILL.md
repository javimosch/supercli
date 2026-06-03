---
name: bumblebee
description: Use this skill when the user wants to discover and scan API endpoints
---

# Bumblebee Plugin

discover and scan API endpoints

## Commands
- `bumblebee self version` — Print bumblebee version
- `bumblebee _ _` — Passthrough to bumblebee CLI

## Usage Examples
- "Scan this API for endpoints"
- "Discover all routes from OpenAPI spec"
- "Test API endpoints"

## Installation

```bash
go install github.com/nicholasgasior/bumblebee@latest
```

## Examples
```bash
bumblebee scan --spec openapi.yaml
bumblebee discover --url http://localhost:3000
bumblebee test --spec api.yaml
```

## Key Features
- OpenAPI spec parsing
- Automatic endpoint discovery
- Security scanning
- Response validation
