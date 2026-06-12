---
name: coingecko-cli
description: Use this skill for crypto market data, prices, and trends from CoinGecko.
---
# coingecko-cli Plugin
Fast Go CLI for CoinGecko crypto market data.
## Commands
- `coingecko-cli self version` — Print version
- `coingecko-cli _ _` — Passthrough to CLI
## Installation
```bash
go install github.com/coingecko/coingecko-cli@latest
```
## Examples
```bash
coingecko-cli price bitcoin
coingecko-cli --format json price ethereum
```
## Key Features
- **Crypto prices** — Real-time market data
- **CSV/JSON** — Multiple output formats
- **WebSocket** — Live streaming support
- **Pipeline-ready** — Automation-friendly flags
