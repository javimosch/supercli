# Ollama Plugin for supercli

Plugin for [Ollama](https://ollama.com) — run local LLM models with AI-friendly structured commands.

## Features

- **Model Management**: Pull, list, show, copy, remove, stop, push local models
- **Server Control**: Start and check Ollama server status
- **Structured JSON API**: Chat, generate, and embed via HTTP REST API with JSON responses

## Installation

```bash
supercli plugins install ./plugins/ollama --json
```

## Commands

### CLI Commands (process adapter)

```bash
# List available models
supercli ollama model list

# Pull a model from registry
supercli ollama model pull llama3

# Show model details
supercli ollama model show llama3

# Copy/clone a model
supercli ollama model copy llama3 llama3-backup

# Remove a model
supercli ollama model remove llama3-backup

# Check running server status
supercli ollama server status

# Start server (background)
supercli ollama server start

# Stop a running model
supercli ollama model stop llama3
```

### HTTP API Commands (structured JSON for agents)

```bash
# Chat completion (structured JSON response)
supercli ollama api chat \
  --model_name llama3 \
  --messages '[{"role":"user","content":"Hello"}]'

# Generate completion
supercli ollama api generate \
  --model_name llama3 \
  --prompt "What is quantum computing?"

# Generate embeddings
supercli ollama api embed \
  --model_name mxbai-embed-large \
  --input "Text to embed"
```

## For AI Agents

This plugin prioritizes **structured JSON responses** over human-readable CLI output.

The HTTP API commands (`api chat`, `api generate`, `api embed`) return deterministic JSON that agents can parse:

```json
{
  "model": "llama3",
  "message": {"role": "assistant", "content": "..."},
  "done": true,
  "total_duration": 1234567890,
  "eval_count": 42
}
```

CLI commands are best used for human-in-the-loop workflows. For agent automation, use the HTTP API commands.

## Install Ollama

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Docker
docker pull ollama/ollama

# Verify
ollama --version
```

## Learn More

- [Ollama Docs](https://github.com/ollama/ollama)
- [Model Library](https://ollama.com/library)