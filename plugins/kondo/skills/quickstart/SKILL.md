---
name: kondo
description: Use this skill when the user wants to clean up project artifacts, delete build caches, or free up disk space from development projects.
---

# kondo Plugin

Clean up project artifacts and dependencies. Identify and delete unnecessary build artifacts, caches, and dependencies from your projects to free up disk space.

## Commands

### Project Cleanup
- `kondo project clean` — Clean up project artifacts

### Utility
- `kondo _ _` — Passthrough to kondo CLI

## Usage Examples
- "Clean project artifacts"
- "Delete build caches"
- "Free up disk space"
- "Remove dependencies"

## Installation

```bash
brew install kondo
```

Or via Cargo:
```bash
cargo install kondo
```

## Examples

```bash
# Clean current directory
kondo project clean

# Clean specific path
kondo project clean ./my-project

# Dry run
kondo project clean --dry-run

# Clean all artifacts
kondo project clean --all

# Any kondo command with passthrough
kondo _ _ ./my-project
kondo _ _ --all --dry-run
```

## Key Features
- **Multi-language** - Rust, Node.js, Python, and more
- **Artifacts** - Build artifacts
- **Caches** - Cache cleanup
- **Dependencies** - Dependency cleanup
- **Disk space** - Free up space
- **Safe** - Dry-run mode
- **Fast** - Quick scanning
- **Recursive** - Recursive cleanup
- **Dry-run** - Preview changes
- **Selective** - Choose what to clean

## Notes
- Supports multiple languages
- Always use --dry-run first
- Great for CI/CD cleanup
- Frees up significant disk space
