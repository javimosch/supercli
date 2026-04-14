---
name: rage
description: Use this skill when the user wants to encrypt or decrypt files using the age encryption format, generate key pairs, or work with SSH keys for file encryption.
---

# Rage Plugin

A simple, secure and modern file encryption tool using the age format.

## Commands

### Key Generation
- `rage keygen generate` — Generate a new age key pair

### Encryption
- `rage encrypt file` — Encrypt a file to recipients

### Decryption
- `rage decrypt file` — Decrypt using identity file or SSH key

## Usage Examples

Generate a key pair:
```
rage-keygen
```

Encrypt with a recipient:
```
rage -r age1pymw5hyr39qyuc950tget63aq8vfd52dclj8x7xhm08g6ad86dkserumnz -o file.age file.txt
```

Encrypt with passphrase:
```
rage -p -o file.age file.txt
```

Encrypt to multiple recipients:
```
rage -r age1... -r age1... -o file.age file.txt
```

Encrypt using SSH key:
```
rage -R ~/.ssh/id_ed25519.pub file.png > file.png.age
```

Decrypt with identity file:
```
rage -d -i ~/.ssh/id_ed25519 file.age > file.txt
```

Decrypt with passphrase:
```
rage -d file.age > file.txt
```

## Installation

```bash
cargo install rage
```

Or via package manager:
```bash
brew install rage        # macOS/Linux
apk add rage             # Alpine
pacman -S rage-encryption # Arch
```

## Key Features
- Simple age encryption format
- Small explicit keys (no config files)
- SSH key support (ed25519, rsa)
- Passphrase encryption
- Multiple recipients
- UNIX-style composability
- Hardware token support (YubiKey via age-plugin-yubikey)
- Cross-platform (macOS, Linux, Windows, FreeBSD)