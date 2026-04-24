---
name: octosql
description: Use this skill when the user wants to query data with SQL, join data from multiple sources, or analyze CSV/JSON files using SQL.
---

# octosql Plugin

Query tool that allows you to join, analyse and transform data from multiple databases and file formats using SQL. Query CSV, JSON, databases, and more with SQL.

## Commands

### Data Query
- `octosql data query` — Query data with SQL

### Utility
- `octosql _ _` — Passthrough to octosql CLI

## Usage Examples
- "Query CSV file with SQL"
- "Join data from multiple sources"
- "Query JSON with SQL"
- "Analyze database data"

## Installation

```bash
brew install octosql
```

Or via Go:
```bash
go install github.com/cube2222/octosql/cmd/octosql@latest
```

## Examples

```bash
# Query CSV file
octosql data query "SELECT * FROM csv://data.csv"

# Query JSON file
octosql data query "SELECT * FROM json://data.json"

# Join CSV and JSON
octosql data query "SELECT * FROM csv://a.csv JOIN json://b.json"

# Set output format
octosql data query "SELECT * FROM csv://data.csv" --output json

# Interactive mode
octosql data query --interactive

# Read query from file
octosql data query --file query.sql

# Any octosql command with passthrough
octosql _ _ "SELECT * FROM csv://data.csv"
octosql _ _ --interactive
```

## Key Features
- **SQL queries** - Standard SQL syntax
- **Multiple sources** - CSV, JSON, databases
- **Joins** - Join data from different sources
- **Multiple formats** - JSON, CSV, table output
- **Databases** - PostgreSQL, MySQL, Redis, etc.
- **Interactive** - Interactive SQL mode
- **Cross-platform** - Linux, macOS, Windows
- **Type system** - Strong type system
- **Plugins** - Extensible with plugins
- **Fast** - Efficient query execution

## Notes
- Supports many data sources out of the box
- Can query files directly with URLs
- Standard SQL syntax
- Perfect for data analysis
- Can join different data formats
