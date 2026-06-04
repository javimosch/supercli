---
name: nestedtextto
description: Use this skill when the user wants to convert NestedText data files to JSON, YAML, TOML, or other formats.
---

# nestedtextto Plugin

Converter from NestedText format to JSON, YAML, TOML, and other data formats.

## Commands

### File Conversion
- `nestedtextto file convert` — Convert NestedText to other formats

## Usage Examples
- "Convert this NestedText file to JSON"
- "Turn NestedText into YAML"
- "Change NestedText to TOML"

## Installation

```bash
pip install nestedtextto
```

## Examples

```bash
nestedtextto input.nt --to json
nestedtextto data.nt --to yaml --output data.yaml
nestedtextto config.nt --to toml
```

## Key Features
- NestedText to JSON conversion
- NestedText to YAML conversion
- NestedText to TOML conversion
- Preserves data structure
- Simple Python implementation
