---
name: csview
description: Use this skill when the user wants to pretty-print CSV files, view tabular data in the terminal, or format CSV output with proper alignment.
---

# csview Plugin

Pretty and fast CSV viewer for CLI with CJK and emoji support.

## Commands

### CSV
- `csview csv view` — Pretty-print a CSV file

## Usage Examples
- "View a CSV file in a nice table format"
- "Pretty-print CSV data from stdin"
- "View a TSV file"

## Installation

```bash
cargo install csview
```

## Examples

```bash
# View a CSV file
csview data.csv

# Pipe from another command
cat data.csv | csview

# Custom delimiter (TSV)
csview -d '\t' data.tsv

# No headers
csview -H data.csv

# Markdown table output
csview --style markdown data.csv
```

## Key Features
- Small and fast
- Memory efficient
- CJK and emoji character alignment
- TSV and custom delimiter support
- Multiple output styles (ASCII, Markdown, etc.)
- Reads from file or stdin
