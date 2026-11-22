---
name: bison.yacc
description: Use this skill when the user wants to use bison.yacc, YACC-compatible parser generator.
---

# bison.yacc Plugin

bison.yacc — YACC-compatible parser generator.

## Commands
- `bison.yacc <resource> <action>` — Execute bison.yacc commands
- `bison.yacc self version` — Print bison.yacc version
- `bison.yacc _ _` — Passthrough to bison.yacc CLI

## Usage Examples
- "bison.yacc --help"
- "bison.yacc self version"

## Installation
```bash
apt-get install bison 2>/dev/null || which bison.yacc
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
