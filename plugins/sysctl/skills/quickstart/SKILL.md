---
name: sysctl
description: Configure Linux kernel parameters at runtime
---
# sysctl Plugin
Configure Linux kernel parameters at runtime

## Commands
- `sysctl <resource> <action>` — Execute sysctl commands
- `sysctl self version` — Print sysctl version
- `sysctl all list` — List all kernel parameters
- `sysctl param get` — Get value of a kernel parameter
- `sysctl param set` — Set a kernel parameter value
- `sysctl file load` — Load sysctl settings from a file
- `sysctl param search` — Search kernel parameters matching a pattern
- `sysctl _ _` — Passthrough to sysctl CLI

## Usage
- `sysctl self version` — Print sysctl version
- `sysctl all list` — List all kernel parameters
- `sysctl param get <name>` — Get a parameter value (e.g. kernel.hostname)
- `sysctl param set <name>=<value>` — Set a parameter value
- `sysctl file load [file]` — Load settings from file
- `sysctl param search <pattern>` — Search parameters by regex
- `sysctl _ _ <args>` — Run sysctl with any arguments
