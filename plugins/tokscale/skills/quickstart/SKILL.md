---
name: tokscale
description: Use this skill when the user wants to track AI token usage and costs across services.
---
# tokscale Plugin
Track AI-agent token usage and costs across 30+ services.
## Commands
- `tokscale self version` — Print tokscale version
- `tokscale _ _` — Passthrough to tokscale CLI
## Installation
```bash
cargo install tokscale
```
## Examples
```bash
tokscale --json
tokscale report --format csv
```
## Key Features
- **Multi-service** — 30+ AI services supported
- **Cost tracking** — Monitor spending
- **JSON export** — Structured data for analysis
- **Pipeline-ready** — CI/CD integration
