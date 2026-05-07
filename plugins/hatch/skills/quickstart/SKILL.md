---
name: hatch
description: Use this skill when the user wants to create Python projects, manage Python environments, build packages, publish to PyPI, or manage Python project versions.
---

# hatch Plugin

Modern Python project manager with version management and builds.

## Commands

### Project
- `hatch new run` — Create a new Python project
- `hatch build run` — Build Python package
- `hatch publish run` — Publish package to PyPI

### Environment
- `hatch env create` — Create a Python virtual environment

### Version
- `hatch version show` — Show/update project version

## Usage Examples
- "Create a new Python project"
- "Build my package"
- "Create a virtual environment"
- "Publish to PyPI"
- "Show current version"

## Installation

```bash
pip install hatch
```

## Examples

```bash
# Create new project
hatch new my-project

# Build package
hatch build

# Create environment
hatch env create

# Show version
hatch version

# Bump version
hatch version patch

# Publish
hatch publish
```
