---
name: lockenv
description: Use this skill when the user wants to manage encrypted .env files, protect secrets in git repositories, or work with password-based secret vaults.
---

# Lockenv Plugin

Simple, password-based encrypted vault for .env and infrastructure secrets. Like git-crypt or sops, but dramatically simpler.

## Commands

### Vault Management
- `lockenv vault init` — Initialize a new encrypted vault (.lockenv)
- `lockenv vault status` — Show vault status and statistics
- `lockenv vault ls` — List files in the vault
- `lockenv vault diff` — Show content differences between vault and local files
- `lockenv vault rotate` — Change the vault password (re-encrypts all files)

### File Operations
- `lockenv vault lock <files>` — Encrypt and store files in the vault
- `lockenv vault unlock [files]` — Decrypt and restore files from the vault

### Keyring
- `lockenv keyring manage [subcommand]` — Manage password storage in OS keyring (save/status/delete)

## Usage Examples

Initialize a new vault:
```
lockenv vault init
```

Lock your .env file (encrypt and store):
```
lockenv vault lock .env
lockenv vault lock .env --remove  # Also delete the original
lockenv lock "config/*.env"        # Glob patterns work
```

Unlock all files or specific ones:
```
lockenv vault unlock
lockenv vault unlock .env
```

Handle conflicts when files differ between vault and local:
```
lockenv vault unlock --force        # Overwrite local with vault
lockenv vault unlock --keep-local    # Keep local versions
lockenv vault unlock --keep-both    # Keep both (vault saved as .from-vault)
```

Change vault password:
```
lockenv vault rotate
```

Save password to OS keyring for no-password daily use:
```
lockenv keyring manage save
lockenv keyring manage status
lockenv keyring manage delete
```

## Installation

```bash
brew install illarion/tap/lockenv
```

## Examples

```bash
# Full workflow for new project
lockenv vault init
lockenv vault lock .env config/secrets.json
git add .lockenv && git commit -m "Add encrypted secrets"

# Clone and unlock on another machine
git clone <repo>
cd <repo>
lockenv vault unlock

# Update secrets
echo "NEW_SECRET=value" >> .env
lockenv vault lock .env
git add .lockenv && git commit -m "Update secrets"
```

## Key Features
- AES-256-GCM encryption with PBKDF2 key derivation
- Single `.lockenv` file safe to commit to git
- Password not stored - remember it or use OS keyring
- Supports glob patterns for batch operations
- Smart conflict resolution on unlock
- CI/CD friendly via LOCKENV_PASSWORD env var