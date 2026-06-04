---
name: anubis
description: Use this skill when the user wants to filter HTTP requests to block AI crawlers
---

# Anubis Plugin

filter HTTP requests to block AI crawlers

## Commands
- `anubis self version` — Print anubis version
- `anubis _ _` — Passthrough to anubis CLI

## Usage Examples
- "Block AI crawlers from my site"
- "Set up anti-scraping proxy"
- "Configure crawler filtering"

## Installation

```bash
go install github.com/jechol/anubis@latest
```

## Examples
```bash
anubis --listen :8080 --upstream http://localhost:3000
anubis config --block-ai-crawlers
```

## Key Features
- Reverse proxy for AI crawler blocking
- Challenge-based bot detection
- Configurable rules
- Low latency overhead
