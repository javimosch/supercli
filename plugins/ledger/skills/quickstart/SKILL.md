---
name: ledger
description: Use this skill when the user wants to manage personal or business finances via plain text accounting — check balances, view transaction history, list accounts, or generate financial reports.
---

# Ledger Plugin

Ledger is a powerful, double-entry accounting system for the command line. All data is stored in plain text files.

## Commands

### Self
- `ledger self version` — Print ledger version

### Reports
- `ledger report balance -f <journal> [query]` — Print account balances
- `ledger report register -f <journal> [query]` — Show transaction register
- `ledger report accounts -f <journal> [query]` — List all account names
- `ledger report payees -f <journal> [query]` — List all payees
- `ledger report commodities -f <journal>` — List all commodities
- `ledger report print -f <journal> [query]` — Print transactions in ledger format
- `ledger report stats -f <journal>` — Show journal statistics
- `ledger report csv -f <journal> [query]` — Output register as CSV
- `ledger report json -f <journal> [query]` — Output register as JSON (machine-readable)

### Passthrough
- `ledger _ _ <args>` — Raw passthrough (xml, equity, prices, tags, etc.)

## Usage Examples

- "show account balances from my ledger file"
- "show transaction register for Expenses"
- "list all accounts"
- "output transactions as JSON"
- "show journal statistics"

## Installation

```bash
brew install ledger
# or
apt install ledger
```

## Key Features
- Double-entry accounting with plain text files
- Multiple report types: balance, register, accounts, payees, commodities, print, stats, csv, json, xml
- Flexible query system for filtering transactions
- Automated account balancing and reconciliation
- Commodity and currency conversion support
- Budget and forecasting reports
- Python scriptable via --python

## Requirements
- Ledger binary installed
- A journal file (plain text, .ledger or .dat extension)
- Set $LEDGER_FILE or pass -f <path> to each command

## Example Journal

```ledger
; ~/finance/main.ledger
2025/01/01 Opening Balance
  Assets:Checking          $1000.00
  Equity:Opening

2025/01/15 Grocery Store
  Expenses:Food             $85.50
  Assets:Checking
```
