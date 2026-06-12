---
name: qsv
description: Use this skill when the user wants to process, analyze, filter, join, or transform CSV data from the command line with high performance.
---

# qsv Plugin

A fast CSV command line toolkit for slicing, dicing, analyzing, splitting, joining, indexing, and enriching CSV data. Supports JSON output and pipeline operations.

## Commands
- `qsv self version` — Print qsv version
- `qsv _ _` — Passthrough to qsv CLI

## Usage Examples
- "Analyze this CSV file"
- "Filter CSV rows by condition"
- "Join two CSV files on a column"
- "Convert CSV to JSON output"

## Installation

```bash
cargo install qsv
```

Or via Homebrew:
```bash
brew install qsv
```

## Examples

```bash
# Analyze CSV structure
qsv stats data.csv

# Filter rows
qsv search -s name "John" data.csv

# Select columns
qsv select name,age,email data.csv

# Output as JSON
qsv json data.csv

# Join two CSV files
qsv join id left.csv id right.csv

# Sort and deduplicate
qsv sort -s name data.csv | qsv dedup
```

## Key Features
- **Fast CSV processing** — Written in Rust for maximum performance
- **JSON output** — Convert CSV to JSON for pipeline integration
- **Rich command set** — 40+ subcommands for data manipulation
- **Pipeline-ready** — Works with standard Unix pipes
- **Data validation** — Schema validation and quality checks
- **Index creation** — Create indexes for faster queries
- **Excel support** — Read/write XLSX files
