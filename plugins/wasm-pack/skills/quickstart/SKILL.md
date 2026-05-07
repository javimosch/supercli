---
name: wasm-pack
description: Use this skill when the user wants to build Rust to WebAssembly, create npm packages from Rust WASM, or compile Rust for browser/Node.js.
---

# wasm-pack Plugin

Build, test, and publish Rust-generated WebAssembly packages.

## Commands

### Build
- `wasm-pack build run` — Build Rust crate as WebAssembly npm package
- `wasm-pack new run` — Create new Rust WASM project from template

### Test
- `wasm-pack test run` — Run WASM tests in browser/Node.js

### Publish
- `wasm-pack pack run` — Create tarball of Rust WASM package

## Usage Examples
- "Build my Rust project as WebAssembly"
- "Create a new Rust WASM project"
- "Run WASM tests in headless browser"
- "Pack my WASM project for npm publishing"

## Installation

```bash
cargo install wasm-pack
```

## Examples

```bash
# Build for bundler
wasm-pack build

# Build for Node.js
wasm-pack build --target nodejs

# Build for web
wasm-pack build --target web

# Create new project
wasm-pack new my-project

# Run tests in headless Chrome
wasm-pack test --headless

# Run tests in Node.js
wasm-pack test --node
```
