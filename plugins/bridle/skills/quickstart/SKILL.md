---
name: bridle
description: Use this skill when the user wants to manage configuration profiles for AI agent harnesses, install/uninstall harnesses, diff profiles, or query config values.
---

# bridle Plugin

TUI/CLI config manager for agentic harnesses (Amp, Claude Code, Opencode, Goose, Copilot CLI, Crush, Droid). Manage profiles, diffs, installs, and settings with structured JSON output on all commands.

## Commands

### Profiles
- `bridle profile list` — List profiles for a harness
- `bridle profile show` — Show a specific profile
- `bridle profile diff` — Diff two profiles

### Configuration
- `bridle config get` — Get a configuration value
- `bridle config set` — Set a configuration value

### Packages
- `bridle package install` — Install a harness from a source
- `bridle package uninstall` — Uninstall a harness profile

### Utility
- `bridle self version` — Print bridle version
- `bridle self status` — Show bridle status
- `bridle _ _` — Passthrough to bridle CLI

## Usage Examples
- "List all Claude Code profiles"
- "Show my default Goose profile"
- "Diff two Opencode profiles"
- "Set the default editor to vim"
- "Install a new harness from GitHub"
- "Uninstall a harness profile"

## Installation

```bash
brew install neiii/bridle/bridle
```

## Examples

```bash
# List profiles for Claude Code
bridle profile list claude

# Show a specific profile
bridle profile show claude default

# Show as JSON
bridle profile show claude default -o json

# Diff two profiles
bridle profile diff claude default other

# Get a config value
bridle config get editor

# Set a config value
bridle config set editor vim

# Install a harness from GitHub
bridle package install owner/repo

# Force reinstall
bridle package install owner/repo --force

# Uninstall a profile
bridle package uninstall claude old-profile

# Show status as JSON
bridle self status -o json
```

## Key Features
- Profile management for multiple AI agent harnesses
- Profile diff and comparison
- One-command harness installation from GitHub
- JSON, text, and auto output formats on all commands
- Configurable editor, default harness, and UI preferences
- No-install quick run via npx/bunx/pnpm dlx

## Supported Harnesses
- Amp
- Claude Code
- Opencode
- Goose
- Copilot CLI
- Crush
- Droid

## Output Formats

All commands support `-o, --output <format>`:

- **text** — Human-readable (default in TTY)
- **json** — Machine-readable structured output
- **auto** — Text for TTY, JSON for pipes
