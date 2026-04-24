---
name: trdsql
description: Use this skill when the user wants to query CSV, JSON, or other text files with SQL, analyze data files without importing into a database.
---

# trdsql Plugin

Execute SQL queries on CSV, JSON, LTSV, TBLN, and other text files. Query structured data files with standard SQL without importing into a database.

## Commands

### Data Querying
- `trdsql data query` — Query data files with SQL

### Utility
- `trdsql _ _` — Passthrough to trdsql CLI

## Usage Examples
- "Query CSV with SQL"
- "Analyze JSON data with SQL"
- "SQL on text files"
- "Query data without database"

## Installation

```bash
brew install trdsql
```

Or via Go:
```bash
go install github.com/noborus/trdsql@latest
```

## Examples

```bash
# Query CSV file
trdsql data query "SELECT * FROM data.csv" data.csv

# Query with header
trdsql data query "SELECT name, age FROM users.csv WHERE age > 18" users.csv --header

# Output as JSON
trdsql data query "SELECT * FROM data.csv" data.csv --output JSON

# Join files
trdsql data query "SELECT * FROM a.csv JOIN b.csv ON a.id = b.id" a.csv b.csv

# Any trdsql command with passthrough
trdsql _ _ "SELECT * FROM data.csv"
```

## Key Features
- **SQL** - Standard SQL queries
- **CSV** - CSV file support
- **JSON** - JSON file support
- **LTSV** - LTSV support
- **TBLN** - TBLN support
- **JOIN** - File JOINs
- **Aggregate** - Aggregations
- **No DB** - No database needed
- **Output** - Multiple formats
- **Fast** - In-memory processing

## Notes
- Supports multiple file formats
- No database installation needed
- Great for quick data analysis
- Supports complex queries
