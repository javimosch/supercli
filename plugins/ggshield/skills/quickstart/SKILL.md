---
name: ggshield
description: Use this skill when the user wants to scan code, git history, or infrastructure-as-code for secrets with GitGuardian's ggshield CLI.
---

# ggshield Plugin

ggshield is GitGuardian's CLI for detecting secrets (API keys, tokens, credentials) in code, git history, and CI pipelines. It also scans IaC for misconfigurations and manages honeytokens.

## Commands

### Secret scanning
- `ggshield secret scan-path <path>` — Scan files/directories
- `ggshield secret scan-repo <repo_url>` — Scan a remote repo's full history
- `ggshield secret scan-ci` — Scan commits in CI context

### Other
- `ggshield iac scan <path>` — IaC misconfiguration scan (Terraform, K8s, Docker)
- `ggshield auth login` — Authenticate with a GitGuardian workspace
- `ggshield _ _` — Passthrough (secret scan pre-commit, honeytoken create, quota)

## Usage Examples

- "Scan this directory for leaked API keys"
- "Check the git history of this repo for secrets"
- "Set up a pre-commit secrets check"
- "Audit my Terraform files"

## Installation

```bash
pipx install ggshield
# or: pip install ggshield
# or: brew install gitguardian/tap/ggshield
```

## Examples

```bash
ggshield secret scan path .                 # scan working tree
ggshield secret scan path --recursive src/  # recursive
ggshield secret scan pre-commit             # scan staged changes
ggshield secret scan repo https://github.com/org/repo.git
ggshield iac scan all terraform/
export GITGUARDIAN_API_KEY=...              # unlocks full quota/features
```

## Key Features

- Detects 450+ types of secrets with validity hints
- Scans working tree, staged commits, full history, CI diffs, and remote repos
- IaC scanning (Terraform, Kubernetes manifests, Dockerfiles, Helm)
- Honeytoken deployment to detect intrusion/breaches
