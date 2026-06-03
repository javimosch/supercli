---
name: go-andotp
description: Use this skill when the user wants to encrypt or decrypt andOTP two-factor authentication backup files.
---

# go-andotp Plugin

CLI tool for encrypting and decrypting andOTP backup files containing TOTP/HOTP secrets.

## Commands

### Backup Operations
- `go-andotp backup decrypt` — Decrypt andOTP backup files

## Usage Examples
- "Decrypt this andOTP backup"
- "Encrypt my TOTP secrets"
- "Convert andOTP backup to JSON"

## Installation

```bash
go install github.com/nicm/go-andotp@latest
```

## Examples

```bash
go-andotp decrypt andotp-backup.encrypted
go-andotp encrypt andotp-backup.json
go-andotp verify andotp-backup.encrypted
```

## Key Features
- andOTP format compatibility
- Password-based encryption/decryption
- JSON output format
- Backup verification
- Cross-platform Go binary
