---
name: jql
description: Use this skill when the user wants to query, filter, or transform JSON data using a simple query language, or extract specific values from JSON files.
---

# jql Plugin

JSON Query Language CLI — query and transform JSON with a simple query syntax.

## Commands

### Query
- `jql query run` — Query JSON with a jql query

### Validate
- `jql validate run` — Validate JSON data

## Usage Examples
- "Extract a key from JSON"
- "Get nested values from JSON"
- "Query an array index"
- "Validate JSON file"

## Installation

```bash
cargo install jql
# or
brew install jql
```

## Examples

```bash
# Query a key
echo '{"a":1}' | jql '"a"'

# Nested key
echo '{"a":{"b":2}}' | jql '"a""b"'

# Array index
echo '[1,2,3]' | jql '[0]'

# Array range
echo '[1,2,3]' | jql '[1:2]'

# Multiple keys
echo '{"a":1,"b":2}' | jql '"a","b"'
```

## Query Syntax

### Selectors
- `"key"` — Key selector
- `{"key1","key2"}` — Multi key selector
- `[0]` — Array index
- `[0:2]` — Array range
- `{0}` — Object index

### Operators
- `..` — Flatten operator
- `@` — Keys operator
- `|>` — Pipe in (parallel)
- `<|` — Pipe out
- `!` — Truncate operator