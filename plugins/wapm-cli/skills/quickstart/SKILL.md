---
name: wapm-cli
description: Use this skill when the user wants to webassembly package manager cli for managing webassembly packages.
---

# Wapm-cli Plugin

WebAssembly Package Manager CLI for managing WebAssembly packages.

## Commands

### Operations
- `wapm-cli package install` — install package via wapm
- `wapm-cli package uninstall` — uninstall package via wapm
- `wapm-cli package list` — list package via wapm
- `wapm-cli package search` — search package via wapm
- `wapm-cli package publish` — publish package via wapm
- `wapm-cli registry login` — login registry via wapm
- `wapm-cli registry logout` — logout registry via wapm
- `wapm-cli run exec` — exec run via wapm
- `wapm-cli config show` — show config via wapm

## Usage Examples
- "wapm-cli --help"
- "wapm-cli <args>"

## Installation

```bash
cargo install wapm-cli
```

## Examples

```bash
wapm --version
wapm --help
```

## Key Features
- webassembly\n- package-manager\n- wasmer
