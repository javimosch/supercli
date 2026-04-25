---
name: yaml-convert
description: Use this skill when the user wants to convert between YAML and JSON.
---

# YAML-Convert Plugin

Command-line utility for converting between YAML and JSON.

## Commands

### File Conversion
- `yaml-convert file convert` — Convert between YAML and JSON

## Usage Examples
- "yaml-convert file convert --input config.yaml --output config.json --json"
- "yaml-convert file convert --input config.json --output config.yaml --yaml"

## Installation

```bash
npm install -g yaml-convert
```

## Examples

```bash
# Convert YAML to JSON
yaml-convert --input file.yaml --output file.json

# Convert JSON to YAML
yaml-convert --input file.json --output file.yaml --yaml

# Pretty print output
yaml-convert --input file.yaml --pretty

# Use stdin/stdout
cat file.yaml | yaml-convert > file.json

# Wrap as ES6 module
yaml-convert --input file.yaml --es6

# Wrap as Node.js module
yaml-convert --input file.yaml --node

# Keep original YAML styling
yaml-convert --input file.yaml --output output.yaml --keep
```

## Key Features
- YAML to JSON conversion
- JSON to YAML conversion
- Pretty printing
- ES6 module output
- Node.js module output
- Stdin/stdout support
- Preserve YAML styling
