---
name: mpv
description: mpv — command-line media player
---

# mpv Plugin

mpv — command-line media player

## Commands
- `mpv <resource> <action>` — Execute mpv commands
- `mpv _ _` — Passthrough

## Installation

```bash
macOS: brew install mpv
Ubuntu/Debian: sudo apt install mpv
Windows: winget install mpv
```


## Passthrough

```bash
sc mpv _ _ <args...>
```

## SuperCLI

```bash
sc mpv _ _ --help
sc plugins learn mpv
```
