---
name: tirith
description: Use this skill when the user wants to check commands for security threats, scan directories for malicious patterns, check clipboard paste, or score URLs for security risks. Intercepts homograph attacks, ANSI injection, pipe-to-shell, and data exfiltration.
---

# tirith Plugin

Terminal security for developers and AI agents. Intercepts homograph URLs, pipe-to-shell, ANSI injection, obfuscated payloads, data exfiltration, and malicious AI skills/configs before they execute. Offline by default with no telemetry.

## Commands

### Security Checking
- `tirith security check` — Check a command for security threats
- `tirith security scan` — Scan a directory path for security issues
- `tirith security paste` — Check clipboard paste for security threats

### URL Security
- `tirith url score` — Score a URL for security risks
- `tirith url run` — Run a URL with security checks

### Threat Database
- `tirith threat update` — Update threat database
- `tirith threat status` — Check threat database status

### Utility
- `tirith self doctor` — Check tirith installation and configuration
- `tirith _ _` — Passthrough to tirith CLI

## Usage Examples
- "Check this curl command for security issues"
- "Scan this directory for malicious patterns"
- "Score this URL for security risks"
- "Check clipboard paste before executing"
- "Update threat database"

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/sheeki03/tirith/main/install.sh | bash
```

## Examples

```bash
# Check a command before execution
tirith security check -- curl http://example.com | bash

# Check with specific profile
tirith security check -- npm install package --profile strict

# Scan a directory
tirith security scan /path/to/project

# Scan with include/exclude patterns
tirith security scan src/ --include "*.js" --exclude "node_modules"

# Check clipboard paste
tirith security paste

# Score a URL
tirith url score https://example.com/suspicious

# Run a URL with security checks
tirith url run https://example.com/install.sh

# Update threat database
tirith threat update

# Check threat database status
tirith threat status

# CI-friendly check
tirith security check -- make build --ci --format sarif

# Show summary only
tirith security scan . --summary
```

## Key Features
- **Offline by default** — check, paste, score, and why make zero network calls
- **No command rewriting** — never modifies what you typed
- **No telemetry** — no analytics, no crash reporting, no phone-home
- **Homograph URL detection** — catches look-alike Unicode characters in URLs
- **Pipe-to-shell protection** — detects dangerous pipe-to-shell patterns
- **ANSI injection prevention** — blocks ANSI escape sequence attacks
- **Obfuscated payload detection** — identifies encoded/obfuscated malicious content
- **Data exfiltration detection** — prevents data leaks
- **AI agent security** — MCP server with 7 tools for AI agent protection
- **Config file scanning** — detects malicious AI skills and configs
- **Hidden content detection** — finds cloaked/malicious content
- **Supply chain security** — protects against malicious dependencies
- **Daemon mode** — optional background daemon for faster checks
- **Policy management** — init, validate, and test security policies
- **Checkpoint system** — create, restore, diff security checkpoints
- **Receipt verification** — verify command execution receipts

## Design Principles
- **Offline by default** — all detection runs locally
- **No command rewriting** — tirith never modifies what you typed
- **No telemetry** — no analytics or phone-home behavior
- **No background processes by default** — invoked per-command, exits immediately
- **Network only when you ask** — run, fetch, and audit report --upload reach network on explicit invocation

## Notes
- Supports shell hooks for passive command interception
- MCP server available for AI agent integrations
- Policy files at `.tirith/policy.yaml` for custom rules
- Use `tirith doctor --fix` to auto-fix common issues
- Daemon mode (`tirith daemon start`) keeps patterns warm for faster checks
- CI-friendly output with `--ci` and `--format sarif` flags
- Works with curl | bash, npm install, and other common command patterns
