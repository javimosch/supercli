---
name: wormhole-william
description: Use this skill when the user wants to securely transfer files between computers, share files with end-to-end encryption, or use Magic Wormhole from the command line.
---

# wormhole-william Plugin

End-to-end encrypted file transfer between computers. A Go implementation of Magic Wormhole for secure, easy file sharing without setup.

## Commands

### File Transfer
- `wormhole-william file send` — Send file with Magic Wormhole
- `wormhole-william file receive` — Receive file with Magic Wormhole

### Utility
- `wormhole-william _ _` — Passthrough to wormhole-william CLI

## Usage Examples
- "Send file securely"
- "Transfer file with code"
- "Receive encrypted file"
- "Magic wormhole transfer"

## Installation

```bash
brew install psanford/tap/wormhole-william
```

Or via Go:
```bash
go install github.com/psanford/wormhole-william/...@latest
```

## Examples

```bash
# Send a file
wormhole-william file send my-document.pdf

# Send a folder
wormhole-william file send ./my-project/

# Send with custom code length
wormhole-william file send photo.jpg --code-length 4

# Receive with code
wormhole-william file receive 7-guitarist-revenge

# Auto-accept file
wormhole-william file receive 7-guitarist-revenge --accept-file

# Any wormhole-william command with passthrough
wormhole-william _ _ send myfile.txt
wormhole-william _ _ receive my-code
```

## Key Features
- **Encrypted** - End-to-end encryption
- **No setup** - No server setup
- **Cross-network** - Works across networks
- **Codes** - Easy transfer codes
- **Files** - File transfer
- **Folders** - Folder transfer
- **Compatible** - Python compatible
- **Fast** - Fast transfer
- **Simple** - Simple CLI
- **Secure** - PAKE encryption

## Notes
- Compatible with Python wormhole
- No account or server needed
- Great for quick secure transfers
- Works behind firewalls
