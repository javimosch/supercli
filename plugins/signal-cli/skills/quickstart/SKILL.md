---
name: signal-cli
description: Use this skill when the user wants to send or receive encrypted Signal messages, manage Signal groups and contacts, check user registration status, or interact with the Signal messenger from the command line.
---

# Signal CLI Plugin

Unofficial command-line interface for the Signal messenger. Send/receive encrypted messages, manage groups, list contacts, and more.

## Prerequisites

Requires a phone number for registration. First-time setup:

```bash
# Register
signal-cli -a +15551234567 register

# Verify (code received via SMS)
signal-cli -a +15551234567 verify 123456
```

## Commands

### Version
- `signal self version` — Print signal-cli version

### Messaging
- `signal message send -a +ACCOUNT -m "message" RECIPIENT` — Send an encrypted message
- `signal message send -a +ACCOUNT --message-from-stdin RECIPIENT` — Send message from stdin
- `signal message send -a +ACCOUNT -m "hello" --note-to-self` — Send message to self
- `signal message receive -a +ACCOUNT` — Receive pending messages (JSON)

### Account
- `signal account register -a +PHONE` — Register a phone number
- `signal account verify -a +PHONE CODE` — Verify with code
- `signal account status -a +ACCOUNT RECIPIENT` — Check if user is registered
- `signal account list` — List all local accounts

### Groups & Contacts
- `signal groups list -a +ACCOUNT` — List groups with members
- `signal contacts list -a +ACCOUNT` — List contacts

### Full Access
- `signal _ _` — Passthrough for any signal-cli command (daemon, updateProfile, block, etc.)

## Usage Examples
- "Send a Signal message to +15559876543"
- "Check if a phone number is registered on Signal"
- "List all my Signal groups"
- "Receive pending Signal messages"
- "List my Signal contacts"

## Installation

```bash
# Download latest release
VERSION=$(curl -Ls -o /dev/null -w %{url_effective} https://github.com/AsamK/signal-cli/releases/latest | sed -e 's/^.*\\/v//')
curl -LO https://github.com/AsamK/signal-cli/releases/download/v${VERSION}/signal-cli-${VERSION}.tar.gz

# Extract and install
sudo tar xf signal-cli-*.tar.gz -C /opt
sudo ln -sf /opt/signal-cli-*/bin/signal-cli /usr/local/bin/signal-cli
```

Or use the GraalVM native build (no JVM required):
```bash
curl -LO https://github.com/AsamK/signal-cli/releases/download/v${VERSION}/signal-cli-${VERSION}-Linux-native.tar.gz
```

## Key Features
- **End-to-end encrypted messaging**: Send/receive via Signal's protocol
- **JSON output**: All commands support `--output json` for agent consumption
- **Group management**: List groups, join, quit, update
- **Contact management**: List contacts with profiles
- **Daemon mode**: JSON-RPC interface over TCP, HTTP, or UNIX socket
- **Attachment support**: Send files as attachments
- **Cross-platform**: Linux, macOS, Windows (JVM or native binary)
