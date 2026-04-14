# SQLite3 Plugin Quickstart

## Overview

SQLite3 plugin provides semantic commands for SQLite database operations. All commands return JSON by default for easy parsing.

## Core Commands

### Query Execution
- `sqlite3 query execute` — Execute SQL and get JSON results
- `sqlite3 query batch` — Execute SQL in batch mode (script-friendly)

### Database Introspection
- `sqlite3 database tables` — List all tables
- `sqlite3 database schema` — Show full database schema
- `sqlite3 table info` — Show column info for a table

### Pragmas
- `sqlite3 pragma get` — Get pragma value
- `sqlite3 pragma set` — Set pragma value

### Transactions
- `sqlite3 transaction begin` — Begin transaction (optional: DEFERRED/IMMEDIATE/EXCLUSIVE)
- `sqlite3 transaction commit` — Commit transaction
- `sqlite3 transaction rollback` — Rollback transaction

### Multi-Database
- `sqlite3 database attach` — Attach another database file
- `sqlite3 database detach` — Detach a database alias

### Import/Export
- `sqlite3 export csv` — Export query results to CSV
- `sqlite3 export dump` — Full database SQL dump
- `sqlite3 import csv` — Import CSV into table

### Raw Passthrough
- `sqlite3 _ _` — Run any sqlite3 command directly

## Usage Examples

```bash
# Execute a query (JSON output)
supercli sqlite3 query execute --database my.db --sql "SELECT * FROM users LIMIT 10;"

# List all tables
supercli sqlite3 database tables --database my.db

# Get table schema
supercli sqlite3 table info --database my.db --table users

# Export to CSV
supercli sqlite3 export csv --database my.db --sql "SELECT * FROM users;" --output users.csv

# Full database dump
supercli sqlite3 export dump --database my.db > dump.sql

# Import CSV
supercli sqlite3 import csv --database my.db --table users --file users.csv

# Enable foreign keys
supercli sqlite3 pragma set --database my.db --pragma foreign_keys --value ON

# Get current foreign_keys setting
supercli sqlite3 pragma get --database my.db --pragma foreign_keys

# Begin a transaction
supercli sqlite3 transaction begin --database my.db --type DEFERRED

# Attach another database
supercli sqlite3 database attach --database main.db --alias archive --filename archive.db

# Raw passthrough
supercli sqlite3 _ _ -- -csv my.db "SELECT * FROM users;"
```

## Common Pragmas

| Pragma | Description | Values |
|--------|-------------|--------|
| foreign_keys | Enforce foreign key constraints | ON, OFF |
| journal_mode | Control logging mode | DELETE, TRUNCATE, PERSIST, MEMORY, WAL |
| synchronous | Sync behavior | OFF, NORMAL, FULL |
| cache_size | Page cache size | number of pages |
| busy_timeout | Wait timeout for locks | milliseconds |
| case_sensitive_like | Like case sensitivity | ON, OFF |

## Transaction Types

- **DEFERRED** (default) — Lock acquired when first accessed
- **IMMEDIATE** — Lock acquired immediately on BEGIN
- **EXCLUSIVE** — Exclusive lock, no other connections allowed

## Notes

- All queries return JSON by default (`-json` flag)
- Batch mode uses `-batch` for script-safe execution
- Use `-bail` on schema/pragma changes to fail fast
- Import uses `.mode csv` + `.import` internally
- Attach/detach work across multiple database files in a single session