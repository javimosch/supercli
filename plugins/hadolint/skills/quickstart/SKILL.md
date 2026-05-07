---
name: hadolint
description: Use this skill when the user wants to lint Dockerfiles, check Dockerfile best practices, or validate container build instructions.
---

# hadolint Plugin

Dockerfile linter with inline-comment ignore support.

## Commands

### Lint
- `hadolint lint run` — Lint a Dockerfile
- `hadolint lint json` — Lint and output JSON

## Usage Examples
- "Check my Dockerfile for issues"
- "Lint the Dockerfile in this directory"
- "Validate best practices in my Dockerfile"

## Installation

```bash
brew install hadolint
```

## Examples

```bash
# Lint Dockerfile
hadolint Dockerfile

# JSON output
hadolint --format json Dockerfile

# Ignore rules
hadolint --ignore DL3003 Dockerfile

# Specify config
hadolint --config .hadolint.yaml Dockerfile
```
