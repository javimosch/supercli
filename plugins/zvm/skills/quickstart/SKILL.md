---
name: zvm
description: Use this skill when the user wants to manage multiple Zig compiler versions.
---
# zvm Plugin
A fast, dependency-free version manager for Zig written in Zig.
## Commands
- `zvm self version` — Print zvm version
- `zvm _ _` — Passthrough to zvm CLI
## Installation
```bash
cargo install zvm
```
## Examples
```bash
zvm install 0.13.0
zvm use 0.13.0
zvm list
```
## Key Features
- **Multi-version** — Install and switch between Zig versions
- **Fast** — Written in Zig, dependency-free
- **Simple** — Easy install and use
