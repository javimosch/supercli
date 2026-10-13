---
name: cargo-dist
description: Use this skill when the user wants to release a Rust binary — build cross-platform tarballs, shell installers, Homebrew formulas, and CI wiring with cargo-dist.
---

# cargo-dist Plugin

cargo-dist (`cargo dist`) is the "it just works" release pipeline for Rust binaries:
`dist init` wires config into `Cargo.toml` plus a GitHub Actions `release.yml`; pushing
a tag then produces tarballs for every target, shell/powershell installers, Homebrew
formulas, npm wrappers, and checksums.

## Commands

### Setup & Build
- `cargo-dist project init` — Initialize dist in the workspace
- `cargo-dist release plan` — Print the release plan (JSON)
- `cargo-dist release build` — Build artifacts locally
- `cargo-dist ci generate` — Regenerate CI/installers
- `cargo-dist _ _` — Passthrough (`dist host`, `dist manifest`, `dist link`)

## Usage Examples

- "Set up release automation for this Rust CLI"
- "What will dist build for tag v1.2.3?"
- "Regenerate the release workflow after changing config"
- "Build release artifacts locally to test"

## Installation

```bash
cargo install cargo-dist --locked
# or: brew install axodotdev/tap/dist
# or: mise use cargo-dist
```

## Examples

```bash
# One-time setup (interactive)
dist init

# Dry-run the release without building
dist plan

# Build everything for the current tag/version
dist build

# Regenerate release.yml + installers after editing Cargo.toml
dist generate
```

## Key Features

- `dist init` auto-detects binaries, targets, CI provider, installers
- Installers: shell script, powershell, Homebrew formula, npm package, MSI
- `dist plan` emits machine-readable JSON of the entire release
- `dist manifest` regenerates the release manifest without rebuilding
