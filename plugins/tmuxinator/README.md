# tmuxinator Plugin for SuperCLI

[tmuxinator](https://github.com/tmuxinator/tmuxinator) manages complex tmux
sessions with YAML project files. Declare windows, panes, layouts, root dir,
and per-pane commands once — then bring the whole workspace up with
`tmuxinator start <name>`.

## Installation

```bash
# Install tmuxinator binary (also installs the `mux` alias)
gem install tmuxinator
# or: sudo apt install tmuxinator / brew install tmuxinator

# Install supercli plugin
supercli plugins install ./plugins/tmuxinator
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli tmuxinator self version` | Show tmuxinator version |
| `supercli tmuxinator project list` | List projects |
| `supercli tmuxinator project new` | Create a project YAML |
| `supercli tmuxinator project start` | Start a session |
| `supercli tmuxinator project stop` | Stop a session |
| `supercli tmuxinator project debug` | Show generated tmux commands |
| `supercli tmuxinator doctor check` | Environment sanity check |
| `supercli tmuxinator <any>` | Passthrough to tmuxinator CLI |

## Usage

```bash
# Create + start a project
supercli tmuxinator project new -- myapp
supercli tmuxinator project start -- myapp

# Inspect what it would run
supercli tmuxinator project debug -- myapp
supercli tmuxinator doctor check
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
