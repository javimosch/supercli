---
name: binenv
description: Use this skill when the user needs to install or pin specific versions of CLI binaries (kubectl, terraform, helm, etc.) with shims and a lock file — especially in CI or multi-tool dev environments.
---

# binenv Plugin

Binary version manager that installs CLI tools via shims and tracks versions in a lock file. Keeps kubectl, terraform, and other binaries pinned per project.

## Installation

```bash
go install github.com/devops-works/binenv@latest
```

## Basic Usage

```bash
# Install a binary (latest version)
binenv install kubectl

# Install a specific version
binenv install kubectl 1.29.0

# List installed binaries
binenv list

# Show available versions
binenv available terraform
```

## Typical Workflow

1. Add a `binenv` lock file to your repo
2. Run `binenv install` to sync all pinned tools
3. Shims in `~/.binenv/shims` route to the correct version

## Usage Examples

- "Install kubectl 1.29 for this project"
- "List all CLI tools managed by binenv"
- "What terraform versions are available?"

## SuperCLI

```bash
sc binenv binary install kubectl 1.29.0
sc binenv binary list
sc plugins learn binenv
```
