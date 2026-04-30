---
name: rsql
description: Use this skill when the user wants to query databases or data files using SQL from the command line.
---

# rsql Plugin

Command line SQL interface supporting 30+ databases and data files.

## Commands

### Query
- `rsql query run` — Execute a SQL query against a database
- `rsql file query` — Query a data file (CSV, JSON, Parquet, etc.)

## Usage Examples
- "Query a PostgreSQL database"
- "Run SQL on a CSV file"
- "Query JSON data with SQL"
- "Execute SQL against SQLite"

## Installation

```bash
cargo install rsql_cli
```

## Examples

```bash
# Query PostgreSQL
rsql postgresql://user:pass@localhost/db -e "SELECT * FROM users"

# Query a CSV file
rsql data.csv -e "SELECT name, COUNT(*) FROM data GROUP BY name"

# Query JSON file
rsql data.json -e "SELECT * FROM json_data WHERE value > 100"

# Query SQLite
rsql sqlite:./mydb.sqlite "SELECT * FROM table"

# Interactive mode
rsql postgresql://localhost/mydb
```

## Key Features
- 30+ database drivers (PostgreSQL, MySQL, SQLite, etc.)
- Query data files (CSV, JSON, Parquet, Arrow, etc.)
- Interactive and batch modes
- Output formats: table, CSV, JSON, markdown
- SQL dialects and extensions
