---
name: clawteam.system.setup
description: Agent workflow to detect missing ClawTeam dependencies and run automated system setup.
tags: clawteam,setup,installation,agents
---

# ClawTeam System Setup

Use this workflow if you encounter a "missing dependency" error when trying to use ClawTeam commands.

## 1) Detect Missing Dependency

If a command fails with:
> "Missing dependency 'clawteam-gateway'. Please install ClawTeam Gateway..."

You should proceed to automated setup.

## 2) Run Automated Setup

Execute the following command to clone the repository, install dependencies, and create the necessary binary shims:

```bash
supercli clawteam system setup --json
```

## 3) Verify Installation

Check if the gateway binary is now accessible and the system is healthy:

```bash
# Verify binary
clawteam-gateway --version

# Check full system status (including Docker services)
supercli clawteam system status --json
```

## 4) Start Services

If everything is installed but services are not running:

```bash
supercli clawteam system start --json
```
