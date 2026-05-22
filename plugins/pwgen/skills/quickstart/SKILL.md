---
name: pwgen
description: Use this skill when the user wants to generate secure passwords with custom length, character sets, and patterns — for accounts, keys, or bulk provisioning.
---

# pwgen Plugin

pwgen generates secure and/or memorable passwords with customizable length, character sets, and generation modes.

## Commands

- `pwgen _ _ <args>` — Passthrough

## Usage Examples

- "generate a 16 character secure password"
- "generate 5 memorable passwords"
- "generate a password with symbols and numbers"
- "generate 100 passwords for batch user creation"

## Installation

```bash
brew install pwgen
```

## Key Features
- Phonetic password generation for pronounceable passwords
- Secure random password generation
- Customizable length (default 8 characters)
- Symbol, number, and capital letter inclusion
- Ambiguous character removal (1/l, 0/O)
- Batch generation mode
- SHA1-based password generation from seed
