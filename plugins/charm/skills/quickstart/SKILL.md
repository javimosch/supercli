---
name: charm
description: Use this skill when the user wants to upload data to Charm Cloud, download from Charm Cloud, encrypt/decrypt data, or identify terminal capabilities.
---

# charm Plugin

Charm CLI -- the official Charm client for Charm Cloud. Upload, download, encrypt, and manage data from the terminal.

## Commands

### Cloud Data
- `charm data upload` — Pipe data to Charm Cloud (charm pump)
- `charm data download` — Download data from Charm Cloud

### Terminal
- `charm terminal identify` — Show terminal identification info

### Crypto
- `charm crypto encrypt` — Encrypt data using Charm keys
- `charm crypto decrypt` — Decrypt data using Charm keys

### Utility
- `charm self version` — Print charm version
- `charm _ _` — Passthrough to charm CLI

## Usage Examples
- "Upload this file to Charm Cloud"
- "Download data from my Charm link"
- "Show terminal identification"
- "Encrypt this data"
- "What version of charm is installed?"

## Installation

```bash
brew install charm
```

Or via the install script:
```bash
curl -sSL https://raw.githubusercontent.com/charmbracelet/charm/main/install.sh | bash
```

## Examples

```bash
# Print charm version
charm self version

# Upload data to Charm Cloud
echo "hello world" | charm data upload

# Upload a file
cat data.json | charm data upload

# Download from Charm Cloud
charm data download https://downloads.charm.sh/abc123

# Show terminal identification
charm terminal identify

# Encrypt data
echo "secret" | charm crypto encrypt

# Decrypt data
cat encrypted.bin | charm crypto decrypt

# Any charm command with passthrough
charm _ _ --help
charm _ _ config
```

## Key Features
- **Charm Cloud** — Free encrypted storage for terminal data
- **Encryption** — End-to-end encryption with your Charm keys
- **Terminal ID** — Identify terminal capabilities and features
- **Pipe-friendly** — Works with stdin/stdout pipelines
- **Integration** — Works with other Charm tools (Gum, Wish, Soft Serve)

## Notes
- Requires a Charm Cloud account (create with `charm create`)
- Data is encrypted end-to-end
- Supports piping for streaming uploads/downloads
- Configuration stored in ~/.config/charm/
