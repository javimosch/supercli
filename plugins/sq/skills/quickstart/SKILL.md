---
name: sq
description: Use this skill when the user wants to query structured data with SQL — inspect CSV/JSON/Excel/Parquet files, run ad-hoc queries against databases, or pipe jq-style transformations on tabular data.
---

# sq Plugin

SQL + jq for structured data. Query CSV, JSON, Excel, Parquet, Postgres, MySQL, SQLite, and more using familiar SQL syntax or jq-style expressions.

## Installation

```bash
go install github.com/neilotoole/sq@latest
# or
brew install sq
```

## Basic Usage

```bash
# List available data sources
sq ls

# Query a CSV file
sq '@file.csv' 'SELECT * FROM @file.csv LIMIT 10'

# Query a JSON file
sq '@data.json' 'SELECT name, age FROM @data.json WHERE age > 30'

# Inspect a source's schema
sq inspect @file.csv
```

## Common Patterns

```bash
# Add a database connection
sq add postgres pg://user:pass@localhost/mydb

# Query a connected database
sq '@mydb' 'SELECT count(*) FROM users'

# Export query results to CSV
sq '@file.csv' 'SELECT * FROM @file.csv' --format csv > output.csv

# Join two sources
sq '@a.csv' 'SELECT a.id, b.name FROM @a.csv a JOIN @b.csv b ON a.id = b.id'
```

## Usage Examples

- "Query this CSV file with SQL"
- "Show me the schema of this JSON dataset"
- "Count rows where status is active in this Excel file"

## SuperCLI

```bash
sc sq _ _ ls
sc sq _ _ '@data.csv' 'SELECT * FROM @data.csv LIMIT 5'
sc plugins learn sq
```
