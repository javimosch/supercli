---
name: pulsemixer
description: pulsemixer — PulseAudio volume control CLI with interactive and batch modes. Adjust sink, source, and stream volumes, toggle mute, change default devices, and manage audio profiles. Supports both interactive TUI and scriptable command-line operations.
---

# pulsemixer Plugin

pulsemixer — PulseAudio volume control CLI with interactive and batch modes. Adjust sink, source, and stream volumes, toggle mute, change default devices, and manage audio profiles. Supports both interactive TUI and scriptable command-line operations.

## Installation

```bash
brew install pulsemixer
Verify: pulsemixer --version
```

## Commands

### `sc pulsemixer self version`

Print pulsemixer version

## Passthrough

```bash
sc pulsemixer _ _ <args...>
```

## SuperCLI

```bash
sc pulsemixer _ _ --help
sc plugins learn pulsemixer
```
