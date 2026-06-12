---
name: fend
description: Use this skill when the user needs an arbitrary-precision, unit-aware command-line calculator.
---
# fend Plugin
An arbitrary-precision, unit-aware calculator for the command line.
## Commands
- `fend self version` — Print fend version
- `fend _ _` — Passthrough to fend CLI
## Installation
```bash
cargo install fend
```
## Examples
```bash
fend "1 + 1"
fend "1 meter + 2 feet"
fend "now + 7 days"
fend "0b1010 + 0xFF"
```
## Key Features
- **Unit-aware** — Physical units, currency, date arithmetic
- **Arbitrary precision** — Exact calculations, no floating point errors
- **Base conversion** — Binary, octal, decimal, hex
- **Pipeline-ready** — Clean text output for scripts
