---
name: llama-swap
description: Use this skill when the user wants to run many local LLMs behind one OpenAI/Anthropic-compatible endpoint with on-demand model swapping.
---

# llama-swap Plugin

llama-swap is a single-binary Go proxy: one endpoint, many local AI servers. It starts the requested model's upstream process (llama.cpp, vLLM, sd.cpp, whisper.cpp, ComfyUI...) on demand and unloads it after a TTL, so one GPU/RAM budget serves many models.

## Commands

- `llama-swap self version` — Print version (`-version`, single dash)
- `llama-swap server run` — Start the proxy; passthrough for `-config`, `-listen`, `-watch-config`, `-tls-cert-file`
- `llama-swap _ _` — Passthrough to llama-swap CLI

## Usage Examples

- "Run llama-swap with my config.yaml on port 8080"
- "Hot-swap between my GGUF models behind one OpenAI endpoint"

## Installation

```bash
# GitHub release binary (assets are llama-swap_<ver>_linux_amd64.tar.gz)
TAG=$(curl -s https://api.github.com/repos/mostlygeek/llama-swap/releases/latest \
  | grep -oP '"tag_name":\s*"v\K[0-9]+') \
  && curl -sL "https://github.com/mostlygeek/llama-swap/releases/latest/download/llama-swap_${TAG}_linux_amd64.tar.gz" \
  | tar xz llama-swap && mv llama-swap ~/.local/bin/

# or Homebrew (Linux/macOS)
brew install llama-swap
```

## Examples

```bash
# config.yaml
# models:
#   qwen3:
#     cmd: llama-server -m /models/qwen3.gguf --port ${PORT}
#     ttl: 300
#   embed:
#     cmd: llama-server -m /models/bge.gguf --port ${PORT} --embeddings

llama-swap -config config.yaml -listen :8080
```

## Key Features

- OpenAI endpoints: chat/completions, responses, embeddings, audio, images; Anthropic `/v1/messages`
- Demand loading + `ttl` auto-unload; `profiles` switch model sets at runtime
- Zero deps, hot config reload (`-watch-config`), API keys, `/metrics` (Prometheus), `/ui` web console
- Works with any OpenAI-compatible upstream, not just llama.cpp
