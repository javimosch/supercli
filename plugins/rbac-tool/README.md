# rbac-tool Plugin for SuperCLI

[rbac-tool](https://github.com/alcideio/rbac-tool) is a toolkit for inspecting Kubernetes RBAC: answer 'who can get secrets?', look up a serviceaccount's effective permissions, analyze risky rules, visualize bindings, and generate least-privilege policies.

## Installation

```bash
# Download rbac-tool for your platform from https://github.com/alcideio/rbac-tool/releases and move it to PATH
# Or: brew install rbac-tool
# Or as a kubectl plugin: kubectl krew install rbac-tool (invoked as kubectl rbac-tool)
# Verify: rbac-tool version

# Install supercli plugin
supercli plugins install ./plugins/rbac-tool
```

## Commands

- `rbac-tool self version` — Print rbac-tool version
- `rbac-tool access who-can` — Show which subjects can perform an action (rbac-tool who-can get secrets). Add -n to scope to a namespace
- `rbac-tool access lookup` — Show effective permissions of a serviceaccount or user (rbac-tool lookup -e system:serviceaccount:ns:name)
- `rbac-tool rules analysis` — Analyze RBAC rules and flag risky/overly broad permissions (rbac-tool analysis -o table)
- `rbac-tool policies gen` — Generate least-privilege RBAC policies from observed audit-log traffic (rbac-tool gen). Reads the API server audit log
- `rbac-tool graph viz` — Render the RBAC permission graph as HTML (rbac-tool viz --outformat html -o rbac.html)
- `rbac-tool _ _` — Passthrough to rbac-tool CLI (policy-rules, audit-log and other subcommands)

All commands pass extra flags through to the underlying `rbac-tool` CLI.
