---
name: qo
description: Use this skill when the user wants to query JSON or CSV data with SQL, convert between data formats, or analyze structured data from the command line.
---

# qo Plugin

Interactive minimalist SQL query tool for JSON and CSV files. Supports format conversion, aggregation, joins, and pipe-friendly headless output for CLI pipelines.

## Commands

### Queries
- `qo data query` — Run a SQL query on JSON or CSV data

### Utility
- `qo self version` — Print qo version
- `qo _ _` — Passthrough to qo CLI

## Usage Examples
- "Query all rows from a JSON file where id > 100"
- "Convert a CSV file to JSON"
- "Aggregate sales by region from a CSV"
- "Join two JSON files on a common key"
- "Filter error logs from a JSON stream"

## Installation

```bash
brew install kiki-ki/tap/qo
```

## Examples

```bash
# Query a JSON file
qo data query -q "SELECT id, name FROM data" data.json

# Query from stdin
cat data.json | qo data query -q "SELECT id, name FROM data"

# Join two JSON files
qo data query -q "SELECT * FROM x JOIN y ON x.id = y.x_id" x.json y.json

# Aggregate CSV data
qo data query -i csv sales.csv -o csv -q "SELECT region, SUM(amount) FROM sales GROUP BY region"

# Convert JSON to CSV
qo data query -o csv data.json -q "SELECT id, name FROM data"

# Convert CSV to JSON
qo data query -i csv -o json users.csv -q "SELECT * FROM users"

# Convert JSON to JSON Lines
qo data query -o jsonl data.json -q "SELECT * FROM data"

# Query headerless CSV
qo data query -i csv --no-header raw.csv -q "SELECT col1, col2 FROM raw"

# Filter logs from stdin
cat app.log | qo data query -q "SELECT timestamp, message FROM tmp WHERE level = 'error'"

# Compress filtered output
cat large.json | qo data query -q "SELECT * FROM data WHERE active = true" | gzip > filtered.json.gz
```

## Key Features
- SQL syntax for querying JSON and CSV data
- Supports multiple input and output formats (JSON, CSV, JSON Lines)
- Pipe-friendly: reads from stdin, writes to stdout
- Joins across multiple files
- Aggregation functions (SUM, COUNT, AVG, etc.)
- Headerless CSV support
- Interactive TUI mode (default when no query provided)
- Headless mode with `-q` flag for scripts and pipelines

## Notes
- Use `-q` flag for headless non-interactive queries
- Without `-q`, qo launches an interactive TUI
- Input format is auto-detected; use `-i` to override
- Output defaults to the input format; use `-o` to convert
- Supports standard SQL SELECT, WHERE, GROUP BY, ORDER BY, JOIN
