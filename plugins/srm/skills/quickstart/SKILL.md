---
name: srm
description: srm — secure file deletion tool that overwrites data before removal. Implements multiple wipe algorithms including Gutmann, DoD 5220.22-M, and random overwrite passes. Prevents recovery of deleted files by ensuring the underlying storage data is irrecoverable.
---

# srm Plugin

srm — secure file deletion tool that overwrites data before removal. Implements multiple wipe algorithms including Gutmann, DoD 5220.22-M, and random overwrite passes. Prevents recovery of deleted files by ensuring the underlying storage data is irrecoverable.

## Installation

```bash
brew install srm
Verify: srm --version
```

## Commands

### `sc srm self version`

Print srm version

## Passthrough

```bash
sc srm _ _ <args...>
```

## SuperCLI

```bash
sc srm _ _ --help
sc plugins learn srm
```
