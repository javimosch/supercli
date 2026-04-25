---
name: node-file-converter
description: Use this skill when the user wants to convert file formats.
---

# Node File Converter Plugin

CLI tool for converting files to different formats.

## Commands

### File Conversion
- `node-file-converter file convert` — Convert file format

## Usage Examples
- "node-file-converter file convert --source data.csv --destination data.json"

## Installation

```bash
npm install -g node-file-converter
```

## Examples

```bash
# Convert CSV to JSON
nfc source.csv destination.json

# The conversion result is logged to terminal
nfc input.csv output.json
```

## Key Features
- CSV to JSON conversion
- Simple command syntax
- Result logging
- More formats planned (Doc to PDF, JSON to CSV, Text to PDF, Text to JSON, XML to JSON)
