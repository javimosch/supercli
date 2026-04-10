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

## supercli skills

Skill documents provide agent-facing guidance in SKILL.md format. Use `supercli skills` to discover and fetch skill documentation.

```bash
# List all available skills (command-level + catalog)
supercli skills list

# Get skill documentation for a specific capability
supercli skills get <namespace.resource.action>

# Get the skills usage guide (teaches how to use the skills system)
supercli skills teach

# Search skills catalog for matching skills
supercli skills search --query <text>

# Sync skills catalog from providers
supercli skills sync

# Manage skill providers
supercli skills providers list
supercli skills providers add --name <provider> --roots <path>
supercli skills providers remove --name <provider>
```

## supercli plugins

Plugins extend supercli with additional command capabilities.

```bash
# Explore available plugins in the registry
supercli plugins explore

# Learn about a specific plugin
supercli plugins learn <plugin-name>

# Install a plugin from registry
supercli plugins install <plugin-name>

# Install a plugin from git repository
supercli plugins install --git <repo-url> --manifest-path <path>

# List installed plugins
supercli plugins list

# Show plugin details
supercli plugins show <plugin-name>

# Check plugin health
supercli plugins doctor <plugin-name>
```

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
