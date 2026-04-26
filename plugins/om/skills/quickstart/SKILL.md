---
name: om
description: Use this skill when the user wants to pivotal operations manager command line tool.
---

# Om Plugin

Pivotal Operations Manager command line tool.

## Commands

### Operations
- `om product list` — list product via om
- `om stemcell list` — list stemcell via om
- `om bosh-env show` — show bosh-env via om
- `om configure-product run` — run configure-product via om

## Usage Examples
- "om --help"
- "om <args>"

## Installation

```bash
go install github.com/pivotal-cf/om@latest
```

## Examples

```bash
om --version
om --help
```

## Key Features
- pivotal\n- ops-manager\n- platform
