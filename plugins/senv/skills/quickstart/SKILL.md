---
name: senv
description: Use this skill when the user wants to encrypt or decrypt .env files containing sensitive environment variables.
---

# senv Plugin

Encrypt and decrypt .env files to protect sensitive environment variables.

## Commands

### Env Encryption
- `senv env encrypt` — Encrypt .env files to protect sensitive values

## Usage Examples
- "Encrypt this .env file"
- "Decrypt my environment variables"
- "Secure my dotenv file for version control"

## Installation

```bash
npm install -g senv
```

## Examples

```bash
senv encrypt .env
senv decrypt .env.enc
senv encrypt .env --output .env.enc
senv decrypt .env.enc --output .env
```

## Key Features
- .env file encryption/decryption
- Key-based protection
- Safe for version control
- Node.js ecosystem compatible
- Simple CLI interface
