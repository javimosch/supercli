# kubie Plugin for SuperCLI

[kubie](https://github.com/sbstp/kubie) — Kubernetes context and namespace switcher with isolated shell sessions — an alternative to kubectx/kubens.

## Installation

```bash
cargo install kubie
# or: brew install kubie

# Install supercli plugin
supercli plugins install ./plugins/kubie
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli kubie self version` | Print kubie version |
| `supercli kubie ctx use` | Switch or spawn a shell in a context |
| `supercli kubie ns use` | Switch namespace in the current context |
| `supercli kubie exec run` | Run a command inside a context+namespace: kubie exec <ctx> <ns> -- <cmd> |
| `supercli kubie <any>` | Passthrough to kubie CLI |

## Usage

```bash
supercli kubie ctx use
supercli kubie ns use
supercli kubie exec run
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
