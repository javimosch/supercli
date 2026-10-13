---
name: llm
description: Use this skill when the user wants to prompt an LLM from the command line, pipe content through a model, manage API keys/templates, or embed text for similarity search.
---

# llm Plugin

llm is Simon Willison's unix-friendly LLM CLI. Pipe text to any model, save prompt templates, log every conversation to SQLite, and build embedding collections — extended by a large plugin ecosystem.

## Commands

### Prompting
- `llm prompt run` — Send a prompt to the default model (stdin is appended to the prompt)
- `llm embed run` — Embed text/files into a collection
- `llm _ _` — Passthrough (`llm chat`, `llm similar`, `llm schemas`, `llm install`)

### Management
- `llm self version` — Show version
- `llm models list` — List models (`--options` shows per-model options)
- `llm plugins list` — List installed plugins
- `llm keys manage` — `keys list`, `keys set <name>`, `keys path`
- `llm templates list` — List stored prompt templates
- `llm logs list` — Conversation history (`-n 10`, `--json`, `-m <model>`)

## Usage Examples

- "Summarize this file with GPT-4o"
- "Set my Anthropic API key in llm"
- "Show my recent llm prompts"
- "Embed these docs for similarity search"

## Installation

```bash
pipx install llm
# or: pip install llm / brew install llm / uv tool install llm
```

## Examples

```bash
# Pipe a file through a system prompt
cat app.py | supercli llm prompt run -s "Find bugs" -m gpt-4o

# Extract structured data
supercli llm prompt run "Who wrote Hamlet?" --schema "name, year:int"

# Save and reuse a template
supercli llm --system "Summarize as bullet points" --save bullets
cat doc.md | supercli llm -t bullets

# Set keys and extend with plugins
supercli llm keys manage set anthropic
supercli llm _ _ install llm-gemini llm-ollama

# Embeddings
supercli llm embed run docs README.md -d docs.sqlite3
supercli llm _ _ similar docs -d docs.sqlite3 -c "how to install"
```

## Key Features

- Model plugins: `llm-anthropic`, `llm-gemini`, `llm-ollama`, `llm-mlx`, and more
- `--schema` extracts structured JSON from unstructured text
- `-t/--template` reusable system+model prompts, `llm chat` for multi-turn
- Every call is logged to SQLite — query with `llm logs` or Datasette
- `llm embed`/`llm similar`/`llm embed-multi` build local embedding search
- Fragments (`-f`) attach files, URLs, and previous logs to a prompt
