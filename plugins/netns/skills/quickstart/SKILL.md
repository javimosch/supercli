---
name: netns
description: Use this skill when the user wants to runc hook (oci compatible) for setting up default bridge networking for containers.
---

# Netns Plugin

Runc hook (OCI compatible) for setting up default bridge networking for containers.

## Commands

### Operations
- `netns network setup` — setup network via netns

## Usage Examples
- "netns --help"
- "netns <args>"

## Installation

```bash
go install github.com/genuinetools/netns@latest
```

## Examples

```bash
netns --version
netns --help
```

## Key Features
- containers\n- networking\n- oci
