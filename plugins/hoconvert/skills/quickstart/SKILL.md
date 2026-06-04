---
name: hoconvert
description: Use this skill when the user wants to convert HOCON configuration files to JSON, YAML, or TOML.
---

# hoconvert Plugin

Converts HOCON (Human-Optimized Config Object Notation) configuration files to JSON, YAML, or TOML formats.

## Commands

### File Conversion
- `hoconvert file convert` — Convert HOCON files to other formats

## Usage Examples
- "Convert this HOCON config to JSON"
- "Turn this application.conf into YAML"
- "Parse HOCON and output as TOML"

## Installation

```bash
cargo install hoconvert
```

## Examples

```bash
hoconvert application.conf --format json
hoconvert config.conf --format yaml --output config.yaml
hoconvert reference.conf --format toml
```

## Key Features
- HOCON to JSON conversion
- HOCON to YAML conversion
- HOCON to TOML conversion
- Preserves data types and structure
- Fast Rust implementation
