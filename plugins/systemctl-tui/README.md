# systemctl-tui Plugin for SuperCLI

[systemctl-tui](https://github.com/rgwood/systemctl-tui) is a fast Rust TUI for
systemd: browse units and their states, start/stop/restart/enable services,
view live logs, cat and edit unit files — all without memorizing `systemctl`
flags.

## Installation

```bash
cargo install systemctl-tui
# or: cargo binstall systemctl-tui
# or: brew install systemctl-tui

# Install supercli plugin
supercli plugins install ./plugins/systemctl-tui
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli systemctl-tui self version` | Show version |
| `supercli systemctl-tui tui run` | Launch the systemd TUI |
| `supercli systemctl-tui <any>` | Passthrough to systemctl-tui CLI |

## Usage

```bash
supercli systemctl-tui tui run      # interactive unit browser
sudo systemctl-tui                  # full control over system services
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
