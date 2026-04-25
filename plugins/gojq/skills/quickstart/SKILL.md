---
name: gojq
description: Use this skill when the user wants to query JSON data, filter JSON, transform JSON with jq syntax, or process JSON files.
---

# gojq Plugin

Pure Go implementation of jq. Process and query JSON data with jq-compatible syntax.

## Commands

### JSON Querying
- `gojq query json` — Query JSON with jq syntax

### Utility
- `gojq _ _` — Passthrough to gojq CLI

## Usage Examples
- "Query this JSON"
- "Filter JSON data"
- "Extract field from JSON"
- "Transform JSON structure"

## Installation

```bash
brew install gojq
```

Or via Go:
```bash
go install github.com/itchyny/gojq/cmd/gojq@latest
```

## Examples

```bash
# Extract field
echo '{"foo": 128}' | gojq query json '.foo'

# Nested field
echo '{"a": {"b": 42}}' | gojq query json '.a.b'

# Array elements
echo '[{"id":1},{"id":2},{"id":3}]' | gojq query json '.[] | .id'

# Object construction
echo '{"id": "sample", "10": {"b": 42}}' | gojq query json '{(.id): .["10"].b}'

# Math operations
echo '{"a":1,"b":2}' | gojq query json '.a += 1 | .b *= 2'

# Large number precision
echo '{"foo": 4722366482869645213696}' | gojq query json '.foo'

# Filter array
echo '[1,2,3,4,5]' | gojq query json '.[] | select(. > 3)'

# Map over array
echo '[1,2,3]' | gojq query json 'map(. * 2)'

# Sort array
echo '[3,1,2]' | gojq query json 'sort'

# Any gojq command with passthrough
gojq _ _ '.foo' < data.json
gojq _ _ -r '.name' < data.json
```

## Key Features
- **jq compatible** - Same query syntax as jq
- **Pure Go** - No C dependencies
- **Large numbers** - Arbitrary precision integers
- **Error messages** - Clear and helpful errors
- **JSON validation** - Validates JSON input
- **Streaming** - Process large JSON files
- **Cross-platform** - Works everywhere
- **Fast** - Efficient Go implementation

## Notes
- Query syntax is jq-compatible
- Use -r for raw output (no quotes)
- Supports all jq filters and functions
- Great for API response processing
- Can be used in shell scripts
