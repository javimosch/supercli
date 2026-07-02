---
name: twine
description: Use this skill when the user wants to upload Python packages to PyPI, check distribution files, or publish Python packages securely.
---

# twine Plugin

Securely upload Python packages to PyPI with verified HTTPS connections.

## Commands

### Upload
- `twine upload run` — Upload distribution packages to PyPI

### Check
- `twine upload check` — Check distribution packages for common issues

## Usage Examples
- "Upload dist/* to PyPI"
- "Check my distribution files"
- "Publish to test PyPI"

## Installation

```bash
pip install twine
```

## Examples

```bash
# Upload to PyPI
twine upload dist/*

# Upload to test PyPI
twine upload --repository testpypi dist/*

# Check distribution files
twine check dist/*

# Upload with a specific username
twine upload --username __token__ dist/*

# Skip existing files
twine upload --skip-existing dist/*
```
