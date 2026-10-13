---
name: dblab
description: Use this skill when the user wants to browse or query PostgreSQL, MySQL, SQLite3, or Oracle databases in an interactive terminal UI with dblab.
---

# dblab Plugin

dblab is an interactive TUI database client (Go) supporting PostgreSQL, MySQL, SQLite3, and Oracle. It presents schemas, tables, and rows in a navigable terminal interface with vim-like keybindings — a lightweight alternative to pgcli/mycli for visual browsing.

## Commands

- `dblab self version` — Print version
- `dblab tui open --url <dsn>` — Open the interactive TUI
- `dblab _ _` — Passthrough to dblab CLI

## Usage Examples

- "Open a terminal UI for this Postgres database"
- "Browse the tables in this MySQL database"
- "Explore this SQLite file interactively"

## Installation

```bash
go install github.com/danvergara/dblab@latest
# or: brew install danvergara/tools/dblab
# or: binary from GitHub releases
```

## Examples

```bash
# Postgres via connection URL
dblab --url "postgres://user:pass@localhost:5432/mydb?sslmode=disable"

# MySQL via flags
dblab --driver mysql --host localhost --user root --db mydb --port 3306

# SQLite file
dblab --driver sqlite3 --db ./app.db
```

## Key Features

- One binary for PostgreSQL, MySQL, SQLite3, and Oracle
- Vim-like navigation over schemas, tables, constraints, and rows
- Inline SQL editor for ad-hoc queries
- Zero runtime dependencies — single static Go binary

## Note

The TUI is interactive; run it in a real terminal (TTY). For non-interactive SQL, prefer the psql/mysql/sqlite3 plugins or qsv/datafusion-cli.
