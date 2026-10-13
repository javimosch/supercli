---
name: ramalama
description: Use this skill when the user wants to run, serve, pull, or manage local LLM models inside containers with RamaLama.
---

# ramalama Plugin

RamaLama makes AI boring: it runs local LLMs inside podman/docker containers, auto-selecting a GPU-matched OCI image so the host needs no AI setup. Models come from Ollama, HuggingFace, or OCI registries and are managed like container images.

## Commands

### Models
- `ramalama model list` — List downloaded models (`ramalama ls`)
- `ramalama model pull <model>` — Pull a model (e.g. `smollm:135m`, `ollama://llama3.2`, `huggingface://user/repo`)
- `ramalama model run <model>` — Interactive chatbot; `--dryrun` prints the container command instead
- `ramalama model serve <model>` — OpenAI-compatible REST API (`-d` daemonizes, `--name` names the container)
- `ramalama model rm` — Remove models (`--ignore` skips missing, `--all` removes everything)
- `ramalama model inspect` — Inspect a model

### System
- `ramalama container ps` — Running model containers
- `ramalama system info` — Engine/GPU/image/store config
- `ramalama _ _` — Passthrough (`stop`, `push`, `bench`, `rag`, `login`, `perplexity`, ...)

## Usage Examples

- "Pull llama3.2 and serve it as an OpenAI API on port 8080"
- "List the models I have locally"
- "Chat with smollm:135m"
- "Show me the exact podman command ramalama would run"

## Installation

```bash
pipx install ramalama        # or: pip install ramalama
sudo dnf install ramalama    # Fedora/RHEL
brew install ramalama        # Homebrew
```

Requires podman or docker (uses podman by default; `RAMALAMA_CONTAINER_ENGINE=docker` overrides).

## Examples

```bash
# Serve in background with a named container
ramalama serve --port 8080 --name granite-svc -d granite

# Stop and clean up
ramalama stop granite-svc
ramalama rm --ignore smollm:135m

# Pull a specific GGUF file from HuggingFace
ramalama pull huggingface://afrideva/Tiny-Vicuna-1B-GGUF/tiny-vicuna-1b.q2_k.gguf

# Run a local GGUF file directly
ramalama run file://$HOME/granite-7b-lab-Q4_K_M.gguf
```

## Key Features

- Zero host setup: pulls GPU-matched OCI images (CUDA/ROCm/etc.) automatically
- Docker-style model UX: `pull`, `run`, `serve`, `ls`, `ps`, `stop`, `rm`, `push`
- Transports: `ollama://` (default), `huggingface://`, `oci://`, `https://`, `file://`
- OpenAI-compatible `serve`, plus `rag` (doc→vector-DB image) and `sandbox` (agent in a box)
