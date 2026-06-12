---
name: sql-pipe
description: Use this skill when the user wants to query CSV data with SQL using an in-memory SQLite database.
---
# sql-pipe Plugin
Pipe CSV into SQLite for instant SQL queries.
## Commands
- `sql-pipe _ _` — Passthrough to sql-pipe CLI
## Installation
```bash
cargo install sql-pipe
```
## Examples
```bash
cat data.csv | sql-pipe "SELECT * FROM stdin WHERE age > 18"
```
## Key Features
- **SQL on CSV** — Query CSV data with full SQL
- **In-memory SQLite** — No database setup needed
- **Pipeline-ready** — stdin/stdout support
- **Fast** — Written in Rust
