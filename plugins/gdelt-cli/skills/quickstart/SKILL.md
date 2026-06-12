---
name: gdelt-cli
description: Use this skill when the user wants to analyze global news data from the GDELT dataset.
---
# gdelt-cli Plugin
CLI for the GDELT Global Knowledge Graph news dataset.
## Commands
- `gdelt-cli self version` — Print gdelt-cli version
- `gdelt-cli _ _` — Passthrough to gdelt-cli CLI
## Installation
```bash
cargo install gdelt-cli
```
## Examples
```bash
gdelt-cli --help-json
gdelt-cli query --format json
```
## Key Features
- **GDELT access** — Global news dataset
- **Multiple formats** — JSON, JSONL, CSV output
- **Sentiment analysis** — Geographic and trend analysis
- **MCP support** — AI agent interoperability
- **Pipeline-ready** — Structured output for automation
