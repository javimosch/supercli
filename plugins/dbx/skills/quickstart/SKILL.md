---
name: dbx
description: Use this skill when the user wants to query databases including MySQL, PostgreSQL, and SQLite
---

# Dbx Plugin

query databases including MySQL, PostgreSQL, and SQLite

## Commands
- `dbx self version` — Print dbx version
- `dbx _ _` — Passthrough to dbx CLI

## Usage Examples
- "Connect to this PostgreSQL database"
- "Query the SQLite database"
- "List all tables in MySQL"

## Installation

```bash
cargo install dbx
```

## Examples
```bash
dbx connect postgres://localhost/mydb
dbx query "SELECT * FROM users"
dbx tables
```

## Key Features
- Multi-database support (MySQL, PostgreSQL, SQLite)
- Fast query execution
- Interactive terminal mode
- Connection string support
