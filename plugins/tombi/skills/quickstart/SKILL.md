---
name: tombi
description: Use this skill when the user wants to format TOML files, lint TOML configurations, or work with TOML language server.
---

# tombi Plugin

TOML Toolkit - TOML Formatter / Linter / Language Server. Format and lint TOML configuration files with ease.

## Commands

### TOML Formatting
- `tombi toml format` — Format TOML file

### Utility
- `tombi _ _` — Passthrough to tombi CLI

## Usage Examples
- "Format TOML file"
- "Lint TOML configuration"
- "Fix TOML syntax"
- "Validate TOML"

## Installation

```bash
brew install tombi
```

Or via Cargo:
```bash
cargo install tombi
```

## Examples

```bash
# Format TOML file
tombi toml format config.toml

# Check without modifying
tombi toml format config.toml --check

# Write changes
tombi toml format config.toml --write

# Read from stdin
echo "[section]" | tombi toml format --stdin

# Any tombi command with passthrough
tombi _ _ fmt config.toml
tombi _ _ fmt config.toml --check
```

## Key Features
- **Format** - TOML formatting
- **Lint** - TOML linting
- **LSP** - Language server support
- **Validate** - Syntax validation
- **Check** - Check without changes
- **Easy** - Simple interface
- **Config** - Configuration files
- **Editor** - Editor integration
- **Fast** - Quick processing
- **Standard** - TOML standard compliant

## Notes
- Great for TOML configuration files
- Includes language server
- Validates TOML syntax
- Perfect for config management
