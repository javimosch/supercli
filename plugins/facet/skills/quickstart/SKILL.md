---
name: facet
description: Use this skill when the user wants to use Rust reflection and runtime serialization
---

# Facet Plugin

use Rust reflection and runtime serialization

## Commands
- `facet self version` — Print facet version
- `facet _ _` — Passthrough to facet CLI

## Usage Examples
- "Serialize this struct at runtime"
- "Use reflection on this type"
- "Generate JSON from Rust types"

## Installation

```bash
cargo install facet
```

## Examples
```bash
facet serialize data.json
facet reflect --type MyStruct
```

## Key Features
- Runtime reflection for Rust
- Derive-based serialization
- Type introspection
- Zero-cost abstractions
