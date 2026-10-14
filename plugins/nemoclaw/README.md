# NemoClaw Plugin

This plugin is a hybrid harness: it indexes NemoClaw upstream documentation into the supercli skill catalog and exposes the local `nemoclaw` host CLI through wrapped commands and passthrough.

## Install

```bash
# Optional: index docs from your own fork instead of NVIDIA/NemoClaw
export NEMOCLAW_DOCS_REPO="your-org/NemoClaw"
export NEMOCLAW_DOCS_REF="main"

supercli plugins install nemoclaw --json
```

## Explore Indexed Skill Documents

```bash
supercli skills list --catalog --provider nemoclaw --json
supercli skills get nemoclaw:root.readme
supercli skills get nemoclaw:docs.reference.commands
supercli skills get nemoclaw:docs.about.how-it-works
```

## Available Wrapped Commands

```bash
# Version and system status
supercli nemoclaw self version --json
supercli nemoclaw system status

# List sandboxes
supercli nemoclaw sandbox list

# Services
supercli nemoclaw service start
supercli nemoclaw service stop

# Sandbox-scoped actions
supercli nemoclaw sandbox status --name my-assistant
supercli nemoclaw sandbox logs --name my-assistant --follow
supercli nemoclaw sandbox connect --name my-assistant

# Host operations
supercli nemoclaw host onboard
supercli nemoclaw host onboard-auto --non-interactive --provider cloud --sandbox-name my-assistant --policy-mode skip --api-key "$NVIDIA_API_KEY"
supercli nemoclaw host onboard-auto --non-interactive --provider openrouter --model openai/gpt-4o-mini --sandbox-name my-assistant --policy-mode skip --api-key "$OPENROUTER_API_KEY"
supercli nemoclaw host setup-spark
supercli nemoclaw deploy instance --instance my-gpu-box

# Full passthrough
supercli nemoclaw help
supercli nemoclaw my-assistant policy-list
```

## Notes

- This plugin indexes remote markdown from `https://github.com/NVIDIA/NemoClaw`.
- Set `NEMOCLAW_DOCS_REPO` and `NEMOCLAW_DOCS_REF` before install to index docs from a private fork.
- It expects host prerequisites for NemoClaw/OpenShell to already be installed.
- NemoClaw is alpha software; commands and behaviors may change upstream.
