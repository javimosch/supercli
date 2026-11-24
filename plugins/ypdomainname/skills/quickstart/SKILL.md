---
name: ypdomainname
description: Use this skill when the user wants to use ypdomainname, utility to set/show the host name or domain name.
---

# ypdomainname Plugin

ypdomainname — utility to set/show the host name or domain name.

## Commands
- `ypdomainname <resource> <action>` — Execute ypdomainname commands
- `ypdomainname self version` — Print ypdomainname version
- `ypdomainname _ _` — Passthrough to ypdomainname CLI

## Usage Examples
- "ypdomainname --help"
- "ypdomainname self version"

## Installation
```bash
apt-get install hostname 2>/dev/null || which ypdomainname
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
