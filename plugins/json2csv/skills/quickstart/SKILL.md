---
name: json2csv
description: Use this skill when the user wants to convert JSON to CSV.
---

# JSON2CSV Plugin

JSON to CSV converter CLI.

## Commands

### File Conversion
- `json2csv file convert` — Convert JSON to CSV

## Usage Examples
- "json2csv file convert --input data.json"
- "json2csv file convert --input data.json --output data.csv"

## Installation

```bash
npm install -g @json2csv/cli
```

## Examples

```bash
# Convert JSON to CSV
json2csv input.json -o output.csv

# Convert with custom delimiter
json2csv --delimiter=';' input.json -o output.csv

# Convert specific fields
json2csv --fields=name,age input.json -o output.csv

# Use stdin/stdout
cat input.json | json2csv > output.csv

# No header row
json2csv --no-header input.json -o output.csv

# Pretty print JSON first
json2csv --json-indented input.json -o output.csv
```

## Key Features
- JSON to CSV conversion
- RFC4180 specification compliance
- Custom delimiters
- Field selection
- Stdin/stdout support
- Streaming for large files
- No-header option
