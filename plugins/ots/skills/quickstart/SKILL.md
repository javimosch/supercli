---
name: ots
description: Use this skill when the user wants to securely share secrets, create one-time URLs for sensitive data, or encrypt and share passwords securely.
---

# ots Plugin

Share end-to-end encrypted secrets with others via a one-time URL. Securely share sensitive information that can only be viewed once.

## Commands

### Secret Sharing
- `ots secret share` — Create a one-time secret

### Utility
- `ots _ _` — Passthrough to ots CLI

## Usage Examples
- "Share a secret"
- "Create one-time URL"
- "Encrypt and share"
- "Secure password sharing"

## Installation

```bash
brew install ots
```

Or via Go:
```bash
go install github.com/sniptt-official/ots@latest
```

## Examples

```bash
# Share a secret
ots secret share "my-secret-api-key"

# With password
ots secret share "my-secret-api-key" --password mypassphrase

# With expiration
ots secret share "my-secret-api-key" --expires 24h

# Any ots command with passthrough
ots _ _ new "my-secret"
ots _ _ --help
```

## Key Features
- **E2E** - End-to-end encryption
- **One-time** - Single view only
- **AES-256** - AES-256-GCM
- **URL** - Share via URL
- **Password** - Password protection
- **Expiration** - Configurable expiry
- **Secure** - Secure by design
- **Simple** - Easy to use
- **Cross-platform** - Linux, macOS, Windows
- **Open source** - Open source

## Notes
- Secret deleted after viewing
- Uses strong encryption
- Great for sharing credentials
- URL can be shared via any channel
