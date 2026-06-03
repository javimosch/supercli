---
name: convfmt
description: Use this skill when the user wants to convert data between JSON, YAML, TOML, and other structured formats.
---

# convfmt Plugin

CLI tool for converting data files between JSON, YAML, TOML, and other structured data formats.

## Commands

### File Conversion
- `convfmt file convert` — Convert data between formats

## Usage Examples
- "Convert this JSON file to YAML"
- "Turn this TOML config into JSON"
- "Change this YAML to TOML format"

## Installation

```bash
cargo install convfmt
```

## Examples

```bash
convfmt input.json --output output.yaml
convfmt config.toml --format json
convfmt data.yaml --format toml --output data.toml
```

## Key Features
- Multi-format support (JSON, YAML, TOML)
- Auto-detect input format
- Preserve data types during conversion
- Pretty-print output
- Fast Rust implementation
