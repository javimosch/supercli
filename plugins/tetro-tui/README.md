# tetro-tui Plugin for SuperCLI

[tetro-tui](https://github.com/Strophox/tetro-tui) is a modern terminal-based
tetromino-stacking game in Rust (formerly `tetrs`). Guideline-style mechanics,
rich theming, multiple game modes, a game-analysis engine, and an optional bot.

## Installation

```bash
cargo install tetro-tui
# or: release binaries at https://github.com/Strophox/tetro-tui/releases
# or: nix run github:Strophox/tetro-tui

# Install supercli plugin
supercli plugins install ./plugins/tetro-tui
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli tetro-tui self version` | Show version |
| `supercli tetro-tui game play` | Start the game (interactive TUI) |
| `supercli tetro-tui <any>` | Passthrough to tetro-tui CLI |

## Usage

```bash
supercli tetro-tui game play          # default mode
supercli tetro-tui game play -d       # descent mode
supercli tetro-tui game play -e       # let the bot play combo mode
```

Requires a real terminal — it's an interactive game, not a batch tool.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
