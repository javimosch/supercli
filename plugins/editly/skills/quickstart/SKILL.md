---
name: editly
description: editly — declarative video editor CLI
---

# editly Plugin

editly — declarative video editor CLI

## Commands
- `editly <resource> <action>` — Execute editly commands
- `editly _ _` — Passthrough

## Installation

```bash
npm install -g editly
```

Requires Node.js and ffmpeg.

## Passthrough

```bash
sc editly _ _ <args...>
```

## SuperCLI

```bash
sc editly _ _ --help
sc plugins learn editly
```
