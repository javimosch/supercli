---
name: tomlyre
description: Use this skill when the user wants to query, edit, or manipulate TOML configuration files.
---

# tomlyre Plugin

TOML manipulation tool for querying, editing, and transforming TOML configuration files.

## Commands

### File Editing
- `tomlyre file edit` — Query and edit TOML files with dot-path notation

## Usage Examples
- "Read a value from this TOML config"
- "Edit a TOML file's database section"
- "Query nested TOML values"

## Installation

```bash
cargo install tomlyre
```

## Examples

```bash
tomlyre get config.toml database.host
tomlyre set config.toml database.port 5432
tomlyre list config.toml
tomlyre query config.toml "server.*"
```

## Key Features
- Dot-path notation for nested access
- Read, write, and delete TOML values
- Query with glob patterns
- Preserve TOML formatting
- Fast Rust implementation
