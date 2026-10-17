---
name: watchexec
description: Execute commands in response to file modifications
---

# watchexec Plugin

Execute commands in response to file modifications

## Commands
- `watchexec <resource> <action>` — Execute watchexec commands
- `watchexec self version` — Version
- `watchexec _ _` — Passthrough to watchexec CLI

## Installation

```bash
brew install watchexec
Verify: watchexec --version
```

## Commands

### `sc watchexec self version`

Version


## Passthrough

```bash
sc watchexec _ _ <args...>
```

## SuperCLI

```bash
sc watchexec _ _ --help
sc plugins learn watchexec
```
