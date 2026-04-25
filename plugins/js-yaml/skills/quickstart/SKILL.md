---
name: js-yaml
description: Use this skill when the user wants to parse YAML files, convert YAML to JSON, validate YAML, or process configuration files.
---

# js-yaml Plugin

JavaScript YAML parser and dumper. Parse YAML files to JSON and dump JSON to YAML with CLI support.

## Commands

### YAML Parsing
- `js-yaml parse yaml` — Parse YAML file

### Utility
- `js-yaml _ _` — Passthrough to js-yaml CLI

## Usage Examples
- "Parse this YAML file"
- "Convert YAML to JSON"
- "Validate YAML syntax"
- "Read configuration file"

## Installation

```bash
npm install -g js-yaml
```

## Examples

```bash
# Parse YAML file
js-yaml parse yaml config.yaml

# Parse from stdin
cat config.yaml | js-yaml

# Compact error mode
js-yaml parse yaml config.yaml -c

# Show stack trace on error
js-yaml parse yaml config.yaml -t

# Any js-yaml command with passthrough
js-yaml _ _ config.yaml
js-yaml _ _ -c -t config.yaml
```

## Key Features
- **YAML 1.2** - Full specification support
- **Fast** - High performance
- **CLI tool** - Command-line interface
- **Library** - Use in Node.js code
- **Error reporting** - Clear error messages
- **Stack traces** - Debugging support
- **Compact mode** - Concise errors
- **Cross-platform** - Works everywhere

## Supported YAML Features
- Scalars, sequences, mappings
- Tags and types
- Anchors and aliases
- Multi-document files
- Custom schemas
- Binary data
- Timestamps

## Notes
- Use -c for compact error messages
- Use -t for stack traces
- Great for config file parsing
- Can validate YAML syntax
- Used in many Node.js projects
