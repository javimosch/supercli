---
name: gitoxide
description: Use this skill when the user wants to use a fast Rust implementation of Git, clone repositories, or perform Git operations with gix.
---

# gitoxide Plugin

An implementation of Git in Rust. A fast, correct, and enjoyable pure Rust implementation of the Git version control system.

## Commands

### Repository Operations
- `gitoxide repo clone` — Clone a repository

### Utility
- `gitoxide _ _` — Passthrough to gix CLI

## Usage Examples
- "Clone a repository"
- "Fast Git clone"
- "Git operations in Rust"
- "Pure Rust Git"

## Installation

```bash
brew install gitoxide
```

Or via Cargo:
```bash
cargo install gitoxide
```

## Examples

```bash
# Clone repository
gitoxide repo clone https://github.com/user/repo

# Shallow clone
gitoxide repo clone https://github.com/user/repo --depth 1

# Bare clone
gitoxide repo clone https://github.com/user/repo --bare

# Any gix command with passthrough
gitoxide _ _ clone https://github.com/user/repo
gitoxide _ _ free
```

## Key Features
- **Fast** - Rust performance
- **Correct** - Correct implementation
- **Pure Rust** - No C dependencies
- **Clone** - Fast cloning
- **Library** - Usable as library
- **Safe** - Memory safety
- **Git** - Git operations
- **Cross-platform** - Wide support
- **Modern** - Modern Rust
- **Reliable** - Tested extensively

## Notes
- Great for automation
- Pure Rust implementation
- Fast alternative to git
- Can be used as library
