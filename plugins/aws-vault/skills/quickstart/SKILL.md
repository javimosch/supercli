---
name: aws-vault
description: Use this skill when the user wants to securely manage AWS credentials, execute commands with AWS profiles, or store credentials in OS-native keystores.
---

# aws-vault Plugin

A tool for securely storing and accessing AWS credentials in development environments. Uses OS-native secure keystore to protect credentials.

## Commands

### Credential Execution
- `aws-vault cred exec` — Execute command with AWS credentials

### Utility
- `aws-vault _ _` — Passthrough to aws-vault CLI

## Usage Examples
- "Execute with AWS credentials"
- "Secure AWS credential storage"
- "AWS profile management"
- "Run command with AWS profile"

## Installation

```bash
brew install aws-vault
```

## Examples

```bash
# Execute with profile
aws-vault cred exec myprofile -- aws s3 ls

# Set session duration
aws-vault cred exec myprofile --duration 1h -- aws s3 ls

# Without session token
aws-vault cred exec myprofile --no-session -- aws s3 ls

# Any aws-vault command with passthrough
aws-vault _ _ exec myprofile -- aws s3 ls
aws-vault _ _ list
aws-vault _ _ add myprofile
```

## Key Features
- **Secure** - OS-native keystore
- **Profiles** - Multiple AWS profiles
- **Sessions** - Temporary sessions
- **MFA** - MFA support
- **Keychain** - macOS Keychain
- **Windows** - Credential Manager
- **Linux** - Secret Service
- **Safe** - No plaintext secrets
- **Dev** - Development friendly
- **Cloud** - AWS focused

## Notes
- Great for AWS development
- No plaintext credentials
- Supports MFA
- Perfect for team security
