---
name: keyshade
description: Use this skill when the user wants to manage secrets and environment variables
---

# Keyshade Plugin

manage secrets and environment variables

## Commands
- `keyshade self version` — Print keyshade version
- `keyshade _ _` — Passthrough to keyshade CLI

## Usage Examples
- "Add a secret to the project"
- "Rotate API keys"
- "List all secrets"

## Installation

```bash
npm install -g keyshade
```

## Examples
```bash
keyshade secret add --name API_KEY --value "secret123"
keyshade secret list
keyshade rotate --name API_KEY
```

## Key Features
- Secret management
- Environment variable handling
- Key rotation
- Project-based organization
