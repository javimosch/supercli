---
name: ghtkn
description: Use this skill when the user wants to generate secure short-lived GitHub tokens, set up Git credential helpers, or manage GitHub App authentication for local development.
---

# Ghtkn Plugin

Generate short-lived (8-hour) GitHub App User Access Tokens for secure local development.

## What is ghtkn?

ghtkn (GH-Token) generates secure 8-hour User Access Tokens from GitHub Apps using Device Flow. Stop risking token leaks with long-lived Personal Access Tokens.

## Quick Start

```bash
# Initialize configuration
sc ghtkn init config

# Generate a token (opens browser for Device Flow)
sc ghtkn get token

# Use token with GitHub CLI
env GH_TOKEN=$(ghtkn get) gh issue create --title "Test"

# Use as Git credential helper
git config --global credential.helper '!ghtkn git-credential'
```

## Key Features

- **Short-lived tokens** - Only 8 hours validity
- **No secrets required** - Only Client ID (not secret)
- **User-attributed actions** - Operations performed as you, not as app
- **Automatic token management** - OS keyring integration
- **Multiple GitHub Apps** - Switch apps by repository or directory

## Key Commands

### Configuration
- `sc ghtkn init config` - Create configuration file
- `sc ghtkn list apps` - List configured GitHub Apps

### Token Management
- `sc ghtkn get token` - Generate/retrieve access token
- `sc ghtkn get token --app myapp` - Use specific GitHub App

### Git Integration
- `sc ghtkn git-credential helper` - Use as Git credential helper

## Setup

1. Create GitHub App with Device Flow enabled
2. Run `ghtkn init config` to create config file
3. Add Client ID to config: `apps: - name: myapp client_id: xxx`
4. Run `ghtkn get token` and authorize in browser

## Configuration File

Location: `~/.config/ghtkn/ghtkn.yaml` (Linux/macOS) or `%APPDATA%\ghtkn\ghtkn.yaml` (Windows)

```yaml
apps:
  - name: myapp
    client_id: xxx
    git_owner: username  # Optional: switch by repository owner
```

## Use Cases

- Secure local development with short-lived tokens
- Git authentication without long-lived PATs
- Multiple GitHub Apps for different organizations
- Automatic token rotation and management
- Directory-based app switching with direnv