---
name: mypy
description: Use this skill when the user wants to type-check Python code, find type errors, verify PEP 484 annotations, or enforce static typing.
---

# mypy Plugin

Python static type checker (PEP 484).

## Commands

### Check
- `mypy check run` — Type-check Python files
- `mypy check strict` — Type-check with strict mode

## Usage Examples
- "Type-check this Python file"
- "Find type errors in my project"
- "Run strict type checking"
- "Verify type annotations"

## Installation

```bash
pip install mypy
```

## Examples

```bash
# Basic type check
mypy mymodule.py

# Check a package
mypy mypackage/

# Strict mode
mypy --strict mymodule.py

# With config
mypy --config-file mypy.ini mymodule.py

# Ignore missing imports
mypy --ignore-missing-imports mymodule.py

# Strict optional
mypy --strict-optional mymodule.py
```
