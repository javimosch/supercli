---
name: jsonlint
description: Use this skill when the user wants to validate JSON files, check JSON syntax, format JSON, or sort JSON keys.
---

# jsonlint Plugin

A JSON parser and validator with a CLI. Validate JSON files, sort keys, and format JSON.

## Commands

### JSON Validation
- `jsonlint validate file` — Validate JSON file

### Utility
- `jsonlint _ _` — Passthrough to jsonlint CLI

## Usage Examples
- "Validate this JSON file"
- "Check JSON syntax"
- "Format this JSON"
- "Sort JSON object keys"

## Installation

```bash
npm install -g jsonlint
```

## Examples

```bash
# Validate file
jsonlint validate file data.json

# Validate from stdin
echo '{"name": "test"}' | jsonlint

# Sort object keys
jsonlint validate file data.json -s

# Format in place
jsonlint validate file data.json -i

# Sort and format in place
jsonlint validate file data.json -s -i

# Validate from pipe
cat data.json | jsonlint

# Any jsonlint command with passthrough
jsonlint _ _ data.json
jsonlint _ _ -s -i data.json
```

## Key Features
- **Validation** - Check JSON syntax
- **Error reporting** - Clear error messages
- **Sort keys** - Alphabetically sort object keys
- **In-place editing** - Modify files directly
- **Stdin support** - Process from pipe
- **Pure JavaScript** - No native dependencies
- **Cross-platform** - Works everywhere
- **Fast** - Efficient parsing

## Notes
- Reports line and column of errors
- Use -s to sort object keys
- Use -i to edit files in place
- Can be used in CI/CD pipelines
- Great for pre-commit hooks
- Validates JSON RFC 8259 compliance
