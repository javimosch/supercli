# llm Plugin for SuperCLI

[llm](https://github.com/simonw/llm) is Simon Willison's unix-friendly CLI for
large language models. Pipe text to any model, manage API keys, save prompt
templates, log every conversation to SQLite, and embed content for similarity
search — all through a rich plugin ecosystem.

## Installation

```bash
# Install llm binary (pick one)
pipx install llm
# or: pip install llm
# or: brew install llm

# Install supercli plugin
supercli plugins install ./plugins/llm
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli llm self version` | Show llm version |
| `supercli llm prompt run` | Send a prompt to the default model |
| `supercli llm models list` | List available models |
| `supercli llm plugins list` | List installed plugins |
| `supercli llm keys manage` | Manage API keys |
| `supercli llm templates list` | List prompt templates |
| `supercli llm logs list` | Show logged conversations |
| `supercli llm embed run` | Embed text/files for similarity search |
| `supercli llm <any>` | Passthrough to llm CLI |

## Usage

```bash
# One-shot prompt
supercli llm prompt run "Explain quines in one paragraph"

# Pipe content through a system prompt
cat src/main.py | supercli llm prompt run -s "Review this code for bugs" -m gpt-4o

# Set an API key and pick a model
supercli llm keys manage set openai
supercli llm prompt run -m claude-sonnet-4-5 "Summarize this repo"

# Extend llm with model plugins
supercli llm install llm-anthropic llm-gemini llm-ollama
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
