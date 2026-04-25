---
name: x2j-cli
description: Use this skill when the user wants to convert XML to JSON.
---

# X2J-CLI Plugin

Node.js command line script to convert XML input into JSON output.

## Commands

### File Conversion
- `x2j-cli file convert` — Convert XML to JSON

## Usage Examples
- "x2j-cli file convert --input data.xml"
- "cat data.xml | x2j-cli"

## Installation

```bash
npm install --global x2j-cli
```

## Examples

```bash
# Convert XML from URL
curl -sS http://example.com/data.xml | x2j

# Convert XML file
cat data.xml | x2j

# Using xml2json alias (also installed)
cat data.xml | xml2json

# Pipe to jq for further processing
cat data.xml | x2j | jq '.data'

# Save to file
cat data.xml | x2j > data.json
```

## Key Features
- XML to JSON conversion
- Stdin/stdout support
- Easy pipeline integration
- Alias: xml2json
- Formatted JSON output
