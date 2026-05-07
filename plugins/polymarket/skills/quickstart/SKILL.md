---
name: polymarket
description: Use this skill when the user wants to browse Polymarket prediction markets, check market prices, view order books, search markets, or interact with Polymarket from the terminal.
---

# polymarket Plugin

CLI for Polymarket prediction markets. Browse markets, view prices, place orders, manage positions.

## Commands

### General
- `polymarket self version` — Print version
- `polymarket self status` — Check API health status

### Markets
- `polymarket markets list` — List prediction markets
- `polymarket markets search` — Search prediction markets
- `polymarket markets get` — Get a single market by ID or slug

### Events
- `polymarket events list` — List events

### Order Book (CLOB)
- `polymarket clob book` — View order book for a token
- `polymarket clob price` — Get price for a token
- `polymarket clob midpoint` — Get midpoint price
- `polymarket clob history` — Get price history

### Data
- `polymarket data positions` — Get positions for a wallet
- `polymarket data leaderboard` — View leaderboard

### Wallet
- `polymarket wallet show` — Show wallet info

### Tags
- `polymarket tags list` — List all tags

## Usage Examples
- "List active prediction markets"
- "Search for markets about bitcoin"
- "Show order book for a token"
- "Get price history for a market"
- "Check Polymarket API status"

## Installation

```bash
brew tap Polymarket/polymarket-cli https://github.com/Polymarket/polymarket-cli
brew install polymarket
```

## Examples

```bash
# Browse markets
polymarket markets list --limit 10
polymarket markets search "election" --limit 5
polymarket markets get will-trump-win

# Order book
polymarket clob book TOKEN_ID
polymarket clob price TOKEN_ID --side buy
polymarket clob midpoint TOKEN_ID

# Price history
polymarket clob price-history TOKEN_ID --interval 1d

# JSON output for scripting
polymarket -o json markets list --limit 5

# Portfolio data
polymarket data positions 0xWALLET_ADDRESS
polymarket data leaderboard --period month --limit 10
```

## Notes
- Read-only commands work without wallet setup
- For trading: run `polymarket setup` or set `POLYMARKET_PRIVATE_KEY`
- Output formats: `-o json` or `-o table` (default)
