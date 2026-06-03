---
name: gibr
description: Use this skill when the user wants to create well-named git branches following conventions.
---

# Gibr Plugin

Smarter CLI for creating git branches, written in Python.

## Commands

### Branches
- `gibr branch create` — Create a smart git branch
- `gibr branch list` — List branches created with gibr
- `gibr branch cleanup` — Clean up merged branches

## Usage Examples

```bash
gibr branch create feature/user-auth
gibr branch create fix/login-bug
gibr branch list
gibr branch cleanup
gibr --help
```

## Installation

```bash
pip install gibr
```

## Key Features
- Smart branch naming conventions
- Automatic prefix handling (feature/, fix/, etc.)
- Cleanup merged branches
- Interactive branch creation
