---
name: netcat
description: Use this skill when the user wants to debug network connections, scan ports, transfer files, or interact with TCP/UDP services from the command line.
---

# Netcat Plugin

Netcat (nc) reads and writes data across network connections using TCP or UDP. A swiss-army knife for network debugging.

## Commands

- `netcat _ _ <args>` — Passthrough

## Usage Examples

- "check if port 80 is open on example.com"
- "send an HTTP request to a web server"
- "listen for incoming connections on port 4444"
- "transfer a file between two machines"

## Installation

```bash
brew install netcat
```

## Key Features
- TCP and UDP client/server mode
- Port scanning with range support
- File transfer over network
- Banner grabbing from services
- Relay/proxy connections via -e
- DNS resolution and reverse lookups
- Verbose debugging output
- Timeout control for network operations
