---
name: sqruff
description: Use this skill when the user wants to lint, fix, or format SQL files with sqruff, the fast Rust-based SQLFluff-compatible linter.
---

# sqruff Plugin

sqruff is a fast SQL linter and formatter in Rust, compatible with SQLFluff rules and
`.sqlfluff` config. Supports 20+ dialects (ansi, postgres, mysql, bigquery, snowflake,
duckdb, clickhouse, ...).

## Commands

### Linting
- `sqruff sql lint [path]` — Lint a file or directory
- `sqruff sql fix [path]` — Auto-fix violations
- `sqruff rules list` — List lint rules
- `sqruff dialects list` — List supported dialects
- `sqruff _ _` — Passthrough (`sqruff parse`, `sqruff lsp`)

## Usage Examples

- "Lint all SQL in models/ against the postgres dialect"
- "Auto-fix SQL style issues in this repo"
- "Show me the parse tree of this query"
- "List available lint rules"

## Installation

```bash
cargo install sqruff
# or: brew install sqruff
# or: pipx install sqruff
```

## Examples

```bash
# Lint with dialect
sqruff lint models/ --dialect postgres

# Machine-readable output
sqruff lint models/ --format json

# Fix with safety limits
sqruff fix models/ --dialect snowflake

# Inspect parse tree
sqruff parse query.sql --dialect duckdb
```

## Key Features

- SQLFluff rule compatibility, reads `.sqruff` or `.sqlfluff` config
- `--format human|github-annotation|json` for CI integration
- `sqruff lsp` — built-in language server for editor integration
- Orders of magnitude faster than Python SQLFluff
