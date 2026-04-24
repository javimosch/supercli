---
name: jsongrep
description: Use this skill when the user wants to query JSON, YAML, TOML, or other structured data files using a JSONPath-inspired query language. Alternative to jq with multi-format support.
---

# jsongrep Plugin

Path query language for JSON, YAML, TOML, JSONL, CBOR, and MessagePack documents. JSONPath-inspired syntax with multi-format support.

## Commands

### Data Querying
- `jsongrep data query` — Query structured data with path expressions

### Documentation
- `jsongrep doc generate` — Generate additional documentation and/or completions

### Utility
- `jsongrep self version` — Print jsongrep version
- `jsongrep _ _` — Passthrough to jg CLI

## Usage Examples
- "Extract all email addresses from this JSON file"
- "Query all names from the YAML config"
- "Get the count of matching entries"
- "Search for a field name at any depth"
- "Query a TOML file for all dependencies"

## Installation

```bash
cargo install jsongrep
```

## Examples

```bash
# Extract all first names from a JSON API response
curl -s https://api.nobelprize.org/v1/prize.json | jsongrep data query 'prizes[0].laureates[*].firstname'

# Query inline JSON
echo '{"users": [{"name": "Alice"}, {"name": "Bob"}]}' | jsongrep data query 'users.[*].name'

# Query a specific file
jsongrep data query '**.name' data.json

# Case insensitive search
jsongrep data query -i 'NAME' data.json

# Count matches only
jsongrep data query --count '**.email' users.json

# Machine-readable output for piping
jsongrep data query --porcelain 'users.[*].name' data.json

# Query YAML file
jsongrep data query -f yaml 'services.web.image' docker-compose.yml

# Query TOML file
jsongrep data query -f toml 'dependencies.*' Cargo.toml

# Fixed string search at any depth
jsongrep data query -F 'port' config.json

# Compact output (no pretty-print)
jsongrep data query --compact 'users.[*]' data.json

# Query without path headers
jsongrep data query --no-path 'users.[*].name' data.json

# Generate shell completions
jsongrep doc generate
```

## Key Features
- **Multi-format support**: JSON, YAML, TOML, JSONL, CBOR, MessagePack
- **JSONPath-inspired syntax**: Familiar path expressions
- **Auto-detection**: Input format detected from file extension
- **Case-insensitive search**: `-i` flag
- **Count mode**: `--count` for match counts
- **Machine-readable**: `--porcelain` for scripting
- **Fixed-string search**: `-F` for literal field name search
- **Path control**: `--with-path` and `--no-path` for output formatting
- **Compact output**: `--compact` for minified JSON
- **Depth display**: `--depth` shows document depth
- **Shell completions**: Generated via `jg generate`
- **Man pages**: Generated via `jg generate`

## Query Syntax
- `.` — dot notation for field access
- `[]` — bracket notation for array indices
- `[*]` — wildcard for all array elements
- `**` — recursive descent (search at any depth)
- Supports nested paths like `users.[0].name` or `**.email`

## Notes
- Reads from STDIN if no file is provided
- Output is pretty-printed JSON by default; use `--compact` for minified output
- `--porcelain` strips labels and colors, ideal for piping to other tools
- Auto-detects format from file extension; use `-f` to override
- Works great in pipelines: `curl ... | jg 'query' | jq ...`
