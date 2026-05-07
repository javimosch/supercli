---
name: pipenv
description: Use this skill when the user wants to manage Python dependencies, create virtual environments, install packages from Pipfile, or sync Python environments.
---

# pipenv Plugin

Python dependency management and packaging tool.

## Commands

### Install
- `pipenv install run` — Install packages from Pipfile
- `pipenv install dev` — Install dev packages from Pipfile

### Environment
- `pipenv sync run` — Sync environment with Pipfile.lock
- `pipenv lock run` — Generate Pipfile.lock

### Analysis
- `pipenv graph show` — Show dependency graph
- `pipenv check run` — Check for security vulnerabilities

## Usage Examples
- "Install dependencies from Pipfile"
- "Show the dependency graph"
- "Lock dependencies"
- "Check for vulnerabilities"

## Installation

```bash
pip install pipenv
```

## Examples

```bash
# Install all dependencies
pipenv install

# Install a package
pipenv install requests

# Install dev dependency
pipenv install --dev pytest

# Generate lock file
pipenv lock

# Sync from lock file
pipenv sync

# Show dependency graph
pipenv graph

# Security check
pipenv check

# Run in virtualenv
pipenv run python myscript.py
```
