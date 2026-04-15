---
name: qsv
description: Use this skill when the user wants to process, analyze, filter, join, or transform CSV data files.
---

# qsv Plugin

Blazing-fast CSV data wrangling toolkit with 70+ commands for querying, sorting, analyzing, filtering, joining, and transforming tabular data.

## Commands

### Basic Operations
- `qsv count <file>` — Count rows in CSV
- `qsv stats <file>` — Compute column statistics
- `qsv table <file>` — Format as aligned table

### Data Manipulation
- `qsv select <columns> <file>` — Select/reorder columns
- `qsv sort <column> <file>` — Sort data
- `qsv search <pattern> <file>` — Search with regex
- `qsv sample <n> <file>` — Random sample

### Advanced
- `qsv join <key> <file1> <file2>` — Join two CSVs
- `qsv frequency <file>` — Frequency distribution
- `qsv luau <script> <file>` — Lua scripting

## Usage Examples

```bash
# Count rows
qsv count data.csv

# Get statistics
qsv stats data.csv --everything | qsv table

# Select columns
qsv select name,email,age users.csv

# Search
qsv search "gmail.com" emails.csv

# Join
qsv join user_id users.csv orders.csv

# Sample
qsv sample 100 data.csv
```

## Installation

```bash
# Download binary
curl -sSfL https://github.com/dathere/qsv/releases/latest/download/qsv-x86_64-unknown-linux-musl.tar.gz | tar -xzf - -C /usr/local/bin/

# Or via cargo
cargo install qsv
```

## Key Features
- 70+ commands for data wrangling
- 10-100x faster than Python tools
- Streaming support for large files
- SQL queries via `qsv sqlp`
- Lua scripting via `qsv luau`
- JSON, JSONL, Parquet support
