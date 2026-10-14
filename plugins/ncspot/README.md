# ncspot Plugin for SuperCLI

[ncspot](https://github.com/hrkfdn/ncspot) — Cross-platform ncurses Spotify client in Rust — keyboard-driven playback, search, and playlists in the terminal.

## Installation

```bash
cargo install ncspot
# or: brew install ncspot

# Install supercli plugin
supercli plugins install ./plugins/ncspot
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli ncspot self version` | Print ncspot version |
| `supercli ncspot player start` | Launch the ncspot TUI |
| `supercli ncspot <any>` | Passthrough to ncspot CLI |

## Usage

```bash
supercli ncspot player start
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
