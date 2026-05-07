---
name: cargo-outdated
description: Use this skill when the user wants to check for outdated Rust dependencies, see available dependency updates, or audit crate versions.
---

# cargo-outdated Plugin

Display when Rust dependencies have newer versions available.

## Commands

### Outdated
- `cargo-outdated outdated list` — List outdated Rust dependencies
- `cargo-outdated outdated json` — List outdated dependencies as JSON

## Usage Examples
- "Check for outdated Rust dependencies"
- "Show me which crates need updating"
- "List outdated packages in JSON"

## Installation

```bash
cargo install cargo-outdated
```

## Examples

```bash
# Basic outdated check
cargo outdated

# JSON output
cargo outdated --format json

# Only root dependencies
cargo outdated --root-deps-only

# Check workspace
cargo outdated --workspace
```
