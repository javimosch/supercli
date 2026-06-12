---
name: databow
description: Use this skill when the user wants to Query CLI.
---

# databow Plugin

A command-line tool for querying databases. Export results to JSON, CSV, or Arrow IPC. Cargo install, DuckDB native.

## Commands
- `databow self version` — Print version
- `databow _ _ <args>` — Passthrough to databow

## Usage Examples
- "Query CLI"

## Installation
```bash
cargo install databow
```

## Key Features
- CLI-only, no interactive prompts
- No API keys or authentication required
- Pipeline-ready output format
```
