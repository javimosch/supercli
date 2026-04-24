---
name: nixpacks
description: Use this skill when the user wants to build Docker images from source code, generate build plans, or use Nix packages for dependencies.
---

# nixpacks Plugin

App source + Nix packages + Docker = Image. Build Docker images from source code using Nix packages automatically.

## Commands

### Build Operations
- `nixpacks build plan` — Generate build plan

### Utility
- `nixpacks _ _` — Passthrough to nixpacks CLI

## Usage Examples
- "Generate build plan"
- "Build Docker image"
- "Detect dependencies"
- "Build from source"

## Installation

```bash
brew install nixpacks
```

Or via Cargo:
```bash
cargo install nixpacks
```

## Examples

```bash
# Generate build plan
nixpacks build plan .

# Build with config
nixpacks build plan . --config nixpacks.toml

# Disable cache
nixpacks build plan . --no-cache

# Build Docker image
nixpacks _ _ build .

# Detect language and plan
nixpacks _ _ plan
```

## Key Features
- **Auto-detect** - Detects programming languages
- **Docker** - Builds Docker images
- **Nix packages** - Uses Nix for dependencies
- **Multi-language** - Node.js, Python, Go, Rust, Java, etc.
- **Configurable** - Custom configuration files
- **Caching** - Build caching support
- **Buildpacks** - Compatible with buildpacks
- **Fast** - Efficient builds
- **Reproducible** - Reproducible builds
- **Cross-platform** - Linux, macOS, Windows

## Notes
- Supports many programming languages
- Automatically detects dependencies
- Great for containerizing applications
- Can be used in CI/CD pipelines
