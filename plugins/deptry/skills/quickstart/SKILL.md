---
name: deptry
description: Use this skill when the user wants to check Python project dependencies for unused or missing packages, or audit dependency health.
---

# deptry Plugin

Find unused, missing, and obsolete dependencies in Python projects.

## Commands

### Project
- `deptry project check` — Check project for dependency issues

## Usage Examples
- "Check my Python project for unused dependencies"
- "Find missing dependencies"
- "Audit dependency health"

## Installation

```bash
pip install deptry
```

## Examples

```bash
# Check current directory
deptry .

# Check specific directory
deptry /path/to/project

# Ignore certain packages
deptry . --ignore my-package

# Exclude specific directories
deptry . --exclude tests

# JSON output
deptry . --json
```
