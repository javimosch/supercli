---
name: systemd-tty-ask-password-agent
description: Use this skill when the user wants to use systemd-tty-ask-password-agent, cli tool: systemd-tty-ask-password-agent.
---

# systemd-tty-ask-password-agent Plugin

CLI tool: systemd-tty-ask-password-agent.

## Commands
- `systemd-tty-ask-password-agent <resource> <action>` — Execute systemd-tty-ask-password-agent commands
- `systemd-tty-ask-password-agent self version` — Print systemd-tty-ask-password-agent version
- `systemd-tty-ask-password-agent _ _` — Passthrough to systemd-tty-ask-password-agent CLI

## Usage Examples
- "systemd-tty-ask-password-agent --help"
- "systemd-tty-ask-password-agent self version"

## Installation
```bash
apt-get install systemd-tty-ask-password-agent 2>/dev/null || which systemd-tty-ask-password-agent
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
