---
name: croc
description: Use this skill when the user wants to transfer files securely between computers, send files over the internet, or share data with end-to-end encryption.
---

# croc Plugin

Easily and securely send things from one computer to another. A simple cross-platform file transfer tool with end-to-end encryption and relay support.

## Commands

### File Transfer
- `croc file send` — Send files or folders securely
- `croc file receive` — Receive files or folders securely

### Utility
- `croc _ _` — Passthrough to croc CLI

## Usage Examples
- "Send a file securely"
- "Transfer files between computers"
- "Receive files with code"
- "Secure file sharing"

## Installation

```bash
brew install croc
```

Or via Go:
```bash
go install github.com/schollz/croc/v9@latest
```

## Examples

```bash
# Send a file
croc file send my-document.pdf

# Send a folder
croc file send ./my-project/

# Send with custom code
croc file send photo.jpg --code my-secret-code

# Send text
croc file send --text "Hello, secure world!"

# Receive files
croc file receive 1234-5678-9012

# Receive to specific directory
croc file receive 1234-5678-9012 --out ~/Downloads/

# Any croc command with passthrough
croc _ _ send myfile.txt
croc _ _ receive my-code
```

## Key Features
- **Secure** - End-to-end encryption
- **Cross-platform** - Works on any OS
- **Relay** - Automatic relay server
- **No server** - No server setup needed
- **Resume** - Resumable transfers
- **Multiple** - Multiple files
- **Folders** - Folder transfer
- **Text** - Send text directly
- **Local** - Local network mode
- **Simple** - Simple CLI

## Notes
- Uses PAKE encryption
- No server configuration
- Works behind firewalls
- Great for quick file sharing
