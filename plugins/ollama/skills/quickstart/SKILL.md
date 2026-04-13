---
name: ollama.quickstart
description: Agent workflow for discovering, pulling, running, and chatting with local LLM models via Ollama.
tags: ollama,llm,local-ai,models,inference,chat
---

# ollama Quickstart

Use this when AI agents need to work with local LLM models through Ollama's CLI and REST API.

## 1) Install plugin and dependency

```bash
supercli plugins learn ollama
curl -fsSL https://ollama.com/install.sh | sh
ollama --version
supercli plugins install ./plugins/ollama --json
```

## 2) Validate CLI wiring

```bash
ollama --version
supercli ollama model list
supercli plugins doctor ollama --json
```

## 3) Core command patterns

### Model management (CLI — process adapter)

```bash
supercli ollama model list
supercli ollama model pull llama3
supercli ollama model show llama3
supercli ollama model stop llama3
supercli ollama model remove llama3
supercli ollama model copy llama3 llama3-backup
```

### Server management

```bash
supercli ollama server status
supercli ollama server start
```

### Structured JSON responses via HTTP API (non-human output)

For agents, prefer HTTP API commands which return structured JSON:

```bash
supercli ollama api chat --model_name llama3 --messages '[{"role":"user","content":"Hello"}]'
supercli ollama api generate --model_name llama3 --prompt "Explain quantum computing"
supercli ollama api embed --model_name mxbai-embed-large --input "Text to embed"
```

## 4) Why HTTP API for agents?

Ollama CLI commands output human-readable text (no `--json` flag). The HTTP API at `localhost:11434` returns structured JSON that agents can parse deterministically:

```json
{
  "model": "llama3",
  "message": {"role": "assistant", "content": "Hello! How can I help?"},
  "done": true,
  "total_duration": 1234567890
}
```

**For non-human consumption (agents):** Use `ollama api chat|generate|embed` commands which are designed for programmatic consumption.

**For human-in-the-loop:** Use CLI commands like `ollama model list`, `ollama model pull`.

## 5) Agent workflow: Local LLM task pipeline

1. Check server status: `supercli ollama server status`
2. List available models: `supercli ollama model list`
3. Pull model if needed: `supercli ollama model pull llama3`
4. Start model: `supercli ollama server start` (if not running)
5. Send chat request via API for structured response

## 6) Environment variables for agents

```bash
export OLLAMA_MODEL=llama3           # Default model for API commands
export OLLAMA_EMBED_MODEL=mxbai-emp-large  # Default embed model
```

## 7) Model registry

Popular models to pull:
- `llama3` — General purpose
- `llama3:70b` — Larger, more capable
- `mistral` — Fast, efficient
- `codellama` — Code generation
- `mxbai-embed-large` — Embeddings
- `nomic-embed-text` — Alternative embeddings

## 8) Safety levels

| Command | Level | Description |
|---------|-------|-------------|
| `model list`, `model show`, `server status` | safe | Read-only, no side effects |
| `model pull`, `model copy`, `server start` | safe | Downloads or starts services |
| `model stop`, `model create` | safe | Controls running models |
| `model remove`, `model push` | guarded | Destructive or network operations |

Guarded commands may require confirmation in interactive mode.