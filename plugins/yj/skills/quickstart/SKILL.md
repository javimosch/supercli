---
name: yj
description: Use this skill when the user wants to convert between YAML, TOML, JSON, and HCL formats, or validate/config format conversion in pipelines.
---

# yj Plugin

Convert between YAML, TOML, JSON, and HCL formats. Preserves map order.

## Commands

### YAML Conversions
- `yj yaml to-json` — YAML to JSON
- `yj yaml to-toml` — YAML to TOML
- `yj yaml to-hcl` — YAML to HCL

### TOML Conversions
- `yj toml to-json` — TOML to JSON
- `yj toml to-yaml` — TOML to YAML

### JSON Conversions
- `yj json to-yaml` — JSON to YAML
- `yj json to-toml` — JSON to TOML

### HCL Conversions
- `yj hcl to-json` — HCL to JSON
- `yj hcl to-yaml` — HCL to YAML

## Usage Examples
- "Convert YAML to JSON"
- "Convert JSON to TOML"
- "Convert TOML to YAML"
- "Convert HCL to JSON"

## Installation

```bash
brew install yj
```

## Common Options
- `-i` — Indent output (JSON or TOML out)
- `-e` — Escape HTML (JSON out only)
- `-n` — Keep inf/-inf/NaN as strings
- `-k` — Parse keys as objects/numbers (YAML out)

## Supported Formats
- YAML v1.2
- TOML v1.0.0
- JSON (RFC 7159)
- HCL (v1)