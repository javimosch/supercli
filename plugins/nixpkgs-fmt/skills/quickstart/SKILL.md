---
name: nixpkgs-fmt
description: Use this skill when the user wants to format Nix code, format nixpkgs expressions, or format NixOS configuration files.
---

# nixpkgs-fmt Plugin

Nix code formatter for nixpkgs. Format Nix expressions and configurations according to nixpkgs style guidelines.

## Commands

### Nix Formatting
- `nixpkgs-fmt nix format` — Format Nix code

### Utility
- `nixpkgs-fmt _ _` — Passthrough to nixpkgs-fmt CLI

## Usage Examples
- "Format Nix code"
- "Format nixpkgs expression"
- "Format NixOS config"
- "Check Nix formatting"

## Installation

```bash
brew install nixpkgs-fmt
```

Or via Nix:
```bash
nix-env -iA nixpkgs.nixpkgs-fmt
```

## Examples

```bash
# Format Nix file
nixpkgs-fmt nix format default.nix

# Check without modifying
nixpkgs-fmt nix format default.nix --check

# Write changes
nixpkgs-fmt nix format default.nix --write

# Verify formatting
nixpkgs-fmt nix format default.nix --verify

# Any nixpkgs-fmt command with passthrough
nixpkgs-fmt _ _ default.nix
nixpkgs-fmt _ _ default.nix --check
```

## Key Features
- **Nixpkgs** - nixpkgs style guidelines
- **Format** - Nix code formatting
- **Check** - Check without changes
- **Verify** - Verify formatting
- **Standard** - Consistent style
- **NixOS** - NixOS configs
- **Fast** - Quick formatting
- **Easy** - Simple interface
- **Maintainers** - Package maintainers
- **Reliable** - Reliable output

## Notes
- Great for Nix package maintainers
- Follows nixpkgs style guide
- Perfect for NixOS configs
- Pre-commit hook support
