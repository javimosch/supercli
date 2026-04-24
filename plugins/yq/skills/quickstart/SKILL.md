---
name: yq
description: Use this skill when the user wants to query, transform, or convert YAML, JSON, XML, CSV, TOML, or other structured data formats.
---

# yq Plugin

A portable command-line YAML, JSON, XML, CSV, TOML, HCL and properties processor. Query and transform structured data with a simple syntax.

## Commands

### Data Processing
- `yq data query` — Query and transform data

### Utility
- `yq _ _` — Passthrough to yq CLI

## Usage Examples
- "Extract value from YAML"
- "Convert JSON to YAML"
- "Query nested data"
- "Transform configuration files"

## Installation

```bash
brew install yq
```

Or via Go:
```bash
go install github.com/mikefarah/yq/v4@latest
```

## Examples

```bash
# Read YAML value
yq data query '.key' config.yaml

# Read nested value
yq data query '.parent.child' config.yaml

# Read array element
yq data query '.items[0]' config.yaml

# Convert YAML to JSON
yq data query '.' -y config.yaml > output.json

# Convert JSON to YAML
yq data query '.' -j config.json > output.yaml

# Update value
yq data query '.key = \"new value\"' -i config.yaml

# Add new key
yq data query '.newKey = value' -i config.yaml

# Delete key
yq data query 'del(.key)' -i config.yaml

# Filter array
yq data query '.items[] | select(.status == \"active\")' config.yaml

# Convert to XML
yq data query '.' -x config.yaml > output.xml

# Convert to CSV
yq data query '.' -c config.yaml > output.csv

# Convert to TOML
yq data query '.' -t config.yaml > output.toml

# Any yq command with passthrough
yq _ _ '.key' config.yaml
yq _ query '.' -j config.json
```

## Key Features
- **Multiple formats** — YAML, JSON, XML, CSV, TOML, HCL, properties
- **Format conversion** — Convert between any supported formats
- **jq-like syntax** - Familiar query language
- **In-place editing** — Modify files directly
- **Nested queries** — Access deeply nested data
- **Array operations** — Filter, map, transform arrays
- **Portable** — Single binary, no dependencies
- **Cross-platform** — Linux, macOS, Windows
- **Pipeline support** — Read from stdin, output to stdout
- **Type-aware** — Handles different data types correctly

## Notes
- Uses dot notation for nested keys
- Supports all standard jq operations
- Can merge multiple files
- Default output format matches input
- Use -i flag for in-place editing
- Perfect for CI/CD configuration management
