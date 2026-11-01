---
name: mpc
description: mpc — command-line client for Music Player Daemon (MPD). Controls music playback, playlists, volume, and queue management. Supports local and remote MPD connections, shuffle/repeat modes, and library search from the terminal.
---

# mpc Plugin

mpc — command-line client for Music Player Daemon (MPD). Controls music playback, playlists, volume, and queue management. Supports local and remote MPD connections, shuffle/repeat modes, and library search from the terminal.

## Installation

```bash
brew install mpc
Verify: mpc --version
```

## Commands

### `sc mpc self version`

Print mpc version

## Passthrough

```bash
sc mpc _ _ <args...>
```

## SuperCLI

```bash
sc mpc _ _ --help
sc plugins learn mpc
```
