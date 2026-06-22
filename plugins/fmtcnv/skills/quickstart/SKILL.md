---
name: fmtcnv
description: Use this skill when the user wants to convert data between formats like json, csv, yaml, toml, xml, bson, plist, ron, hjson, hocon, json5, jsonl, or toon.
---

# fmtcnv Plugin

Cross-convert data between bson, csv, hjson, hocon, json, json5, jsonl, plist, ron, toml, toon, xml, and yaml formats. Pipeline-ready: reads from stdin and writes to stdout.

## Commands

### Format conversion
- `fmtcnv format convert --from <FORMAT> --to <FORMAT>` — Convert data between supported formats
- `fmtcnv format convert --from yaml --to toml --compact` — Compact output from YAML to TOML
- `fmtcnv self version` — Print fmtcnv version

### Passthrough
- `fmtcnv _ _` — Passthrough to fmtcnv CLI with full argument access

## Usage Examples
- "cat config.yml | fmtcnv format convert --from yaml --to toml > config.toml"
- "curl https://api.github.com/users/pepa65 | fmtcnv format convert --from json --to json5"
- "fmtcnv format convert --from json --to csv --compact < data.json"
- "fmtcnv _ _ --from yaml --to json --compact < input.yaml"

## Installation

```bash
cargo install fmtcnv
```

## Examples

### Convert YAML to TOML
```bash
cat cfg.yml | fmtcnv format convert --from yaml --to toml > cfg.toml
```

### Pretty-print JSON
```bash
fmtcnv format convert --from json --to json < compact.json > pretty.json
```

## Supported Formats
- bson, csv, hjson, hocon, json, json5, jsonl, plist, ron, toml, toon, xml, yaml

## Key Features
- CLI-only, no auth required
- Reads from stdin and writes to stdout (pipeline-ready)
- Supports 13 different data formats
- Compact output option
- Single Rust binary
