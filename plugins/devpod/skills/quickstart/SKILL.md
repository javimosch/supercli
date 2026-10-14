---
name: devpod
description: Use this skill when the user wants to create reproducible devcontainer-based development environments on Docker, Kubernetes, SSH hosts, or cloud VMs — the open-source Codespaces alternative.
---

# devpod Plugin

DevPod creates reproducible dev environments from `devcontainer.json` definitions on any infrastructure through pluggable providers (docker, kubernetes, ssh, aws, gcloud, azure, ...). Client-only — no server to run, open-source alternative to GitHub Codespaces.

## Commands

- `devpod workspace up` — Create/start an env from path, repo, or image
- `devpod workspace list` — List workspaces with provider/status
- `devpod workspace ssh` — Shell or exec into a workspace
- `devpod workspace stop` — Stop a workspace
- `devpod workspace delete` — Destroy a workspace
- `devpod provider list` — Show providers and active one
- `devpod provider add` — Add a provider backend
- `devpod _ _` — Passthrough to devpod CLI (ide, rebuild, context, ...)

## Usage Examples

- "Spin up a clean dev environment for this repo in Docker"
- "Create an isolated environment to test this PR on Kubernetes"
- "List my devpod workspaces and delete the stale ones"

## Installation

```bash
curl -L -o devpod https://github.com/loft-sh/devpod/releases/latest/download/devpod-linux-amd64 \
  && sudo install -o root -g root -m 0755 devpod /usr/local/bin
# or: brew install devpod
```

## Examples

```bash
# Configure a provider first (once)
devpod provider add docker

# Local repo → headless workspace (agent-friendly, no IDE)
devpod up . --ide none

# Git repo → workspace, then exec a test run inside
devpod up github.com/org/repo --ide none
devpod ssh <workspace> --command "npm test"

# Open in VS Code instead
devpod up . --ide vscode
```

## Key Features

- devcontainer.json spec — reuse existing Codespaces/Docker configs
- Providers decouple the env spec from the infrastructure
- `--ide none` + `devpod ssh` makes clean-room builds/test-runs scriptable
- `--recreate`, `--reset` for fresh environments; dotfiles support
