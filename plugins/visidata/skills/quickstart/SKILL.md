---
name: visidata
description: Use this skill when the user wants to explore, clean, transform, or convert tabular data — CSV, TSV, JSON, XLSX, SQLite, Parquet, and other formats.
---

# VisiData Plugin

VisiData is a terminal utility for exploring and arranging tabular data. It supports 40+ formats and can work interactively (TUI) or in batch mode.

## Commands

### Self
- `visidata self version` — Print visidata version

### Data Operations
- `visidata data convert -o <output.ext> <input.ext>` — Convert between formats in batch mode
- `visidata data inspect <input>` — Open a data file in interactive TUI mode
- `visidata data replay -p <cmdlog> [-b] [-o <output>]` — Replay a saved cmdlog

### Passthrough
- `visidata _ _ <args>` — Raw passthrough for any vd command

## Usage Examples

- "convert data.csv to data.json"
- "convert data.tsv to data.xlsx"
- "inspect a CSV file"
- "open a JSON file in the terminal spreadsheet"
- "show version of visidata"

## Installation

```bash
pip install visidata
# or
brew install visidata
```

## Key Features
- 40+ supported file formats (CSV, TSV, JSON, XLSX, SQLite, Parquet, HTML, etc.)
- Interactive TUI spreadsheet with keyboard-driven navigation
- Batch mode for format conversion (`-b -o output.ext`)
- Piped input support (stdin)
- Python expression evaluation for column derivation
- Column transformations, regex extraction, and type conversion
- Saved cmdlog for workflow replay
- Undo/redo support
- gnuplot integration for quick charting

## Batch Conversion Examples

```bash
# Pipe through stdin
curl api.example.com/data.json | vd -b -o data.tsv -

# Convert CSV to JSON
vd -b -o output.json input.csv

# Convert Excel to TSV
vd -b -o output.tsv input.xlsx

# Force specific input format
vd -b -o output.csv input.json -f json
```
