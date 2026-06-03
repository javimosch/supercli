---
name: toon
description: Use this skill when the user wants to serialize data in Token-Oriented Object Notation
---

# Toon Plugin

serialize data in Token-Oriented Object Notation

## Commands
- `toon self version` — Print toon version
- `toon _ _` — Passthrough to toon CLI

## Usage Examples
- "Convert JSON to TOON format"
- "Parse TOON data"
- "Compare TOON files"

## Installation

```bash
npm install -g toon
```

## Examples
```bash
toon encode data.json > data.toon
toon decode data.toon > data.json
toon validate schema.toon data.toon
```

## Key Features
- Compact token-oriented format
- Faster parsing than JSON
- Schema validation
- Bidirectional conversion
