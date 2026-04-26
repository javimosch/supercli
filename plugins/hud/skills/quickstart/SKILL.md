---
name: hud
description: Use this skill when the user wants to find code blocking your tokio workers with ebpf-powered diagnostics.
---

# Hud Plugin

Find code blocking your Tokio workers with eBPF-powered diagnostics.

## Commands

### Operations
- `hud process monitor` — monitor process via hud
- `hud process report` — report process via hud
- `hud process trace` — trace process via hud
- `hud config show` — show config via hud

## Usage Examples
- "hud --help"
- "hud <args>"

## Installation

```bash
cargo install hud
```

## Examples

```bash
hud --version
hud --help
```

## Key Features
- tokio\n- ebpf\n- diagnostics
