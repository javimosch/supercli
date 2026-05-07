---
name: pylint
description: Use this skill when the user wants to lint Python code, check Python code quality, find errors in Python, or enforce coding standards.
---

# pylint Plugin

Python static code analysis and linter.

## Commands

### Lint
- `pylint lint run` — Lint Python files
- `pylint lint json` — Lint Python files and output JSON

## Usage Examples
- "Check this Python file for errors"
- "Lint my Python project"
- "Find code smells in my Python code"
- "Get a code quality score"

## Installation

```bash
pip install pylint
```

## Examples

```bash
# Lint a file
pylint mymodule.py

# Lint a package
pylint mypackage/

# JSON output
pylint --output-format json mymodule.py

# With config
pylint --rcfile .pylintrc mymodule.py

# Disable specific checks
pylint --disable=C0111 mymodule.py
```
