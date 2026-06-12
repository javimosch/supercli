---
name: jte
description: Use this skill when the user wants to generate text output from JSON templates.
---
# jte Plugin
A JSON template engine for the CLI.
## Commands
- `jte self version` — Print jte version
- `jte _ _` — Passthrough to jte CLI
## Installation
```bash
cargo install jte
```
## Examples
```bash
cat data.json | jte template.tmpl
```
## Key Features
- **JSON templates** — Generate text from JSON data
- **Pipeline-ready** — stdin/stdout support
- **Fast** — Written in Rust
