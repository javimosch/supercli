---
name: toml2json
description: Use this skill when the user wants to convert TOML files to JSON format, or pipe TOML data through stdin to get JSON output.
---

# toml2json Plugin

Very small CLI for converting TOML to JSON.

## Commands

### Convert
- `toml2json convert file` — Convert a TOML file to JSON
- `toml2json convert pretty` — Convert TOML to pretty-printed JSON

## Usage Examples
- "Convert a TOML file to JSON"
- "Pretty-print a TOML configuration as JSON"
- "Pipe TOML data and convert it"

## Installation

```bash
cargo install toml2json
```

## Examples

```bash
# Convert a file
toml2json config.toml

# Pretty-print
toml2json --pretty config.toml

# Pipe from stdin
cat config.toml | toml2json

# Use with jq
toml2json config.toml | jq '.key'
```

## Key Features
- Convert TOML to JSON
- Read from files or stdin
- Pretty-print output option
- Pipe-friendly for shell workflows
