# q - Text as Data

## Overview
q is a CLI tool that treats ordinary files as database tables and allows you to run SQL queries directly on delimited files (CSV, TSV, etc.) and multi-file sqlite databases.

## Quick Start

### Run SQL query on a file
```bash
sc q query file "SELECT COUNT(*) FROM ./clicks_file.csv WHERE c3 > 32.3"
```

### Run SQL query on stdin
```bash
ps -ef | sc q query stdin "SELECT UID, COUNT(*) cnt FROM - GROUP BY UID ORDER BY cnt DESC LIMIT 3"
```

### Passthrough to q CLI
```bash
sc q _ <q-args>
```

## Key Features

- **SQL Support**: Full SQL support including WHERE, GROUP BY, JOINs, etc.
- **Automatic Detection**: Automatic column name and type detection
- **Multiple Formats**: Supports CSV, TSV, and other delimited formats
- **SQLite Support**: Query multi-file sqlite databases
- **Pipe Support**: Accept input from stdin for pipeline processing
- **Encoding Support**: Full support for multiple character encodings

## Installation

Visit https://harelba.github.io/q/ for installation instructions for your platform.

## Usage Examples

### Filter CSV file
```bash
q "SELECT * FROM data.csv WHERE column > 100"
```

### Aggregate data
```bash
q "SELECT category, COUNT(*) as count FROM sales.csv GROUP BY category"
```

### Join files
```bash
q "SELECT a.*, b.value FROM file1.csv a JOIN file2.csv b ON a.id = b.id"
```

### Process command output
```bash
ps -ef | q -H "SELECT UID, COUNT(*) FROM - GROUP BY UID"
```

## Notes

- Use `-H` flag to treat first row as headers
- Supports complex SQL queries with subqueries
- Can join multiple files and sqlite databases
- Output can be piped to other tools for further processing
