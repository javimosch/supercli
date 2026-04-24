---
name: cargo-edit
description: Use this skill when the user wants to manage Rust dependencies, add crates to Cargo.toml, or upgrade Cargo packages.
---

# cargo-edit Plugin

A utility for managing cargo dependencies from the command line. Add, remove, and upgrade Rust dependencies easily.

## Commands

### Dependency Management
- `cargo-edit dependency add` — Add dependency to Cargo.toml

### Utility
- `cargo-edit _ _` — Passthrough to cargo-edit CLI

## Usage Examples
- "Add dependency to Cargo"
- "Remove Rust crate"
- "Upgrade dependencies"
- "Add dev dependency"

## Installation

```bash
brew install cargo-edit
```

Or via Cargo:
```bash
cargo install cargo-edit
```

## Examples

```bash
# Add dependency
cargo-edit dependency add serde

# Add specific version
cargo-edit dependency add serde --version 1.0

# Add as dev dependency
cargo-edit dependency add serde --dev

# Add as build dependency
cargo-edit dependency add serde --build

# Remove dependency
cargo-edit _ _ rm serde

# Upgrade dependencies
cargo-edit _ _ upgrade

# Any cargo-edit command with passthrough
cargo-edit _ _ add serde
cargo-edit _ _ upgrade
```

## Key Features
- **Add** - Add new dependencies
- **Remove** - Remove dependencies
- **Upgrade** - Upgrade dependencies
- **Dev deps** - Add dev dependencies
- **Build deps** - Add build dependencies
- **Version** - Specify versions
- **Auto-update** - Updates Cargo.toml
- **Fast** - Quick dependency management
- **Rust** - Built for Rust projects
- **Easy** - Simple command interface

## Notes
- Modifies Cargo.toml directly
- Supports all dependency types
- Great for Rust development
- Works with cargo workspaces
