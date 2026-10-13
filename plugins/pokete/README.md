# pokete Plugin for SuperCLI

[pokete](https://github.com/lxgr-linux/pokete) is a terminal-based Pokemon-like
game in Python: explore a colorful ASCII world, catch wild Poketes, battle
trainers, earn achievements, and mod the world data.

## Installation

```bash
pip install pokete
# or: pipx install pokete

# Install supercli plugin
supercli plugins install ./plugins/pokete
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli pokete self help` | Show game options |
| `supercli pokete game play` | Start the game (interactive TUI) |
| `supercli pokete <any>` | Passthrough to pokete CLI |

## Usage

```bash
supercli pokete game play              # start a session
supercli pokete game play --no_audio   # silent mode
```

This is an interactive game — it needs a real terminal (not pipes/headless).

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
