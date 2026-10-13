---
name: cargo-machete
description: Use this skill when the user wants to find or remove unused dependencies in a Rust project or Cargo workspace.
---

# cargo-machete Plugin

cargo-machete scans Rust source files for imports of each declared dependency and reports crates that are never used. Works on single crates and workspaces.

## Commands

- `cargo-machete deps scan` — Scan current dir or paths for unused deps (exit 1 = findings exist)
- `cargo-machete deps fix` — `cargo machete --fix`: remove unused deps from Cargo.toml
- `cargo-machete _ _` — Passthrough to cargo-machete CLI

## Usage Examples

- "Find unused dependencies in this Rust project"
- "Prune dead crates from my workspace's Cargo.toml files"
- "Add an unused-deps check to CI"

## Installation

```bash
cargo install cargo-machete
# or: cargo binstall cargo-machete
# or: brew install cargo-machete
```

## Examples

```bash
cargo machete                      # scan cwd / workspace
cargo machete ./crate-a ./crate-b  # scan specific paths
cargo machete --fix                # remove findings
cargo machete --with-metadata      # include version/source info
```

## Key Features

- Much faster than cargo-udeps (no nightly, no compile — it's an import scan)
- Workspace-aware; respects `[package.metadata.cargo-machete]` ignored lists for macro/build-script false positives
- Non-zero exit on findings → drop into CI as a lint gate
