---
name: hexyl
description: Use this skill when the user wants to inspect binary files, view hex dumps, examine file headers, debug compiled output, analyze binary data, or pipe raw bytes into a formatted hex viewer.
---

# Hexyl Plugin

A command-line hex viewer by sharkdp (fd, bat author). Pretty-print binary files with colored output.

## Commands

### Self
- `hexyl self version` — Print version

### Hex
- `hexyl hex view` — View hex dump (passthrough: `hexyl <file> [-n bytes] [-s skip]`)

### Passthrough
- `hexyl _ _` — Passthrough for any hexyl command

## Usage Examples
- "Show the hex dump of this binary file"
- "Inspect the first 64 bytes of this WASM file"
- "View the file header of this PNG image"
- "Show me the binary content of this executable"

## Installation

```bash
cargo install hexyl
```

## Examples

```bash
# Basic hex dump
hexyl file.bin

# Read from stdin
cat file.bin | hexyl

# First N bytes
hexyl -n 64 file.bin
hexyl -n 4KiB file.bin

# Skip N bytes
hexyl -s 1024 file.bin
hexyl -s 0x1000 file.bin

# Combined: read 256 bytes starting at offset 512
hexyl -n 256 -s 512 file.bin

# Custom block size
hexyl --block-size 1024 file.bin
```

## Key Features
- Colored output: different colors for different byte types
- ASCII representation column
- Smart byte grouping (4-byte nibbles)
- Column headers with offsets
- Supports stdin piping
- Binary and decimal offset notation
- Length and skip filters
- Block-size formatting
