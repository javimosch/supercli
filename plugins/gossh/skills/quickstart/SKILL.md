---
name: gossh
description: Use this skill when the user wants to high-performance and high-concurrency ssh tool written in go.
---

# Gossh Plugin

High-performance and high-concurrency SSH tool written in Go.

## Commands

### Operations
- `gossh command run` — run command via gossh
- `gossh script exec` — exec script via gossh
- `gossh file push` — push file via gossh
- `gossh file fetch` — fetch file via gossh
- `gossh config show` — show config via gossh
- `gossh group list` — list group via gossh

## Usage Examples
- "gossh --help"
- "gossh <args>"

## Installation

```bash
go install github.com/windvalley/gossh@latest
```

## Examples

```bash
gossh --version
gossh --help
```

## Key Features
- ssh\n- automation\n- remote
