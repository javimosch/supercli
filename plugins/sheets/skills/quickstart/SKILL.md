---
name: sheets
description: Use this skill when the user wants to view and edit spreadsheets in the terminal
---

# Sheets Plugin

view and edit spreadsheets in the terminal

## Commands
- `sheets self version` — Print sheets version
- `sheets _ _` — Passthrough to sheets CLI

## Usage Examples
- "Open this CSV in the terminal"
- "View the spreadsheet data"
- "Edit spreadsheet cells"

## Installation

```bash
go install github.com/nicholasgasior/sheets@latest
```

## Examples
```bash
sheets data.csv
sheets edit report.tsv
sheets view --format csv data.xlsx
```

## Key Features
- Terminal-based spreadsheet UI
- CSV and TSV support
- Cell editing
- Formula support
