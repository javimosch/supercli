# llama-swap Plugin for SuperCLI

[llama-swap](https://github.com/mostlygeek/llama-swap) is a zero-dependency Go
proxy that lets you run many local AI models on one machine and hot-swap between
them on demand. It fronts llama.cpp/vLLM/whisper.cpp/stable-diffusion.cpp/
ComfyUI servers with a single OpenAI- and Anthropic-compatible endpoint, loading
models only when requested and unloading them on a TTL.

## Installation

```bash
# Install llama-swap binary (pick one)
TAG=$(curl -s https://api.github.com/repos/mostlygeek/llama-swap/releases/latest \
  | grep -oP '"tag_name":\s*"v\K[0-9]+') \
  && curl -sL "https://github.com/mostlygeek/llama-swap/releases/latest/download/llama-swap_${TAG}_linux_amd64.tar.gz" \
  | tar xz llama-swap \
  && mv llama-swap ~/.local/bin/
# or: brew install llama-swap   (Linuxbrew/macOS)

# Install supercli plugin
supercli plugins install ./plugins/llama-swap
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli llama-swap self version` | Show llama-swap version |
| `supercli llama-swap server run` | Run the proxy (passthrough) |
| `supercli llama-swap <any>` | Passthrough to llama-swap CLI |

## Usage

```bash
# Minimal config (config.yaml): one model entry with cmd + proxy
# models:
#   qwen:
#     cmd: llama-server -m /models/qwen.gguf --port ${PORT}

# Run the proxy
supercli llama-swap server run -config config.yaml -listen :8080

# Flags use a single dash
supercli llama-swap _ _ -config config.yaml -listen 0.0.0.0:8080 -watch-config=false
```

Once running: OpenAI API at `/v1/*`, Anthropic at `/v1/messages`, web UI at `/ui`,
metrics at `/metrics`, health at `/health`.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
