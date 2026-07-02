---
name: flit
description: Use this skill when the user wants to build or publish Python packages to PyPI, or initialize a new Python project with modern packaging.
---

# flit Plugin

Simple way to build and publish Python packages to PyPI.

## Commands

### Build
- `flit build run` — Build a Python package

### Publish
- `flit publish run` — Build and publish to PyPI

### Init
- `flit init run` — Initialize a new Python package

## Usage Examples
- "Build this Python package"
- "Publish to PyPI"
- "Initialize a new Python project"

## Installation

```bash
pip install flit
```

## Examples

```bash
# Build package
flit build

# Publish to PyPI
flit publish

# Publish to test PyPI
flit publish --repository testpypi

# Initialize new project
flit init

# Install in development mode
flit install
```
