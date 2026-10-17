---
name: unar
description: unar — universal archive extractor supporting RAR, 7z, tar, gzip, bzip2, ZIP, ISO, CAB and 60+ formats
---

# unar Plugin

unar — universal archive extractor supporting RAR, 7z, tar, gzip, bzip2, ZIP, ISO, CAB and 60+ formats

## Commands
- `unar <resource> <action>` — Execute unar commands
- `unar _ _` — Passthrough to unar CLI

## Installation

```bash
brew install unar
Verify: unar --version
```

## Passthrough

```bash
sc unar _ _ <args...>
```

## SuperCLI

```bash
sc unar _ _ --help
sc plugins learn unar
```
