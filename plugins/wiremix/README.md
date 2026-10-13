# wiremix Plugin for SuperCLI

[wiremix](https://github.com/tsowell/wiremix) is a terminal mixer for
PipeWire, built with ratatui. Adjust per-stream and per-device volumes, mute
sources and sinks, set default devices, and reroute audio between nodes — a
pavucontrol replacement for the terminal.

## Installation

```bash
# Install wiremix binary (pick one)
cargo install wiremix
# or: sudo dnf install wiremix   (Fedora)

# Install supercli plugin
supercli plugins install ./plugins/wiremix
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli wiremix self version` | Show wiremix version |
| `supercli wiremix tui open` | Launch the mixer TUI |
| `supercli wiremix <any>` | Passthrough to wiremix CLI |

## Usage

```bash
# Launch the mixer (requires PipeWire running)
supercli wiremix tui open

# With a custom config file
supercli wiremix --config-file ~/.config/wiremix/wiremix.toml
```

Inside the TUI: `j`/`k` or arrows move between nodes, `h`/`l` adjust volume,
`m` mutes, `d` sets the default device, `Enter` on a stream picks where to
route it, `Tab` switches playback/recording/inputs views.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
