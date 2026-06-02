---
name: bacon
description: Background Rust code checker
---
# bacon Plugin

Watches your Rust project and runs clippy, rustc, or custom commands on file changes.

## Basic Usage

```bash
# Run bacon in default mode (cargo check)
sc bacon project check

# Run specific job (clippy)
sc bacon project check clippy

# Initialize config
sc bacon config init

# Show version
sc bacon self version

# Passthrough
sc bacon _ _ -- --clippy
```

## Common Jobs

- `clippy` - Run clippy linting
- `test` - Run tests
- `check` - Run cargo check (default)
- Custom jobs defined in bacon.toml
