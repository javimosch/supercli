---
name: cmirror
description: Use this skill when the user wants to manage package manager mirrors for Chinese developers, test mirror speeds, or switch to faster mirror sources.
---

# Cmirror Plugin

China Mirror Manager - unified CLI for managing mirrors: Pip, NPM, Docker, Cargo, Apt, Go, Brew.

## What is cmirror?

cmirror is a cross-platform CLI tool for Chinese developers to manage package manager mirrors. It provides concurrent speed testing, auto-configuration, and backup/restore functionality.

## Quick Start

```bash
# Check current mirror status
sc cmirror status check

# Test mirror speeds for pip
sc cmirror test benchmark --tool pip

# Switch to fastest mirror for npm
sc cmirror use mirror --tool npm --fastest

# Restore previous configuration
sc cmirror restore config --tool pip
```

## Supported Tools

- **pip** (Python) - `~/.pip/pip.conf`
- **uv** (Python) - `uv.toml`
- **conda** (Python) - `~/.condarc`
- **npm** (Node.js) - `~/.npmrc`
- **docker** - `/etc/docker/daemon.json` (requires sudo)
- **apt** (Ubuntu/Debian) - `/etc/apt/sources.list` (requires sudo)
- **cargo** (Rust) - `~/.cargo/config.toml`
- **go** (Golang) - Environment variable (GOPROXY)
- **brew** (Homebrew) - Environment variable

## Key Commands

### Status Check
- `sc cmirror status check` - Check all tools
- `sc cmirror status check --tool pip` - Check specific tool

### Speed Testing
- `sc cmirror test benchmark --tool pip` - Test pip mirrors
- `sc cmirror test benchmark --tool npm` - Test npm mirrors

### Switch Mirrors
- `sc cmirror use mirror --tool pip --fastest` - Auto-select fastest
- `sc cmirror use mirror --tool npm --source aliyun` - Use specific source

### Restore Configuration
- `sc cmirror restore config --tool pip` - Restore pip config
- `sc cmirror restore config --tool docker` - Restore docker config

## Installation

```bash
wget https://github.com/ox01024/cmirror/releases/latest/download/cmirror-linux-x64.tar.gz
tar -xzf cmirror-linux-x64.tar.gz
chmod +x cmirror && sudo mv cmirror /usr/local/bin/
```

## Use Cases

- Speed up package downloads in China
- Automatically find fastest mirror sources
- Backup and restore package manager configurations
- Manage multiple package managers from one CLI
- Switch between different mirror sources easily