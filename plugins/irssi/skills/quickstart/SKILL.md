---
name: irssi
description: Use this skill when the user wants a terminal IRC client — connect to channels, run scripts, or stay on IRC over SSH without a GUI.
---

# irssi Plugin

Modular terminal IRC client. Lightweight, scriptable with Perl, and ideal for persistent IRC sessions over SSH or on headless servers.

## Installation

```bash
apt install irssi
# or
brew install irssi
```

## Basic Usage

```bash
# Launch irssi (connects using ~/.irssi/config)
irssi

# Connect to a network and join a channel (inside irssi)
/connect irc.libera.chat
/join #supercli
```

## Key Features

- Multiple server windows and tabbed channels
- Perl scripting for automation and custom commands
- Works over SSH — no desktop environment required
- Persistent sessions with screen/tmux for always-on IRC

## Usage Examples

- "Connect to Libera Chat and join #myproject"
- "Run a terminal IRC client over SSH"
- "Set up a persistent IRC session with irssi"

## SuperCLI

```bash
sc irssi _ _
sc plugins learn irssi
```
