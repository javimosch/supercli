---
name: hostess
description: Use this skill when the user wants to an idempotent command-line utility for managing your /etc/hosts file.
---

# Hostess Plugin

An idempotent command-line utility for managing your /etc/hosts file.

## Commands

### Operations
- `hostess hosts list` — list hosts via hostess
- `hostess hosts add` — add hosts via hostess
- `hostess hosts del` — del hosts via hostess

## Usage Examples
- "hostess --help"
- "hostess <args>"

## Installation

```bash
go install github.com/cbednarski/hostess@latest
```

## Examples

```bash
hostess --version
hostess --help
```

## Key Features
- hosts\n- network\n- system
