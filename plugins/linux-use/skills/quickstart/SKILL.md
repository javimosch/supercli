---
name: linux-use
description: Use this skill when the user wants to drive a Linux GUI application — read the screen, click widgets, type text, automate a browser or desktop app via the AT-SPI2 accessibility tree, or read web-page DOM content fast via CDP.
---

# linux-use Plugin

Agent-first GUI control for Linux desktops: reads the AT-SPI2 accessibility
tree and acts on widgets by ref — no screenshots, no pixel coordinates.
Single 229 KB static binary, JSON on stdout, semantic exit codes.

## Commands

- `linux-use app list` — applications exposing accessibility
- `linux-use element state --app <name>` — interactive elements with refs
  (`--expand` sweeps below the fold; `--via cdp` = whole DOM in ~60ms on
  debug-port browsers; `--format lines` = compact)
- `linux-use element find <query> [--app X] [--expand]` — find a widget by name
- `linux-use element act <ref>` — invoke the accessible action (clicks)
- `linux-use element read|type <ref> [text]` — read / insert text
- `linux-use text paste <text>` — clipboard paste (safe typing into Chromium)
- `linux-use input key|click|pointer` — XTEST input
- `linux-use event watch [--app X] [--duration ms]` — NDJSON event stream
- `linux-use self doctor|guide|stats|version` — health, manual, metrics

## Usage examples

- "linux-use element state --app gnome-calculator"
- "linux-use element find 'Save' --app 'Microsoft Edge#pid123' --expand"
- "linux-use element act 'gnome-calculator:/0/1/0/1/0/0/1/0/22#18124260'"
- "linux-use element state --app 'Microsoft Edge#pid123' --via cdp --format lines"

## Installation

```bash
# binary from https://github.com/javimosch/linux-use/releases/latest
# or: git clone https://github.com/javimosch/linux-use && ./build.sh
gsettings set org.gnome.desktop.interface toolkit-accessibility true
linux-use doctor
```

## Key features

- Refs carry fingerprints — stale refs fail safely instead of clicking the wrong widget
- `cdp<pid>:<xpath>#fp` refs: real DOM click, works on occluded windows
- `--expand` uses the container's own scroll actions — reaches below-fold widgets
- Full operator manual embedded: `linux-use self guide`
