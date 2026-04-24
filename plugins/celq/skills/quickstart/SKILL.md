---
name: celq
description: Use this skill when the user wants to evaluate Common Expression Language (CEL) expressions against JSON, JSON5, YAML, TOML, or XML data. Useful for filtering, transforming, and validating structured data.
---

# celq Plugin

Common Expression Language (CEL) CLI tool. Evaluate CEL expressions against JSON, JSON5, YAML, TOML, and XML input. Filter, transform, and validate structured data with a familiar expression syntax.

## Commands

### Data Querying
- `celq data query` — Evaluate CEL expression against structured data

### Utility
- `celq self version` — Print celq version
- `celq _ _` — Passthrough to celq CLI

## Usage Examples
- "Filter JSON array elements that contain the letter 'a'"
- "Evaluate a CEL expression with arguments"
- "Validate JSON data using a CEL condition"
- "Transform YAML data with a CEL expression"

## Installation

```bash
cargo install celq
```

## Examples

```bash
# Filter array elements containing 'a'
echo '["apples", "bananas", "blueberry"]' | celq data query 'this.filter(s, s.contains("a"))'

# Evaluate expression without stdin input
celq data query -n --arg='fruit:string=apple' 'fruit.contains("a")'

# Check if all array elements satisfy a condition
echo '[1, 2, 3]' | celq data query 'this.all(x, x > 0)'

# Map and transform data
echo '[1, 2, 3]' | celq data query 'this.map(x, x * 2)'

# Filter objects in an array
echo '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]' | celq data query 'this.filter(p, p.age >= 28)'

# Evaluate with multiple arguments
celq data query -n --arg='x:int=10' --arg='y:int=20' 'x + y'

# Check string contains substring
echo '{"message": "Hello, world!"}' | celq data query 'this.message.contains("world")'
```

## Supported Input Formats
- **JSON** — Standard JSON
- **JSON5** — JSON with comments and relaxed syntax
- **YAML** — YAML documents
- **TOML** — TOML configuration files
- **XML** — XML documents
- **NDJSON** — Newline-delimited JSON

## Key Features
- **Common Expression Language (CEL)** — Google-developed expression language
- **Multiple input formats** — JSON, JSON5, YAML, TOML, XML, NDJSON
- **No-input mode** — Evaluate expressions with `--arg` flags and `-n`
- **Pipes-friendly** — Reads from STDIN, outputs to STDOUT
- **Type-safe** — CEL is strongly typed with automatic conversions
- **Familiar syntax** — Similar to JavaScript/Python expressions

## Notes
- CEL expressions use `this` to refer to the input data
- The `-n` flag is used when you only want to evaluate an expression with arguments, without reading from STDIN
- Arguments use the format `--arg='name:type=value'` (e.g. `--arg='count:int=5'`)
- celq supports CEL macros like `filter`, `map`, `all`, `exists`, `size`, `has`, etc.
- For detailed CEL syntax and recipes, see the [celq manual](https://docs.rs/celq/latest/celq/)
