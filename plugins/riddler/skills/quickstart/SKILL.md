---
name: riddler
description: Use this skill when the user wants to convert docker inspect output to the opencontainers runc spec.
---

# Riddler Plugin

Convert docker inspect output to the opencontainers runc spec.

## Commands

### Operations
- `riddler container convert` — convert container via riddler
- `riddler image inspect` — inspect image via riddler
- `riddler spec generate` — generate spec via riddler

## Usage Examples
- "riddler --help"
- "riddler <args>"

## Installation

```bash
go install github.com/genuinetools/riddler@latest
```

## Examples

```bash
riddler --version
riddler --help
```

## Key Features
- docker\n- runc\n- oci
