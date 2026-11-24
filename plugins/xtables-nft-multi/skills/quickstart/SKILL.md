---
name: xtables-nft-multi
description: Use this skill when the user wants to use xtables-nft-multi, administration tools for packet filtering and NAT.
---

# xtables-nft-multi Plugin

xtables-nft-multi — administration tools for packet filtering and NAT.

## Commands
- `xtables-nft-multi <resource> <action>` — Execute xtables-nft-multi commands
- `xtables-nft-multi self version` — Print xtables-nft-multi version
- `xtables-nft-multi _ _` — Passthrough to xtables-nft-multi CLI

## Usage Examples
- "xtables-nft-multi --help"
- "xtables-nft-multi self version"

## Installation
```bash
apt-get install iptables 2>/dev/null || which xtables-nft-multi
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
