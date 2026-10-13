---
name: pyrefly
description: Use this skill when the user wants to type check Python code, migrate from mypy/pyright, or add type annotations with pyrefly.
---

# Pyrefly Plugin

Pyrefly is a fast Python type checker and language server (Rust, Meta). ~15x faster than mypy/pyright; default checker for Instagram's 20M-line codebase. Also ships Pydantic/Django/pytest support and IDE features via `pyrefly lsp`.

## Commands

### Type Checking
- `pyrefly check run` — Type check project (`--output-format json` for pipelines)
- `pyrefly self version` — Print pyrefly version

### Adoption & Migration
- `pyrefly config init` — Create config, optionally migrate mypy/pyright settings
- `pyrefly suppress run` — Add suppression comments to silence existing errors
- `pyrefly infer run` — Insert inferred type annotations into source
- `pyrefly config dump` — Show merged configuration
- `pyrefly _ _` — Passthrough to pyrefly CLI

## Usage Examples

- "Type check this Python project"
- "Migrate this repo from mypy to pyrefly"
- "Silence all existing type errors so CI passes"
- "Add inferred type annotations to this file"
- "Give me type errors as JSON"

## Installation

```bash
pip install pyrefly
# or: uv tool install pyrefly
# or: cargo install pyrefly
```

## Examples

```bash
# Check whole project
pyrefly check

# JSON output for tooling
pyrefly check --output-format json

# Baseline existing errors, then fix incrementally
pyrefly init
pyrefly suppress

# Generate annotations from inference
pyrefly infer path/to/file.py
```

## Key Features

- 1.85M+ lines/sec; sub-10ms rechecks in the IDE
- Drop-in migration: `pyrefly init` reads mypy.ini / pyrightconfig
- `pyrefly suppress` baselines existing errors on upgrade
- `pyrefly infer` writes inferred annotations into source
- Built-in Pydantic, Django, and pytest understanding
