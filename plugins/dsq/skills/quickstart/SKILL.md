---
name: dsq
description: Use this skill when the user wants to query data files with SQL, analyze JSON/CSV/Parquet files, or run SQL without a database.
---

# dsq Plugin

Run SQL queries on data files (JSON, CSV, Parquet, etc.). Query data files directly with SQL without loading into a database.

## Commands

### Data Querying
- `dsq data query` — Query data files with SQL

### Utility
- `dsq _ _` — Passthrough to dsq CLI

## Usage Examples
- "Query JSON with SQL"
- "Analyze CSV data"
- "SQL on data files"
- "Query Parquet file"

## Installation

```bash
brew install dsq
```

Or via Go:
```bash
go install github.com/multiprocessio/dsq@latest
```

## Examples

```bash
# Query JSON file
dsq data query data.json "SELECT * FROM {} WHERE age > 25"

# Query CSV
dsq data query data.csv "SELECT * FROM {}"

# Multiple files with JOIN
dsq data query users.json orders.json "SELECT * FROM users JOIN orders ON users.id = orders.user_id"

# Any dsq command with passthrough
dsq _ _ data.json "SELECT * FROM {}"
```

## Key Features
- **SQL** - Standard SQL queries
- **JSON** - JSON file support
- **CSV** - CSV file support
- **Parquet** - Parquet support
- **JOIN** - Multiple file JOINs
- **No DB** - No database needed
- **Fast** - In-memory processing
- **Flexible** - Multiple formats
- **Aggregate** - Aggregations
- **Filter** - WHERE clauses

## Notes
- Supports multiple file formats
- No database installation needed
- Great for quick data analysis
- Supports complex queries
