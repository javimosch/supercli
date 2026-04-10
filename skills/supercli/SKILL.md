---
skill_name: supercli.quickstart
description: SuperCLI capability router — discover and execute CLI commands through namespace.resource.action interface
tags: supercli,cli,plugin,capability,discovery,agent
---

# SuperCLI Quickstart

SuperCLI is a deterministic capability router that wraps external CLIs behind a unified namespace.resource.action interface.

## Key Concept

Instead of running raw commands, use:
```
supercli <namespace> <resource> <action> [--flags]
```

## Before Running Raw Commands

When you need to perform a task, ALWAYS check supercli first:

```bash
# 1. Discover capabilities for a task
supercli discover --intent "send email"

# 2. Learn about a plugin
supercli plugins learn <plugin-name>

# 3. Inspect a specific command
supercli inspect <namespace> <resource> <action>

# 4. Plan before executing
supercli plan <namespace> <resource> <action> [--flags]

# 5. Execute
supercli <namespace> <resource> <action> [--flags]
```

## Workflow

1. **discover**: Find plugins/commands for an intent
2. **learn**: Read usage documentation
3. **inspect**: View command schema and flags
4. **plan**: Preview execution steps
5. **execute**: Run the command

## Important Flags

| Flag | Purpose |
|------|---------|
| `--json` | Machine-readable output |
| `--human` | Formatted output for humans |
| `--non-interactive` | Fail fast (for agents) |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 82 | Validation error (missing args) |
| 85 | Invalid argument |
| 92 | Resource not found |
| 105 | Integration error |
| 110 | Internal error |
