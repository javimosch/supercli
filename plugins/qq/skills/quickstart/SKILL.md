---
name: qq
description: Use this skill when the user wants to convert between data formats (JSON/CSV/YAML/HCL/TOML/XML) or query structured data from the command line.
---
# qq Plugin
A jq-inspired interoperable format transcoder.
## Commands
- `qq self version` — Print qq version
- `qq _ _` — Passthrough to qq CLI
## Installation
```bash
brew install qq
```
## Examples
```bash
cat data.json | qq -i json -o yaml
cat config.yaml | qq -i yaml -o json
```
## Key Features
- **Multi-format** — JSON, CSV, YAML, HCL, TOML, XML
- **Pipeline-ready** — Unix pipe support
- **jq-inspired** — Familiar query syntax
- **Fast** — Written in Go
