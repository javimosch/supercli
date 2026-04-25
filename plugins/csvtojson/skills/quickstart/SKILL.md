---
name: csvtojson
description: Use this skill when the user wants to convert CSV files to JSON.
---

# CSVtoJSON Plugin

CSV to JSON converter with custom parser support.

## Commands

### File Conversion
- `csvtojson file convert` — Convert CSV to JSON

## Usage Examples
- "csvtojson file convert --input data.csv"
- "csvtojson file convert --input data.csv --output data.json"

## Installation

```bash
npm install -g csvtojson
```

## Examples

```bash
# Convert CSV file and save to JSON
csvtojson source.csv > converted.json

# Pipe CSV data from stdin
cat source.csv | csvtojson > converted.json

# Convert with custom delimiter
csvtojson --delimiter=; source.csv > converted.json

# Convert CSV without header row
csvtojson --noheader source.csv > converted.json

# Specify output file directly
csvtojson source.csv -o output.json
```

## Key Features
- CSV to JSON conversion
- Custom delimiters
- Header configuration
- Stdin/stdout support
- Pipeline operations
- Multiple CSV format support
