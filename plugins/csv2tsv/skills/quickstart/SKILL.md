---
name: csv2tsv
description: Use this skill when the user wants to convert CSV files to tab-separated format for processing with Unix tools.
---

# csv2tsv Plugin

csv2tsv converts comma-separated to tab-separated data.

## Commands
- `csv2tsv <resource> <action>` — Execute csv2tsv commands
- `csv2tsv self version` — Print csv2tsv version
- `csv2tsv _ _` — Passthrough to csv2tsv CLI

## Usage Examples

- "convert a CSV to TSV for cut/awk processing"
- "handle quoted fields during conversion"
- "batch convert all CSV files in directory"

## Installation

```bash
brew install csv2tsv
```

## Key Features
- CSV to TSV conversion
- Quoted field and escape handling
- Line ending normalization
- Pipe-friendly for Unix toolchains
- Batch file processing
