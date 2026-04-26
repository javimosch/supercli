---
name: droot
description: Use this skill when the user wants to the super-simple chroot-based application container engine.
---

# Droot Plugin

The super-simple chroot-based application container engine.

## Commands

### Operations
- `droot image pull` — pull image via droot
- `droot container run` — run container via droot
- `droot container kill` — kill container via droot
- `droot container list` — list container via droot

## Usage Examples
- "droot --help"
- "droot <args>"

## Installation

```bash
go install github.com/yuuki/droot@latest
```

## Examples

```bash
droot --version
droot --help
```

## Key Features
- containers\n- chroot\n- isolation
