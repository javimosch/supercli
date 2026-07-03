---
name: coraza
description: Use this skill when the user wants to use coraza — Go WAF CLI — ModSecurity-compatible web application firewall for reverse proxies.
---

# coraza Plugin

Go WAF CLI — ModSecurity-compatible web application firewall for reverse proxies

## Commands
- `coraza self version` — Print coraza version
- `coraza _ _` — Passthrough to coraza CLI

## Usage Examples
- `coraza self version` — Check installed version
- `coraza _ _ --help` — Show coraza help
- `coraza _ _ --json` — JSON output mode

## Installation
```bash
go install github.com/corazawaf/coraza@latest
```

## Key Features
- security, waf, golang, proxy
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
