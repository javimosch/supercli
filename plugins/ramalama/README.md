# ramalama Plugin for SuperCLI

[RamaLama](https://github.com/containers/ramalama) is a container-first local LLM
runner from the containers/ project (Red Hat). It inspects your system for GPU
support, pulls the matching OCI image, and runs models inside podman or docker —
no host AI setup needed. Models are pulled from Ollama, HuggingFace, or OCI
registries and managed like container images.

## Installation

```bash
# Install ramalama binary (pick one)
pipx install ramalama          # or: pip install ramalama
sudo dnf install ramalama      # Fedora/RHEL
brew install ramalama          # Homebrew

# Install supercli plugin
supercli plugins install ./plugins/ramalama
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli ramalama self version` | Show ramalama version |
| `supercli ramalama model list` | List downloaded models |
| `supercli ramalama model pull <model>` | Pull a model to local storage |
| `supercli ramalama model run <model>` | Chat with a model (chatbot) |
| `supercli ramalama model serve <model>` | OpenAI-compatible REST API |
| `supercli ramalama model rm` | Remove models from local storage |
| `supercli ramalama model inspect` | Inspect a model |
| `supercli ramalama container ps` | List running model containers |
| `supercli ramalama system info` | Show engine/GPU/store config |
| `supercli ramalama <any>` | Passthrough to ramalama CLI |

## Usage

```bash
# Pull and chat with a tiny model
supercli ramalama model pull smollm:135m
supercli ramalama model run smollm:135m

# Preview the exact container command without running
supercli ramalama _ _ --dryrun run granite

# Serve an OpenAI-compatible API in the background
supercli ramalama model serve granite --port 8080 --name granite-svc -d

# What is ramalama doing under the hood?
supercli ramalama container ps
supercli ramalama system info
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
