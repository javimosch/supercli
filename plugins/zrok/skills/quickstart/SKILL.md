---
name: zrok
description: Use this skill when the user wants to expose a local service via a public URL, share files, or create secure tunnels with zrok.
---

# zrok Plugin

zrok is a zero-trust sharing platform on OpenZiti. `share public` gives a temporary public URL for any local target (HTTP service, folder, TCP port); `share private` creates peer-to-peer shares reachable only by token holders. No inbound firewall rules needed.

## Commands

### Sharing
- `zrok share public <target>` — Public URL for a local service or folder
- `zrok share private <target>` — Token-gated peer-to-peer share
- `zrok access private <token>` — Access someone's private share
- `zrok env status` — Environment/shares status
- `zrok _ _` — Passthrough (`zrok invite`, `zrok enable`, `zrok overview`, `zrok share reserved`, ...)

## Usage Examples

- "Give me a public URL for my local dev server on 3000"
- "Share this folder so a colleague can download the files"
- "Let me SSH to this box without opening the firewall"
- "Show my active zrok shares"

## Installation

```bash
curl -sSf https://get.openziti.io/install.bash | bash -s zrok
# then once: zrok invite  (account at https://zrok.io or self-hosted)
# then:      zrok enable <token>
```

## Examples

```bash
# Public URL for a local HTTP service
zrok share public http://localhost:8080

# Share a directory as a browsable/downloadable file set
zrok share public /path/to/files

# Private share — only peers who run `zrok access private <token>` can reach it
zrok share private localhost:22

# Reserved (stable) share name
zrok reserve public localhost:3000 --unique-name myapp

# Overview of environment + usage
zrok overview
```

## Key Features

- Public + private sharing modes; private shares are peer-to-peer over OpenZiti (end-to-end encrypted)
- Targets: HTTP services, folders (file sharing), TCP/UDP ports, Caddy drives
- `zrok reserve` for stable names across restarts
- Self-hostable; free hosted service at zrok.io
