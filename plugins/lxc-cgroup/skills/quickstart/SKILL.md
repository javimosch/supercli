---
name: lxc-cgroup
description: Use this skill when the user wants to use lxc-cgroup, cli tool: lxc-cgroup.
---

# lxc-cgroup Plugin

CLI tool: lxc-cgroup.

## Commands
- `lxc-cgroup <resource> <action>` — Execute lxc-cgroup commands
- `lxc-cgroup self version` — Print lxc-cgroup version
- `lxc-cgroup _ _` — Passthrough to lxc-cgroup CLI

## Usage Examples
- "lxc-cgroup --help"
- "lxc-cgroup self version"

## Installation
```bash
apt-get install lxc-cgroup 2>/dev/null || which lxc-cgroup
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
