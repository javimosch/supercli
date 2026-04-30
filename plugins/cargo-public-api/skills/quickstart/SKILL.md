---
name: cargo-public-api
description: Use this skill when the user wants to list or diff the public API of a Rust library crate.
---

# cargo-public-api Plugin

List and diff the public API of Rust library crates.

## Commands

### API
- `cargo-public-api api list` — List the public API of a Rust crate
- `cargo-public-api api diff` — Diff public API between two versions/commits

## Usage Examples
- "List the public API of my Rust crate"
- "Compare public API between two commits"
- "Check what changed in the public API"

## Installation

```bash
cargo install cargo-public-api
```

## Examples

```bash
# List current public API
cargo public-api

# Diff against previous commit
cargo public-api diff HEAD~1

# Diff between two versions
cargo public-api diff v1.0.0 v2.0.0

# Output as JSON
cargo public-api --output-format json

# Check for semver violations
cargo public-api diff --deny changed
```

## Key Features
- List public API of Rust crates
- Diff API between commits and releases
- Semver compliance checking
- JSON output for tooling
- Tracks breaking changes
