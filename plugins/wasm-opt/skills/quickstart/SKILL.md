---
name: wasm-opt
description: Use this skill when the user wants to use wasm-opt, compiler and toolchain infrastructure library for WebAssembly.
---

# wasm-opt Plugin

wasm-opt — compiler and toolchain infrastructure library for WebAssembly.

## Commands
- `wasm-opt <resource> <action>` — Execute wasm-opt commands
- `wasm-opt self version` — Print wasm-opt version
- `wasm-opt _ _` — Passthrough to wasm-opt CLI

## Usage Examples
- "wasm-opt --help"
- "wasm-opt self version"

## Installation
```bash
apt-get install binaryen 2>/dev/null || which wasm-opt
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
