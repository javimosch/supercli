---
name: stencil
description: Use this skill when the user wants to schema registry for schema management and validation.
---

# Stencil Plugin

Schema registry for schema management and validation.

## Commands

### Operations
- `stencil schema upload` — upload schema via stencil
- `stencil schema download` — download schema via stencil
- `stencil schema list` — list schema via stencil
- `stencil schema info` — info schema via stencil
- `stencil compatibility check` — check compatibility via stencil
- `stencil namespace create` — create namespace via stencil
- `stencil namespace list` — list namespace via stencil
- `stencil graph generate` — generate graph via stencil
- `stencil snapshot list` — list snapshot via stencil
- `stencil snapshot download` — download snapshot via stencil
- `stencil search run` — run search via stencil

## Usage Examples
- "stencil --help"
- "stencil <args>"

## Installation

```bash
go install github.com/raystack/stencil@latest
```

## Examples

```bash
stencil --version
stencil --help
```

## Key Features
- schema-registry\n- protobuf\n- avro
