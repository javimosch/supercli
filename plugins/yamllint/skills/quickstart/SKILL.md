---
name: yamllint
description: Use this skill when the user wants to lint YAML files, validate YAML syntax, check YAML formatting, or enforce YAML style conventions.
---

# yamllint Plugin

Linter for YAML files with configurable rules.

## Commands

### Lint
- `yamllint lint run` — Lint YAML files
- `yamllint lint format` — Lint with specific output format

## Usage Examples
- "Check this YAML file for issues"
- "Lint all YAML files in this directory"
- "Validate YAML formatting"

## Installation

```bash
pip install yamllint
```

## Examples

```bash
# Basic lint
yamllint file.yaml

# Lint directory
yamllint .

# JSON format
yamllint --format parsable file.yaml

# With config
yamllint -c .yamllint file.yaml
```
