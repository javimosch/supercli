---
name: wrkflw
description: Use this skill when the user wants to validate, run, or test GitHub Actions workflows locally before pushing to the repository.
---

# wrkflw Plugin

Validate and run GitHub Actions locally. Workflow validation, local execution with Docker/Podman, watch mode, matrix builds, secrets management, and GitLab CI support.

## Commands

### Workflow Validation
- `wrkflw workflow validate` — Validate workflow files

### Workflow Execution
- `wrkflw workflow run` — Run a workflow locally
- `wrkflw workflow watch` — Rerun workflows automatically on file changes
- `wrkflw workflow list` — List detected workflows and pipelines

### Utility
- `wrkflw self version` — Print wrkflw version
- `wrkflw _ _` — Passthrough to wrkflw CLI

## Usage Examples
- "Validate the GitHub Actions workflows in this repo"
- "Run the CI workflow locally"
- "Watch for workflow changes and rerun automatically"
- "List all detected workflows"
- "Run only the test job from the CI workflow"

## Installation

```bash
cargo install wrkflw
```

## Examples

```bash
# Validate all workflows in .github/workflows
wrkflw workflow validate

# Validate a specific workflow file
wrkflw workflow validate .github/workflows/ci.yml

# Run the CI workflow
wrkflw workflow run .github/workflows/ci.yml

# Run only the test job
wrkflw workflow run .github/workflows/ci.yml --job test

# Watch for changes and rerun workflows automatically
wrkflw workflow watch

# List detected workflows
wrkflw workflow list
```

## Key Features
- **Workflow validation** — syntax checks, structural validation, composite action input cross-checking
- **Local execution** — Docker, Podman, emulation, or sandboxed secure emulation (no containers)
- **Diff-aware filtering** — skip workflows whose `on:` block doesn't match the simulated event and changed file set
- **Watch mode** — rerun workflows automatically on file changes
- **Job selection** — run individual jobs with `--job` flag
- **Job dependency resolution** — automatic ordering based on `needs` with parallel execution of independent jobs
- **Expression evaluator** — evaluates `${{ ... }}` expressions including `toJSON`, `fromJSON`, `contains`, `startsWith`, etc.
- **Action support** — Docker container actions, JavaScript actions, composite actions, local actions
- **Reusable workflows** — execute caller jobs via `jobs.<id>.uses` with output propagation
- **Artifacts, cache, inter-job outputs** — `actions/upload-artifact`, `actions/download-artifact`, `actions/cache`, `needs.<id>.outputs.*`
- **Matrix builds** — full support for `include`, `exclude`, `max-parallel`, and `fail-fast`
- **Secrets management** — multiple providers (env, file, Vault, AWS, Azure, GCP) with masking and AES-256-GCM encrypted storage
- **Remote triggering** — trigger `workflow_dispatch` runs on GitHub or GitLab pipelines
- **GitLab support** — validate and trigger GitLab CI pipelines

## Notes
- Running `wrkflw` without arguments launches an interactive TUI with Workflows, Execution, DAG, Logs, Trigger, Secrets, and Help tabs
- Use subcommands (`validate`, `run`, `watch`, `list`) for headless/scripted operation
- Requires Docker or Podman for container-based workflow execution
- Sandbox mode runs without containers (less isolated)
- Windows and macOS runners are mapped to Linux containers for local execution
