# just-cli Quickstart

Just command runner - a simpler Make alternative. Runs recipes defined in a `justfile`.

## Installation

```bash
# Via Homebrew
brew install just

# Via cargo
cargo install just

# See https://github.com/casey/just for more options
```

## Basic Usage

```bash
# List recipes in the current justfile
just --list

# Run a recipe
just <recipe>

# Run a recipe via supercli
supercli just-cli recipe run --recipe <name>

# Show just version
just --version
```

## SuperCLI Commands

- `just-cli recipe run --recipe <name>` — Run a justfile recipe
- `just-cli recipe list` — List available recipes
- `just-cli self version` — Print just version
- `just-cli _ _` — Passthrough to just CLI
