---
name: aqua
description: Use this skill when the user wants to install CLI tools declaratively, manage tool versions with YAML, or set up a consistent development environment across teams.
---

# aqua Plugin

Declarative CLI Version manager. Install CLI tools with a single command and manage their versions declaratively via YAML configuration.

## Commands

### Tool Management
- `aqua tool install` — Install CLI tools
- `aqua tool list` — List installed tools

### Utility
- `aqua _ _` — Passthrough to aqua CLI

## Usage Examples
- "Install CLI tools"
- "List installed tools"
- "Setup dev environment"
- "Manage tool versions"

## Installation

```bash
brew install aquaproj/aqua/aqua
```

## Examples

```bash
# Install all tools from aqua.yaml
aqua tool install --all

# Install specific tool
aqua tool install gh

# List installed tools
aqua tool list --installed

# List all available tools
aqua tool list

# Any aqua command with passthrough
aqua _ _ install --all
aqua _ _ list
aqua _ _ which gh
```

## Key Features
- **Declarative** - YAML configuration
- **Versions** - Pin tool versions
- **Thousands** - Thousands of tools
- **GitHub** - GitHub Releases
- **Team** - Team environments
- **CI/CD** - Pipeline friendly
- **Fast** - Lazy installation
- **Symlinks** - Symlink management
- **Registry** - Curated registry
- **Cross-platform** - Linux, macOS

## Notes
- Configure via aqua.yaml
- Supports thousands of tools
- Great for team consistency
- Lazy install on first use
