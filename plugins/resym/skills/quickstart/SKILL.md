---
name: resym
description: Use this skill when the user wants to cross-platform tool to browse and extract c and c++ type declarations from pdb files.
---

# Resym Plugin

Cross-platform tool to browse and extract C and C++ type declarations from PDB files.

## Commands

### Operations
- `resym pdb browse` — browse pdb via resym
- `resym pdb extract` — extract pdb via resym
- `resym type search` — search type via resym
- `resym symbol list` — list symbol via resym
- `resym dump run` — run dump via resym
- `resym config show` — show config via resym

## Usage Examples
- "resym --help"
- "resym <args>"

## Installation

```bash
cargo install resym
```

## Examples

```bash
resym --version
resym --help
```

## Key Features
- pdb\n- c++\n- reverse-engineering
