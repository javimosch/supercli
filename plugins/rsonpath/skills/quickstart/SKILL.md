---
name: rsonpath
description: Use this skill when the user wants to query JSON files using JSONPath expressions, extract data from JSON, or search nested JSON structures.
---

# rsonpath Plugin

SIMD-powered JSONPath query engine written in Rust.

## Commands

### Query
- `rsonpath query run` — Run a JSONPath query on a JSON file or stdin
- `rsonpath json inline` — Run JSONPath query on inline JSON

## Usage Examples
- "Extract all names from a JSON file"
- "Query nested JSON data"
- "Find values matching a JSONPath pattern"

## Installation

```bash
cargo install rsonpath
```

## Examples

```bash
# Query a JSON file
rq '$..name' data.json

# Query inline JSON
rq '$..a.b' --json '{"c":{"a":{"b":42}}}'

# Pipe JSON to query
cat data.json | rq '$..items'
```

## Key Features
- SIMD-accelerated JSONPath queries
- Reads from file or stdin
- Inline JSON support
- Fast and memory efficient
