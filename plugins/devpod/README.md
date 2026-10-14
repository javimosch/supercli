# devpod Plugin for SuperCLI

[DevPod](https://github.com/loft-sh/devpod) is a client-only, open-source
alternative to GitHub Codespaces. It creates reproducible devcontainer
environments on Docker, Kubernetes, SSH machines, or cloud VMs via pluggable
providers — VS Code, JetBrains, or plain SSH.

## Installation

```bash
curl -L -o devpod https://github.com/loft-sh/devpod/releases/latest/download/devpod-linux-amd64 \
  && sudo install -o root -g root -m 0755 devpod /usr/local/bin
# or: brew install devpod

# Install supercli plugin
supercli plugins install ./plugins/devpod
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli devpod self version` | Show devpod version |
| `supercli devpod workspace up` | Create/start a dev environment |
| `supercli devpod workspace list` | List workspaces |
| `supercli devpod workspace ssh` | SSH/exec into a workspace |
| `supercli devpod workspace stop` | Stop a workspace |
| `supercli devpod workspace delete` | Delete a workspace |
| `supercli devpod provider list` | List providers |
| `supercli devpod provider add` | Add a provider backend |
| `supercli devpod <any>` | Passthrough to devpod CLI |

## Usage

```bash
# First time: pick where workspaces run
supercli devpod provider add docker

# Headless environment for the current repo
supercli devpod workspace up . --ide none
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
