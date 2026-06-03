---
name: gwvault
description: Use this skill when the user wants to encrypt or decrypt files using Ansible vault format without Ansible installed.
---

# gwvault Plugin

Ansible vault compatible encrypt/decrypt tool written in Go. Manage encrypted secrets without requiring Python or Ansible.

## Commands

### Vault Operations
- `gwvault vault encrypt` — Encrypt files using Ansible vault format

## Usage Examples
- "Encrypt this secrets file with Ansible vault"
- "Decrypt this vault-encrypted file"
- "View the contents of an Ansible vault"

## Installation

```bash
go install github.com/nicm/gwvault@latest
```

## Examples

```bash
gwvault encrypt secrets.yml
gwvault decrypt secrets.yml -o decrypted.yml
gwvault view secrets.yml
gwvault encrypt --vault-password-file .pass secrets.yml
```

## Key Features
- Ansible vault format compatibility
- Go binary (no Python dependency)
- Encrypt, decrypt, and view operations
- Vault password file support
- Cross-platform support
