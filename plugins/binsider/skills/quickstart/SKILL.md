---
name: binsider
description: Use this skill when the user wants to inspect a binary file — ELF headers, symbols, strings, sections, linked libraries or syscall tracing — in one TUI instead of readelf/nm/strings/hexdump.
---

# binsider Plugin

binsider is a TUI binary analyzer combining readelf, nm, strings, ldd and hexdump workflows — plus dynamic syscall tracing.

## Commands

### Analysis
- `binsider binary analyze <file>` — Open the analysis TUI on a binary
- `binsider self version` — Show version
- `binsider _ _` — Passthrough to binsider CLI

## Usage Examples

- "What libraries does this binary link against?"
- "Show me the strings in this executable"
- "Inspect the ELF headers of ./app"
- "Trace the syscalls this binary makes"

## Installation

```bash
cargo install binsider
# or: cargo binstall binsider
# or: brew install binsider
```

## Examples

```bash
binsider /bin/ls          # full TUI analysis
binsider ./suspicious     # inspect symbols/strings/hex tabs
```

## Key Features

- Static analysis: ELF headers, sections, segments, symbols, strings, linked libs
- Hex viewer with navigation and highlighting
- Dynamic analysis: run with syscall tracing + histograms
- One binary replaces readelf + nm + strings + ldd + hexdump juggling
