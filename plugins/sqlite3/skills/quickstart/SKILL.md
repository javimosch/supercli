---
name: sqlite3
description: Use this skill when the user wants to execute SQL queries on SQLite databases, manage transactions, set pragmas, import/export CSV data, or dump databases to SQL format.
---

# SQLite3 Plugin

Execute SQL queries on SQLite databases with JSON output by default.

## Commands

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
- `sqlite3 transaction begin` — Begin transaction
- `sqlite3 transaction commit` — Commit transaction
- `sqlite3 transaction rollback` — Rollback transaction

### Multi-Database
- `sqlite3 database attach` — Attach another database
- `sqlite3 database detach` — Detach a database alias

### Import/Export
- `sqlite3 export csv` — Export query results to CSV
- `sqlite3 export dump` — Full database SQL dump
- `sqlite3 import csv` — Import CSV into table

## Usage Examples
- "List all tables in my.db"
- "Execute SELECT * FROM users LIMIT 10"
- "Export query results to CSV"
- "Begin a transaction and insert data"
- "Set foreign_keys pragma to ON"

## Common Pragmas
- `foreign_keys` — ON/OFF for constraint enforcement
- `journal_mode` — DELETE, TRUNCATE, PERSIST, MEMORY, WAL
- `synchronous` — OFF, NORMAL, FULL
- `cache_size` — Page cache size
- `busy_timeout` — Lock wait timeout in ms