---
name: wildq
description: Use this skill when the user wants to query structured data files with jq-like syntax
---

# Wildq Plugin

query structured data files with jq-like syntax

## Commands
- `wildq self version` — Print wildq version
- `wildq _ _` — Passthrough to wildq CLI

## Usage Examples
- "Query JSON data with jq syntax"
- "Extract fields from TOML"
- "Filter YAML data"

## Installation

```bash
pip install wildq
```

## Examples
```bash
wildq ".users[] | select(.age > 30)" data.json
wildq ".database.host" config.toml
cat data.yaml | wildq ".items[]"
```

## Key Features
- jq-like query syntax
- TOML, JSON, INI, YAML support
- Filter and transform data
- Pipeline-friendly
