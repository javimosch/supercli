---
name: claw-wrap
description: Use this skill when the user wants to securely run CLI tools with credentials in sandboxed environments, without exposing secrets to the sandbox.
---

# claw-wrap Plugin

Secure credential proxy for CLI tools — credentials never enter the sandbox.

## Commands

### Daemon
- `claw-wrap daemon start` — Start the claw-wrap daemon

### Admin
- `claw-wrap tool list` — List configured tools
- `claw-wrap tool check` — Verify credentials

## Usage Examples
- "Set up gh CLI with secure credentials"
- "Run AWS CLI in sandbox without exposing keys"
- "Block dangerous commands like repo delete"

## Installation

```bash
brew install dedene/tap/claw-wrap
```

Or from source:
```bash
git clone https://github.com/dedene/claw-wrap.git
cd claw-wrap
make build
sudo make install
```

## Examples

```bash
# Store token in pass
pass insert cli/github/token

# Configure /etc/openclaw/wrappers.yaml
# tools:
#   gh:
#     binary: /usr/local/bin/gh
#     env:
#       GH_TOKEN: github-token

# Start daemon
claw-wrap daemon

# List tools
claw-wrap list
claw-wrap check
```

## Key Features
- CLI wrapper mode for CLI tools
- HTTP proxy mode for APIs
- Multiple credential backends (pass, 1Password, Vault, etc.)
- Block dangerous commands server-side
- Output redaction
- HMAC authentication
