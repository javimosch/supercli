---
name: nanvault
description: Use this skill when the user wants to encrypt or decrypt files using Ansible vault format (Crystal implementation).
---

# nanvault Plugin

Ansible vault compatible encrypt/decrypt tool written in Crystal. A fast, single-binary alternative to Python/Ansible.

## Commands

### Vault Operations
- `nanvault vault encrypt` — Encrypt files using Ansible vault format

## Usage Examples
- "Encrypt this file with Ansible vault"
- "Decrypt this vault file"
- "View encrypted vault contents"

## Installation

```bash
brew install nanvault
```

## Examples

```bash
nanvault encrypt secrets.yml
nanvault decrypt secrets.yml
nanvault view secrets.yml
nanvault encrypt --password "mypassword" secrets.yml
```

## Key Features
- Ansible vault format compatibility
- Crystal binary (no Python dependency)
- Encrypt, decrypt, and view operations
- Password-based encryption
- Fast compilation and execution
