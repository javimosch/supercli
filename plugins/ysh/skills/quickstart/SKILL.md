---
name: ysh
description: Use this skill when the user wants a modern POSIX-compatible shell — OSH runs bash scripts as-is, YSH adds typed data, structured pipelines and clean syntax.
---

# ysh Plugin

Oils for Unix is a single native binary with two shells: `osh` (bash/POSIX-compatible) and `ysh` (modern language with typed data and structured pipelines).

## Commands

### Shell
- `ysh shell exec "<code>"` — Run YSH code
- `ysh osh exec "<code>"` — Run bash-compatible code with OSH
- `ysh script run <file>` — Execute a .ysh script
- `ysh self version` — Show version
- `ysh _ _` — Passthrough to ysh CLI

## Usage Examples

- "Run my bash script under a stricter shell"
- "Write a script with real dicts and JSON output"
- "Syntax-check this shell file"

## Installation

```bash
# tarball: https://www.oils.pub/release/latest/
./configure && _build/oils.sh && sudo ./install
# or: mise use ysh
```

## Examples

```bash
ysh -c 'var x = {"k": [1,2]}; json write (x)'
ysh -c 'proc greet(name) { echo "hi $name" }; greet world'
osh -c 'for f in *.sh; do bash -n "$f"; done'   # bash-compatible
ysh -n script.ysh                               # syntax check only
```

## Key Features

- OSH runs most bash scripts unchanged, with better errors (`osh -n` checks)
- YSH: expressions, Dict/List types, `json write`/`json read` pipelines
- Single static C++ binary — no dependencies, fast startup
- Egg expressions, procs vs funcs, honest error messages
