---
name: sheldon
description: Use this skill when the user wants to manage shell plugins, initialize sheldon config, add/remove plugins, or generate plugin source scripts.
---

# sheldon Plugin

Fast, configurable shell plugin manager for zsh and bash. Manage Git repositories, remote scripts, and local directories as shell plugins using a TOML config file.

## Commands

### Configuration
- `sheldon config init` — Initialize a new plugins.toml config file
- `sheldon config edit` — Open config in the default editor

### Plugin Management
- `sheldon plugin add` — Add a new plugin (GitHub, Git, remote, or local)
- `sheldon plugin remove` — Remove a plugin
- `sheldon plugin lock` — Install sources and generate lock file
- `sheldon plugin source` — Generate and output shell source script

### Utility
- `sheldon _ _` — Passthrough to sheldon CLI

## Usage Examples
- "Initialize sheldon for zsh"
- "Add the base16-shell plugin from GitHub"
- "Generate the plugin source script"
- "Lock and install all plugins"

## Installation

```bash
brew install sheldon
```

Or via Cargo:
```bash
cargo install sheldon
```

Or via the install script:
```bash
curl --proto '=https' -fLsS https://rossmacarthur.github.io/install/crate.sh | bash -s -- --repo rossmacarthur/sheldon --to ~/.local/bin
```

## Quick Start

```bash
# Initialize for zsh
sheldon config init --shell zsh

# Add a plugin from GitHub
sheldon plugin add base16 --github chriskempson/base16-shell

# Generate source and add to ~/.zshrc
# eval "$(sheldon source)"
```

## Examples

```bash
# Initialize sheldon for bash
sheldon config init --shell bash

# Add a GitHub plugin with a specific tag
sheldon plugin add zsh-autosuggestions --github zsh-users/zsh-autosuggestions --tag v0.7.0

# Add a Git plugin from any URL
sheldon plugin add my-plugin --git https://github.com/owner/repo.git

# Lock and install all plugin sources
sheldon plugin lock --update

# Generate shell source script
sheldon plugin source

# Remove a plugin
sheldon plugin remove base16

# Passthrough: show version
sheldon _ _ --version

# Passthrough: show help
sheldon _ _ --help
```

## Key Features
- **Git sources** — Clone plugins from GitHub, Gists, or any Git URL
- **Remote sources** — Download single-file plugins from URLs
- **Local sources** — Reference local directories as plugins
- **TOML config** — Clean, readable plugin configuration
- **Template system** — Customizable shell script generation per plugin
- **Profiles** — Load different plugins based on context
- **Parallel installs** — Fast plugin downloading and lock file generation
- **Shell agnostic** — Works with zsh, bash, and fish
