---
name: sshx
description: Use this skill when the user wants to share a live terminal session with someone via a browser link for pair debugging, teaching, or CI rescue.
---

# sshx Plugin

sshx shares your terminal as a multiplayer infinite canvas over a single browser link — real-time cursors, multiple resizable windows, chat, end-to-end encryption. By Eric Zhang, server written in Rust.

## Commands

- `sshx session start` — Start a shared session; prints `https://sshx.io/s/...` join link (blocks while session lives)
- `sshx _ _` — Passthrough to sshx CLI (`--name`, `--server`, `--shell`, `--quiet`, ...)

## Usage Examples

- "Open a shared terminal so my teammate can watch this deploy"
- "Start a collaborative shell I can paste into Slack"
- "Set up an sshx session to debug a failing CI job"

## Installation

```bash
curl -sSf https://sshx.io/get | sh
# or: cargo install sshx
# or: brew install sshx
```

## Examples

```bash
# One-shot install + run (works in CI without installing first)
curl -sSf https://sshx.io/get | sh -s run

# Named session
sshx --name "javi-debugging"

# Custom server / self-hosted relay
sshx --server https://sshx.example.com
```

## Key Features

- One command → one link; the other side needs only a browser
- E2E encrypted — the relay server cannot read keystrokes
- Multiplayer: live cursors, infinite canvas, per-user names, chat
- Predictive echo (à la Mosh) keeps typing snappy on laggy links
- CI pattern: `curl -sSf https://sshx.io/get | sh -s run` drops a live shell inside a GitHub Actions runner
