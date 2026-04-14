---
name: rustledger
description: Use this skill when the user wants to validate, query, or format ledger files in Beancount format, or generate accounting reports.
---

# Rustledger Plugin

Modern plain text accounting - blazing-fast Beancount-compatible implementation in Rust.

## Commands

### Validation
- `rustledger check validate` — Validate ledger files with detailed error messages

### Query
- `rustledger query execute` — Run BQL queries on ledger files

### Formatting
- `rustledger format auto` — Auto-format beancount files

### Reports
- `rustledger report generate` — Generate balance, account, and statistics reports

### Debugging
- `rustledger doctor debug` — Debugging tools for ledger issues

## Usage Examples

Validate a ledger:
```
rledger check ledger.beancount
rledger check --native-plugin auto_accounts ledger.beancount
```

Run queries:
```
rledger query ledger.beancount
rledger query ledger.beancount "SELECT date, narration WHERE account ~ 'Expenses:Food'"
```

Generate reports:
```
rledger report ledger.beancount balances
rledger report ledger.beancount stats
rledger report ledger.beancount income
```

Format files:
```
rledger format ledger.beancount
rledger format --in-place ledger.beancount
```

Debugging:
```
rledger doctor context ledger.beancount 42
rledger doctor linked ledger.beancount ^trip-2024
rledger doctor stats ledger.beancount
```

## Installation

```bash
cargo install rustledger
```

Or via package manager:
```bash
brew install rustledger        # macOS/Linux
yay -S rustledger-bin          # Arch Linux
scoop install rustledger       # Windows
```

## Key Features
- 10-30x faster than Python beancount
- Beancount-compatible syntax
- 30 built-in plugins
- BQL query language (100% compatible)
- LSP server for editor integration
- WASM support for browser/Node.js
- Python plugin compatibility via WASI sandbox
- Detailed error messages with source locations