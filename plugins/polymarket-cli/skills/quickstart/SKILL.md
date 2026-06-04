---
name: polymarket-cli
description: Use this skill when the user wants to interact with Polymarket prediction markets
---

# Polymarket-cli Plugin

interact with Polymarket prediction markets

## Commands
- `polymarket-cli self version` — Print polymarket-cli version
- `polymarket-cli _ _` — Passthrough to polymarket-cli CLI

## Usage Examples
- "View Polymarket markets"
- "Check market prices"
- "Place a prediction bet"

## Installation

```bash
cargo install polymarket-cli
```

## Examples
```bash
polymarket-cli markets --category politics
polymarket-cli price --market "election-2024"
polymarket-cli positions
```

## Key Features
- Polymarket API integration
- Market browsing
- Price monitoring
- Position management
