---
name: cbindgen
description: Use this skill when the user wants to generate C/C++ headers from Rust code, create FFI bindings, or expose Rust APIs to C/C++.
---

# cbindgen Plugin

Generate C/C++ headers from Rust libraries with public C API.

## Commands

### Generate
- `cbindgen generate run` — Generate C/C++ header from Rust crate
- `cbindgen generate config` — Generate template cbindgen.toml config

## Usage Examples
- "Generate C headers from my Rust crate"
- "Create FFI bindings for my Rust library"
- "Output a C header file"

## Installation

```bash
cargo install cbindgen
```

## Examples

```bash
# Generate C++ header
cbindgen --crate my_rust_library --output my_header.h

# Generate C header
cbindgen --crate my_rust_library --lang c --output my_header.h

# With config
cbindgen --config cbindgen.toml --crate my_rust_library --output my_header.h
```
