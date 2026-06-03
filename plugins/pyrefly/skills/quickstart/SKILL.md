---
name: pyrefly
description: Use this skill when the user wants to type-check Python code for errors.
---

# Pyrefly Plugin

Lightning-fast Python type checker from Meta. Checks 1.85 million lines of code per second.

## Commands

### Type Checking
- `pyrefly project check` — Type-check a Python project or file
- `pyrefly project init` — Initialize pyrefly configuration

## Usage Examples
- "Check this Python project for type errors"
- "Run type checking on this file"
- "Initialize pyrefly in this project"

## Installation

```bash
pip install pyrefly
```

## Examples

```bash
pyrefly check .
pyrefly check src/
pyrefly check myfile.py
pyrefly init
```

## Key Features
- 15x faster than Mypy and Pyright
- Production-proven at Meta/Instagram scale
- CLI and language server modes
- Migration tools from Mypy/Pyright
- Pydantic and Django support out of the box
