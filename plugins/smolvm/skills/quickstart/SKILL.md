---
name: smolvm
description: Use this skill when the user wants to run bytecode scripts in a portable virtual machine
---

# Smolvm Plugin

run bytecode scripts in a portable virtual machine

## Commands
- `smolvm self version` — Print smolvm version
- `smolvm _ _` — Passthrough to smolvm CLI

## Usage Examples
- "Run this script in the VM"
- "Execute bytecode file"
- "Load and run a program"

## Installation

```bash
cargo install smolvm
```

## Examples
```bash
smolvm run script.bytecode
smolvm exec program.bin
```

## Key Features
- Portable lightweight VM
- Fast bytecode execution
- Small footprint
- Cross-platform
