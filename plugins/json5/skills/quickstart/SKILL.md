---
name: json5
description: Use this skill when the user wants to convert JSON5 files to standard JSON format.
---

# json5 Plugin

Convert JSON5 to standard JSON with comments and trailing comma support.

## Commands

### Convert
- `json5 convert to-json` — Convert JSON5 to JSON (stdout output)
- `json5 convert to-file` — Convert JSON5 to JSON (file output)

## Usage Examples
- "Convert a JSON5 file to JSON"
- "Parse JSON5 with comments"
- "Convert JSON5 config to standard JSON"

## Installation

```bash
brew tap yosuke-furukawa/json5
brew install json5
```

## Examples

```bash
# Convert to stdout
json5 -c config.json5

# Convert to file
json5 -c config.json5 -o config.json

# Pipe to jq
json5 -c data.json5 | jq '.items[]'

# Use in scripts
json5 -c package.json5 > package.json
```

## Key Features
- JSON5 to JSON conversion
- Supports JSON5 features:
  - Single and multi-line comments
  - Trailing commas
  - Unquoted object keys
  - Single-quoted strings
  - Multi-line strings
  - Hexadecimal numbers
  - Leading decimal points
- Simple CLI with minimal flags
- Stdin/stdout compatible
