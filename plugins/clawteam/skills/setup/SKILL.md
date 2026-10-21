---
name: clawteam.system.setup
description: Agent workflow to detect missing ClawTeam dependencies and run automated system setup.
tags: clawteam,setup,installation,agents
---

# ClawTeam System Setup

Use this workflow if you encounter a "missing dependency" error when trying to use ClawTeam commands.

## Commands
- `clawteam <resource> <action>` — Execute clawteam commands
- `clawteam system setup` — Automated installation of ClawTeam platform (Gateway, API, DB, Redis). Suitable for AI agents.
- `clawteam system start` — Start all ClawTeam services (Docker + Gateway)
- `clawteam system stop` — Stop all ClawTeam services
- `clawteam system status` — Check full health of ClawTeam platform (Docker + Gateway)
- `clawteam gateway status` — Show local ClawTeam gateway process status
- `clawteam agents list` — List shared agents and active sessions in the network
- `clawteam task delegate` — Delegate a task to an expert agent in the ClawTeam network

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
