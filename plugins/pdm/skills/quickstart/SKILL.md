---
name: pdm
description: Use this skill when the user wants to manage Python packages, install dependencies, build Python packages, publish to PyPI, or use PEP 582 package management.
---

# pdm Plugin

Python package and dependency manager supporting PEP 582.

## Commands

### Package Management
- `pdm install run` — Install dependencies from pyproject.toml
- `pdm add run` — Add package dependency
- `pdm build run` — Build package for distribution
- `pdm publish run` — Publish package to PyPI

## Usage Examples
- "Install project dependencies with pdm"
- "Add requests as a dependency"
- "Build this package"
- "Publish to PyPI"

## Installation

```bash
pip install pdm
```

## Examples

```bash
# Install dependencies
pdm install

# Add dependency
pdm add requests

# Add dev dependency
pdm add --dev pytest

# Build package
pdm build

# Publish to PyPI
pdm publish

# Run script in pdm environment
pdm run python -c "print('hello')"
```
