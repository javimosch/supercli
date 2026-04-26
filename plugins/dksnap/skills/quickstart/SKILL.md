---
name: dksnap
description: Use this skill when the user wants to docker snapshots for development and test data management.
---

# Dksnap Plugin

Docker snapshots for development and test data management.

## Commands

### Operations
- `dksnap container snapshot` — snapshot container via dksnap
- `dksnap container restore` — restore container via dksnap
- `dksnap container list` — list container via dksnap
- `dksnap container delete` — delete container via dksnap

## Usage Examples
- "dksnap --help"
- "dksnap <args>"

## Installation

```bash
go install github.com/kelda/dksnap@latest
```

## Examples

```bash
dksnap --version
dksnap --help
```

## Key Features
- docker\n- snapshots\n- testing
