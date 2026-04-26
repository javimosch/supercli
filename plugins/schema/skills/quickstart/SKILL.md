---
name: schema
description: Use this skill when the user wants to all-in-one cli tool for database migrations, studio and lsp.
---

# Schema Plugin

All-in-one CLI tool for database migrations, studio and LSP.

## Commands

### Operations
- `schema migration create` — create migration via schema
- `schema migration up` — up migration via schema
- `schema migration down` — down migration via schema
- `schema migration status` — status migration via schema
- `schema studio start` — start studio via schema
- `schema lsp start` — start lsp via schema

## Usage Examples
- "schema --help"
- "schema <args>"

## Installation

```bash
go install github.com/gigagrug/schema@latest
```

## Examples

```bash
schema --version
schema --help
```

## Key Features
- database\n- migration\n- sql
