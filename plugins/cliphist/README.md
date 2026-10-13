# cliphist Plugin for SuperCLI

[cliphist](https://github.com/sentriz/cliphist) is a clipboard history
"manager" for Wayland. It stores clipboard changes (text *and* images)
byte-for-byte in a small database and recalls them through any dmenu-style
picker — or plain pipes.

## Installation

```bash
# Install cliphist binary
go install go.senan.xyz/cliphist@latest
# or: distro package / release binary

# Install supercli plugin
supercli plugins install ./plugins/cliphist
```

Start recording once per session:

```bash
wl-paste --watch cliphist store &
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli cliphist self help` | Show cliphist usage |
| `supercli cliphist history list` | List history (TSV, newest first) |
| `supercli cliphist history decode` | Decode a selected id back to bytes |
| `supercli cliphist history store` | Store one item from stdin |
| `supercli cliphist history wipe` | Clear the database |
| `supercli cliphist history compact` | Compact the database |
| `supercli cliphist <any>` | Passthrough to cliphist CLI |

## Usage

```bash
# History plumbing
supercli cliphist history list
cliphist list | fzf | cliphist decode | wl-copy
supercli cliphist history wipe -- -older-than 720h
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
