---
name: dasel
description: Use this skill when the user wants to query, update, or convert structured data files like JSON, TOML, YAML, XML, INI, HCL, or CSV.
---

# dasel Plugin

Select, put and delete data from JSON, TOML, YAML, XML, INI, HCL and CSV files with a single tool. A query and update tool for structured data files.

## Commands

### Data Operations
- `dasel data select` — Select data from structured files
- `dasel data put` — Put data into structured files

### Utility
- `dasel _ _` — Passthrough to dasel CLI

## Usage Examples
- "Select value from YAML"
- "Update JSON file"
- "Convert TOML to JSON"
- "Query XML file"

## Installation

```bash
brew install dasel
```

Or via Go:
```bash
go install github.com/TomWright/dasel/cmd/dasel@latest
```

## Examples

```bash
# Select value from JSON
dasel data select '.name' -p json -f data.json

# Select nested value
dasel data select '.user.name' -p json -f data.json

# Select array element
dasel data select '.items[0]' -p json -f data.json

# Put value into file
dasel data put '.name' 'new value' -p json -f data.json

# Put with type
dasel data put '.count' '42' -t int -p json -f data.json

# Convert YAML to JSON
dasel data select '.' -p yaml -f data.yaml -w json

# Convert TOML to YAML
dasel data select '.' -p toml -f data.toml -w yaml

# Any dasel command with passthrough
dasel _ _ '.name' -p json -f data.json
dasel _ put '.version' '1.0.0' -p toml -f data.toml
```

## Key Features
- **Multiple formats** - JSON, TOML, YAML, XML, INI, HCL, CSV
- **Format conversion** - Convert between any supported formats
- **Query** - Select data with simple selectors
- **Update** - Put data into files
- **Delete** - Remove data from files
- **Type support** - String, int, bool types
- **Nested queries** - Access deeply nested data
- **Array access** - Select array elements
- **Cross-platform** - Linux, macOS, Windows
- **Simple syntax** - Easy to learn selector language

## Notes
- Selector syntax uses dot notation
- Can convert between formats
- In-place file editing
- Perfect for config file management
- Works with CI/CD pipelines
