---
name: wipe
description: wipe — secure file and directory deletion tool using various overwrite algorithms. Erases file contents before unlinking to prevent forensic recovery. Supports recursive directory wiping, filesystem-free space cleaning, and configurable overwrite passes.
---

# wipe Plugin

wipe — secure file and directory deletion tool using various overwrite algorithms. Erases file contents before unlinking to prevent forensic recovery. Supports recursive directory wiping, filesystem-free space cleaning, and configurable overwrite passes.

## Installation

```bash
brew install wipe
Verify: wipe --version
```

## Commands

### `sc wipe self version`

Print wipe version

## Passthrough

```bash
sc wipe _ _ <args...>
```

## SuperCLI

```bash
sc wipe _ _ --help
sc plugins learn wipe
```
