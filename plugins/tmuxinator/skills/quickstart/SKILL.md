---
name: tmuxinator
description: Use this skill when the user wants to define, start, or inspect tmux sessions declared in YAML project files with tmuxinator.
---

# tmuxinator Plugin

tmuxinator turns `~/.config/tmuxinator/<name>.yml` (or project-local `.tmuxinator.yml`) into ready-made tmux sessions: root dir, pre-window commands, windows, splits, and per-pane shell commands. `mux` is a built-in alias.

## Commands

### Projects
- `tmuxinator project list` — All defined projects
- `tmuxinator project new` — Scaffold a YAML project
- `tmuxinator project start` — Launch the session
- `tmuxinator project stop` — Kill the session
- `tmuxinator project debug` — Print the tmux commands it would run (dry run)
- `tmuxinator doctor check` — Validate environment (tmux, $EDITOR, tmuxinator config)
- `tmuxinator _ _` — Passthrough (`edit`, `copy`, `delete`, `implode`, `local`, `completions`)

## Usage Examples

- "Create a tmuxinator project for this repo"
- "Start the myapp workspace"
- "Show me the tmux commands my project generates"
- "List all my tmuxinator projects"

## Installation

```bash
gem install tmuxinator
```

## Examples

```bash
tmuxinator new webapp
tmuxinator edit webapp
tmuxinator start webapp          # or: mux start webapp
tmuxinator debug webapp          # see generated tmux commands
tmuxinator doctor                # is my env ready?
tmuxinator stop webapp
```

## Key Features

- YAML-declared workspaces: windows, panes, layouts, per-pane commands
- `pre_window`/`post`/`on_project_start` lifecycle hooks
- `debug` shows the exact tmux command sequence — easy to verify before running
- Project-local `.tmuxinator.yml` via `tmuxinator local` for repo-bundled sessions
