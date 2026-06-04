---
name: fuser
description: Use this skill when the user needs to identify processes using files, sockets, or filesystems.
---

# fuser Plugin

Identify processes using files, sockets, or filesystems. Essential for debugging file locking, port conflicts, and resource contention issues.

## Commands

### File & Socket Inspection
- `fuser file check <path>` — Identify processes using a file or socket
- `fuser tcp port <port>` — Find processes using a specific TCP port
- `fuser self version` — Show fuser version info
- `fuser _ _ <args>` — Passthrough to fuser CLI

## Usage Examples
- "Check what process is using file /var/log/syslog"
- "Find which process is using port 8080"
- "Kill all processes using /dev/ttyUSB0"

## Installation

```bash
# Pre-installed on most Linux systems
# If missing:
apt-get install util-linux
supercli plugins install ./plugins/fuser --on-conflict replace --json
```

## Examples

```bash
# Check what process is using a file
fuser -v /var/log/syslog

# Find processes using TCP port 8080
fuser -v 8080/tcp

# Kill processes using a file
fuser -k /path/to/file

# Find processes on a mount point
fuser -vm /mnt/data

# List processes using IPC resources
fuser -v --ipc /dev/shm/some-file
```

## Key Features
- Identify PIDs using files, sockets, and filesystems
- Kill processes blocking resources
- TCP/UDP port conflict resolution
- Mount point usage inspection
- IPC resource tracking
