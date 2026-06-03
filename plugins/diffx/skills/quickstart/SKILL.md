---
name: diffx
description: Use this skill when the user wants to perform semantic diffs on structured data files like JSON, YAML, or TOML.
---

# diffx Plugin

Semantic diff tool for structured data. Understands the structure of JSON, YAML, and TOML files and produces meaningful diffs instead of line-based diffs.

## Commands

### File Diffing
- `diffx file diff` — Semantic diff between two structured data files

## Usage Examples
- "Diff these two JSON files semantically"
- "Compare two YAML configurations"
- "Show me the structural differences in these TOML files"

## Installation

```bash
cargo install diffx
```

## Examples

```bash
diffx file-a.json file-b.json
diffx config1.yaml config2.yaml
diffx old.toml new.toml
```

## Key Features
- Semantic (structure-aware) diffing
- Supports JSON, YAML, and TOML formats
- Human-readable output
- Fast Rust implementation
