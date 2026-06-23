---
name: delve
description: Use this skill when the user wants to debug Go programs, set breakpoints, inspect variables, step through code, or debug Go tests.
---

# delve Plugin

Debugger for the Go programming language (binary: dlv).

## Commands

### Debug
- `delve debug run` — Compile and debug a Go program
- `delve exec run` — Debug a precompiled Go binary
- `delve test run` — Debug Go tests
- `delve connect run` — Connect to a headless debugger server
- `delve dap run` — Start a DAP server

## Usage Examples
- "Debug this Go program"
- "Debug the Go binary"
- "Run tests with delve"
- "Start a headless debug server"

## Installation

```bash
go install github.com/go-delve/delve/cmd/dlv@latest
```

## Examples

```bash
# Debug current package
dlv debug

# Debug with arguments
dlv debug -- --arg1 value

# Debug a compiled binary
dlv exec ./myapp

# Debug tests
dlv test

# Headless server mode
dlv debug --headless --listen=:2345 --log

# Connect to headless server
dlv connect localhost:2345

# Start DAP server
dlv dap
```
