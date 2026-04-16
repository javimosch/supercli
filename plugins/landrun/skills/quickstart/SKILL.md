---
name: landrun
description: Use this skill when the user wants to sandbox a command with restricted filesystem or network access on Linux.
---

# Landrun Plugin

Run Linux processes in a secure sandbox using Landlock kernel security. No root, no containers, no AppArmor configs.

## Commands

### Sandbox Execution
- `landrun run ro` — Run command with read-only directory access
- `landrun run rw` — Run command with read-write directory access  
- `landrun run rox` — Run command with read-only + execute access
- `landrun run network-restricted` — Run command with TCP port restrictions
- `landrun run debug` — Run with debug logging

### Passthrough
- `landrun _ _` — Direct passthrough to landrun CLI

## Usage Examples

- "Sandbox curl to only connect to port 443"
- "Run a script with read-only access to my home directory"
- "Execute a binary with restricted filesystem access"
- "Debug why a command is getting permission denied"

## Installation

```bash
go install github.com/zouuup/landrun/cmd/landrun@latest
```

Requires: Linux kernel 5.13+ with Landlock enabled

## Examples

```bash
# Read-only access to a directory
landrun --ro /home ls /home

# Read-write to a specific directory
landrun --rw /tmp/data touch /tmp/data/test.txt

# Read-only + execute (for running binaries)
landrun --rox /usr --ro /lib /usr/bin/bash

# Network restriction - only allow HTTPS
landrun --connect-tcp 443 curl https://example.com

# Debug mode for troubleshooting
landrun --log-level debug --rox /usr --ro /lib ls /usr

# Best-effort mode (graceful fallback on older kernels)
landrun --best-effort --rw /tmp command
```

## Key Flags

| Flag | Description |
|------|-------------|
| `--ro <path>` | Read-only access |
| `--rox <path>` | Read-only + execute |
| `--rw <path>` | Read-write access |
| `--rwx <path>` | Read-write + execute |
| `--bind-tcp <port>` | Allow binding to TCP port |
| `--connect-tcp <port>` | Allow connecting to TCP port |
| `--env <var>` | Pass environment variable |
| `--best-effort` | Fallback on older kernels |
| `--unrestricted-network` | Allow all network access |
| `--unrestricted-filesystem` | Allow all filesystem access |
| `--add-exec` | Auto-add binary to permissions |
| `--ldd` | Auto-add required libraries |

## Key Features
- Kernel-level security via Landlock LSM
- No root or container required
- Fine-grained filesystem and network control
- TCP port binding and connection restrictions
- Graceful degradation on older kernels
- Environment variable passing
