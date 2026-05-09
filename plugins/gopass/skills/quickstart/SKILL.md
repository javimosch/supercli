---
name: gopass
description: Use this skill when the user wants to store, retrieve, or manage credentials and secrets — API keys, passwords, tokens, certificates — using an encrypted password store versioned with git.
---

# gopass Plugin

The slightly more awesome standard UNIX password manager for teams. Encrypted with GPG, versioned with git.

## Prerequisites

Requires GPG key setup:

```bash
gopass init  # creates local store with your GPG key
```

## Commands

### Secrets
- `gopass secret show api/github/token` — Show a secret
- `gopass secret create api/stripe/key` — Create a new secret
- `gopass secret generate api/aws/secret 32` — Generate a random password
- `gopass secret delete api/old/key` — Delete a secret

### Listing
- `gopass secrets list` — List all secrets (tree view)
- `gopass secrets list --flat` — Flat list (one per line)

### Store
- `gopass store status` — Show store configuration and status

### Git
- `gopass git sync` — Sync with remote git repository

### Full Access
- `gopass _ _` — Passthrough for any gopass command (fsck, git, mounts, audit, etc.)

## Usage Examples
- "Show me the GitHub API token"
- "Store a new Stripe secret key"
- "Generate a 32-character password for my database"
- "List all stored credentials"
- "Sync my password store with the remote"

## Installation

```bash
brew install gopass
gopass init
```

## Key Features
- **Encrypted**: All secrets encrypted with GPG (or age)
- **Versioned**: Git-backed — full history of changes
- **Team-ready**: Share secrets via shared git repos
- **Password generation**: Built-in random password generator
- **Offline-capable**: No network required for local access
- **Go binary**: Single file, no heavy runtime deps
