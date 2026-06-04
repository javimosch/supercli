---
name: perry
description: Use this skill when the user wants to compile and type-check TypeScript code
---

# Perry Plugin

compile and type-check TypeScript code

## Commands
- `perry self version` — Print perry version
- `perry _ _` — Passthrough to perry CLI

## Usage Examples
- "Check TypeScript for type errors"
- "Compile this TypeScript project"
- "Run type checking on src/"

## Installation

```bash
cargo install perry-typescript
```

## Examples
```bash
perry check src/
perry build --outDir dist/
```

## Key Features
- Written in Rust for speed
- Drop-in replacement for tsc
- Fast compilation and type checking
- Compatible with existing TypeScript configs
