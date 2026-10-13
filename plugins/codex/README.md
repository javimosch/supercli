# codex Plugin for SuperCLI

[codex](https://github.com/openai/codex) is OpenAI's official coding agent for
the terminal. It offers an interactive TUI, a headless `codex exec` mode for
scripts and CI, sandboxed execution levels, and built-in MCP client/server
support.

## Installation

```bash
# Install codex binary (pick one)
npm install -g @openai/codex
# or: brew install codex
# or: download codex-*.tar.gz from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/codex
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli codex self version` | Show codex version |
| `supercli codex agent exec` | Run a task non-interactively |
| `supercli codex session resume` | Resume a previous session |
| `supercli codex auth login` | Sign in (ChatGPT or API key) |
| `supercli codex mcp manage` | Manage MCP servers / serve codex via MCP |
| `supercli codex <any>` | Passthrough to codex CLI |

## Usage

```bash
# Authenticate
supercli codex auth login

# Headless task in read-only sandbox (safe for review)
supercli codex agent exec "Explain the auth flow" --sandbox read-only

# Let codex write files in the workspace
supercli codex agent exec "Add input validation to the form" --sandbox workspace-write

# Launch the interactive TUI
supercli codex
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
