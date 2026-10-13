---
name: sqldef
description: Use this skill when the user wants to apply a desired schema.sql to MySQL/PostgreSQL/SQLite/SQL Server idempotently, or export a live schema, with sqldef.
---

# sqldef Plugin

sqldef is a family of four single-purpose binaries — `mysqldef`, `psqldef`, `sqlite3def`, `mssqldef` — that apply a desired `schema.sql` to a database idempotently. They compute the minimal DDL diff themselves: safe to re-run, no migration files to maintain.

## Commands

### PostgreSQL (psqldef)
- `sqldef postgres apply <db> --file schema.sql` — Apply desired schema
- `sqldef postgres export <db>` — Dump live schema to stdout

### MySQL (mysqldef)
- `sqldef mysql apply <db> --file schema.sql` — Apply desired schema
- `sqldef mysql export <db>` — Dump live schema to stdout

### SQLite (sqlite3def)
- `sqldef sqlite apply <file.db> --file schema.sql` — Apply desired schema
- `sqldef sqlite export <file.db>` — Dump live schema to stdout

- `sqldef _ _` — Passthrough to mysqldef CLI

## Usage Examples

- "Apply this schema.sql to the Postgres database"
- "Show me what changes sqldef would make (dry run)"
- "Export the current schema into schema.sql"

## Installation

```bash
brew install sqldef
# or per-binary tarballs: github.com/sqldef/sqldef releases
# e.g. mysqldef_linux_amd64.tar.gz, psqldef_linux_amd64.tar.gz
```

## Examples

```bash
# Dry-run first, then apply (always preview!)
psqldef -U postgres mydb --file schema.sql --dry-run
psqldef -U postgres mydb --file schema.sql

# SQLite: no server needed
sqlite3def app.db --file schema.sql
sqlite3def app.db --export

# Capture existing schema
mysqldef -u root mydb --export > schema.sql
```

## Key Features

- Idempotent: run it N times, same result — diff computed from live DB
- `--dry-run` prints planned DDL without executing
- `--export` snapshots the live schema into schema.sql
- Single static binaries; sqlite3def needs no server at all
- Per-binary connection flags: `-u/-h/-p` (mysqldef), `-U/-h/-p` (psqldef)
