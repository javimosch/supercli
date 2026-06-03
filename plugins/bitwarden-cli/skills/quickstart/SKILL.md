---
name: bitwarden-cli
description: Use this skill when the user wants to manage passwords, credentials, and secrets with Bitwarden — log in, unlock vault, list/search items, get credentials, generate passwords, create/edit/delete items, or use Bitwarden Send.
---

# Bitwarden CLI Plugin

Official command-line password manager from Bitwarden. Binary name: `bw`.

## Commands

### Self
- `bitwarden self version` — Print bw version

### Vault
- `bitwarden vault login` — Log into a Bitwarden account
- `bitwarden vault unlock` — Unlock the vault
- `bitwarden vault status` — Get vault status
- `bitwarden vault sync` — Sync vault with server
- `bitwarden vault lock` — Lock the vault
- `bitwarden vault logout` — Log out
- `bitwarden config set` — Set config values (e.g., self-hosted server)

### Items
- `bitwarden item list` — List vault items (passwords, notes, cards, identities)
- `bitwarden item get` — Get item details by ID
- `bitwarden item create` — Create a new item from JSON
- `bitwarden item edit` — Edit an existing item
- `bitwarden item delete` — Delete an item

### Generate
- `bitwarden generate password` — Generate a strong password or passphrase

### Send
- `bitwarden send create` — Create a Bitwarden Send (text or file)

### Export
- `bitwarden export vault` — Export vault data to CSV or JSON

### Passthrough
- `bitwarden _ _` — Passthrough for any bw command

## Usage Examples
- "Log me into Bitwarden"
- "List all my passwords for example.com"
- "Get the password for my work email account"
- "Generate a 20-character password with special chars"
- "Create a new login item for github with username 'javi'"
- "Sync my vault with the server"
- "Export my vault to CSV"
- "Create a send with a text message"

## Installation

```bash
npm install -g @bitwarden/cli
# or
brew install bitwarden-cli
```

## Quick Start

```bash
# Login
bw login user@example.com

# Unlock vault (get session key)
bw unlock
# Set session key for scripting
export BW_SESSION="<session_key>"

# List items
bw list items --search github

# Get password for an item
bw get password <item-id>

# Generate password
bw generate --length 20 --uppercase --lowercase --number --special

# Check status
bw status
```

## Session Key

After `bw unlock`, the CLI outputs a session key. Set it as an environment variable for scripting:

```bash
export BW_SESSION="<session_key>"
```

Without `BW_SESSION`, most commands require interactive unlock.

## Key Features
- Cross-platform (Windows, macOS, Linux)
- Self-hosted server support
- Organization management
- Bitwarden Send (secure file/text sharing)
- TOTP code generation
- Vault export
- Encrypted vault sync across devices
- CLI-friendly JSON output
