# opencode Plugin for SuperCLI

[opencode](https://github.com/sst/opencode) is a terminal-first AI coding agent
from SST. It is provider-agnostic (Anthropic, OpenAI, Google, Bedrock, local
models), ships an interactive TUI, and supports a non-interactive
`opencode run` mode that emits JSON events — ideal for scripting.

## Installation

```bash
# Install opencode binary (pick one)
curl -fsSL https://opencode.ai/install | bash
# or: npm install -g opencode-ai
# or: brew install opencode

# Install supercli plugin
supercli plugins install ./plugins/opencode
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli opencode self version` | Show opencode version |
| `supercli opencode agent run` | Run a prompt non-interactively |
| `supercli opencode models list` | List models from configured providers |
| `supercli opencode stats show` | Token usage and session stats |
| `supercli opencode auth manage` | Manage provider credentials |
| `supercli opencode self upgrade` | Upgrade opencode |
| `supercli opencode <any>` | Passthrough to opencode CLI |

## Usage

```bash
# Headless agent run (JSON events for pipelines)
supercli opencode agent run "Fix the failing test in src/api.ts" --json

# Pick a specific model
supercli opencode agent run "Refactor this module" -m anthropic/claude-sonnet-4-5

# Check what models you can use
supercli opencode models list

# Launch the TUI
supercli opencode
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
