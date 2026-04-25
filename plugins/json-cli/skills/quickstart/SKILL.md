---
name: json-cli
description: Use this skill when the user wants to parse, filter, or manipulate JSON data.
---

# JSON CLI Plugin

A json command for massaging JSON on the Unix command line.

## Commands

### JSON Manipulation
- `json-cli json parse` — Parse and manipulate JSON

## Usage Examples
- "json-cli json parse --input '{\"key\": \"value\"}'"
- "json-cli json parse --path key"

## Installation

```bash
npm install -g json
```

## Examples

```bash
# Parse JSON string
echo '{"name": "John"}' | json

# Extract keys
echo '{"name": "John", "age": 30}' | json keys

# Extract values
echo '{"name": "John", "age": 30}' | json values

# Extract specific path
echo '{"user": {"name": "John"}}' | json user.name

# Filter array
echo '[{"id": 1}, {"id": 2}]' | json -a 'this.id === 1'

# Pretty print JSON
echo '{"name":"John"}' | json

# Read from file
json < file.json

# Sort by key
echo '{"b": 2, "a": 1}' | json --sort-keys
```

## Key Features
- Parse JSON from stdin or file
- Extract keys and values
- Path-based filtering
- Array filtering
- Sorting
- Pretty printing
- Unix pipeline support
