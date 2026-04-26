---
name: schema-registry
description: Use this skill when the user wants to command line tool for managing kafka schema registries.
---

# Schema-registry Plugin

Command line tool for managing Kafka schema registries.

## Commands

### Operations
- `schema-registry schema register` — register schema via schema-registry
- `schema-registry schema list` — list schema via schema-registry
- `schema-registry schema delete` — delete schema via schema-registry
- `schema-registry compatibility check` — check compatibility via schema-registry

## Usage Examples
- "schema-registry --help"
- "schema-registry <args>"

## Installation

```bash
brew install lensesio/tap/schema-registry
```

## Examples

```bash
schema-registry --version
schema-registry --help
```

## Key Features
- kafka\n- schema-registry\n- messaging
