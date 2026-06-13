---
name: petname
description: Use this skill for petname operations.
---

# petname Plugin

Random human-readable name generator for containers, machines, and resources.
Produces memorable two-word names suitable for hostnames and identifiers.

## Quick Start

```bash
# Generate a random name
sc petname

# Check version
sc petname self version

# Generate name with options
petname --words 3 --separator -
```

## Commands

- `sc petname` — Generate a random petname (no args needed)
- `sc petname self version` — Print petname version
- `petname --words 3 --separator -` — Custom words count and separator

## Installation

```bash
cargo install petname
sc plugins install petname
```

## Key Features

- **Pipeline-ready** — works with stdin/stdout
- **Memorable names** — two-word adjective-noun pairs
- **Customizable** — word count, separator, complex mode
