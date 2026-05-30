---
name: dotbot
description: Use this skill when the user wants to manage dotfiles, bootstrap configuration, create symbolic links, or automate dotfile installation using dotbot.
---

# Dotbot Plugin

Dotfile bootstrapping tool that makes installing dotfiles as easy as `git clone && ./install`. Uses declarative YAML/JSON configuration files with link, create, shell, and clean directives.

## Commands

### Installation
- `dotbot install run` — Run dotbot with a configuration file (supports --dry-run, --only, --except)
- `dotbot install link` — Run only the link directive from a config file
- `dotbot install shell` — Run only the shell directive from a config file
- `dotbot install create` — Run only the create directive from a config file
- `dotbot install clean` — Run only the clean directive from a config file

## Usage Examples
- "dotbot -c install.conf.yaml"
- "dotbot -c install.conf.yaml --dry-run"
- "dotbot -c install.conf.yaml --only link"

## Installation

```bash
pip install dotbot
```

## Examples

```bash
dotbot --version
dotbot -c install.conf.yaml
dotbot -c install.conf.yaml --dry-run
dotbot -c install.conf.yaml --only link,create
dotbot -c install.conf.yaml --except shell
```

## Key Features
- Declarative YAML/JSON configuration
- Symbolic and hard link management
- Directory creation with mode support
- Shell command execution with descriptions
- Dead symlink cleanup
- Extensive plugin system
- Dry-run support for safe testing
