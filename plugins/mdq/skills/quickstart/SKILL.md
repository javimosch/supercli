---
name: mdq
description: Use this skill to query and extract data from markdown files.
---
# mdq Plugin
Query and extract data from markdown files.
## Commands
- `mdq _ _` — Passthrough to mdq CLI
## Installation
```bash
cargo install mdq
```
## Examples
```bash
mdq --json "h1" README.md
```
## Key Features
- **Markdown query** — Extract structured data
- **JSON output** — Pipeline-friendly
- **Fast** — Written in Rust
