---
name: pre-commit
description: pre-commit — framework for managing multi-language git pre-commit hooks
---
# pre-commit Plugin

pre-commit is a framework for managing and running git hooks. You declare the linters, formatters, and checks you want in a `.pre-commit-config.yaml`, and pre-commit installs and runs them automatically on each commit across many languages.

## Quickstart

```bash
# Install the git hook into the current repo
pre-commit install

# Run all configured hooks against all files
pre-commit run --all-files

# Run a single hook by id
pre-commit run black --all-files

# Update hook versions to the latest released revs
pre-commit autoupdate

# Generate a sample config to start from
pre-commit sample-config > .pre-commit-config.yaml
```
