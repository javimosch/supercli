---
name: harmony
description: Use this skill when the user wants to render and format CLI response output
---

# Harmony Plugin

render and format CLI response output

## Commands
- `harmony self version` — Print harmony version
- `harmony _ _` — Passthrough to harmony CLI

## Usage Examples
- "Format this JSON response"
- "Render structured output"
- "Pretty-print API response"

## Installation

```bash
cargo install harmony
```

## Examples
```bash
harmony render --format json data.json
cat response.json | harmony format
```

## Key Features
- Multiple output format support
- Pretty-print and compact modes
- Colorized terminal output
- Pipeline-friendly formatting
