---
name: rye
description: Use this skill when the user wants to manage Python projects, install dependencies with lockfile, sync environments, publish packages, or use the uv-backed Python package manager.
---

# rye Plugin

Python package manager with uv backend, lockfile, and workspace support.

## Commands

### Project
- `rye init run` — Initialize a new Python project
- `rye build run` — Build Python package
- `rye publish run` — Publish package to PyPI

### Dependencies
- `rye sync run` — Sync environment with lockfile
- `rye add run` — Add a Python package dependency
- `rye lock run` — Generate lockfile

## Usage Examples
- "Initialize a new Python project with rye"
- "Install dependencies from lockfile"
- "Add a package dependency"
- "Build and publish my package"

## Installation

```bash
curl -fsSL https://rye.astral.sh/get | bash
```

## Examples

```bash
# Init new project
rye init my-project

# Add dependency
rye add requests

# Sync environment
rye sync

# Lock dependencies
rye lock

# Build
rye build

# Publish
rye publish
```
