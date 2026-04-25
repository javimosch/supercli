---
name: xleak
description: Use this skill when the user wants to view Excel spreadsheets in non-interactive mode or export them to CSV/JSON format.
---

# xleak Plugin

Fast terminal Excel viewer with non-interactive mode and export capabilities.

## Commands

### Viewing
- `xleak self version` — Print xleak version
- `xleak sheet view <file>` — View spreadsheet in non-interactive mode
- `xleak export csv <file>` — Export spreadsheet to CSV
- `xleak export json <file>` — Export spreadsheet to JSON
- `xleak _ _` — Passthrough to xleak CLI

## Usage Examples

- "View the first 20 rows of report.xlsx"
- "Export Q3 data to CSV format"
- "Convert spreadsheet to JSON for processing"

## Installation

```bash
cargo install xleak
```

## Examples

```bash
# View specific sheet
xleak report.xlsx --sheet "Q3 Results"

# Limit to first 20 rows
xleak large-file.xlsx -n 20

# Export to CSV
xleak data.xlsx --export csv > output.csv

# Export to JSON
xleak data.xlsx --export json > output.json

# Export specific sheet as CSV
xleak workbook.xlsx --sheet "Sales" --export csv > sales.csv
```

## Key Features
- Non-interactive mode for scripting
- Export to CSV, JSON, or text formats
- Lazy loading for large files
- Full-text search
- Formula display
- Excel table extraction
