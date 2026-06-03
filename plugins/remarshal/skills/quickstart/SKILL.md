---
name: remarshal
description: Use this skill when the user wants to convert between data formats like TOML, YAML, JSON, CBOR, and MessagePack
---

# Remarshal Plugin

convert between data formats like TOML, YAML, JSON, CBOR, and MessagePack

## Commands
- `remarshal self version` — Print remarshal version
- `remarshal _ _` — Passthrough to remarshal CLI

## Usage Examples
- "Convert this TOML to YAML"
- "Transform JSON to TOML"
- "Convert between any supported formats"

## Installation

```bash
pip install remarshal
```

## Examples
```bash
remarshal --from toml --to yaml config.toml > config.yaml
remarshal --from json --to toml data.json > data.toml
cat data.yaml | remarshal --from yaml --to json
```

## Key Features
- Multi-format support
- Lossless conversion
- Pretty-print options
- Stdin/stdout piping
