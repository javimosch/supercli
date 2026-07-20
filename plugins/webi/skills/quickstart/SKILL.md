---
name: webi
description: Use this skill when the user wants to install developer tools without sudo or a system package manager — curl-based installs via memorable URLs for ripgrep, jq, node, and hundreds of other CLI tools.
---

# webi Plugin

Web-based installer for developer tools. Installs binaries via easy-to-remember URLs without root or a package manager.

## Installation

```bash
curl -sS https://webi.sh/webi | sh
```

## Basic Usage

```bash
# Install a tool by name
webi rg
webi jq
webi node

# Install from a full URL
webi https://webi.sh/rg
```

Tools are installed to `~/.local/opt/<tool>/` with symlinks in `~/.local/bin/`.

## Usage Examples

- "Install ripgrep without apt or brew"
- "Set up jq on this machine quickly"
- "Install node via webi"

## SuperCLI

```bash
sc webi install run rg
sc webi _ _
sc plugins learn webi
```
