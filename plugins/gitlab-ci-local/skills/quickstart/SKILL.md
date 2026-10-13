---
name: gitlab-ci-local
description: Use this skill when the user wants to run or debug GitLab CI pipelines locally from .gitlab-ci.yml without pushing to GitLab.
---

# gitlab-ci-local Plugin

gitlab-ci-local executes `.gitlab-ci.yml` jobs locally in Docker containers. It resolves
includes, extends, needs, artifacts, and variables so you can iterate on pipelines
without commits to GitLab. Requires Docker.

## Commands

### Running
- `gitlab-ci-local pipeline run` — Run the full pipeline
- `gitlab-ci-local job run <job>` — Run one job (`--needs` pulls dependencies)

### Inspection
- `gitlab-ci-local pipeline list` — List jobs, stages, needs
- `gitlab-ci-local pipeline preview` — Resolved YAML after includes/extends
- `gitlab-ci-local _ _` — Passthrough

## Usage Examples

- "Run my GitLab pipeline locally"
- "Just run the test job"
- "Show me the resolved pipeline YAML"
- "List all jobs in this .gitlab-ci.yml"

## Installation

```bash
npm install -g gitlab-ci-local
```

## Examples

```bash
# Full pipeline
gitlab-ci-local

# Single job, with its `needs` dependencies
gitlab-ci-local test --needs

# Inject variables
gitlab-ci-local --variable CI_COMMIT_REF_NAME=main

# Variables are auto-loaded from .gitlab-ci-local-variables.yml if present
gitlab-ci-local --cwd ./my-project
```

## Key Features

- Jobs run in the same Docker images as real GitLab CI
- Resolves `include:` (local, remote, project), `extends`, `needs`, `artifacts`
- `--preview` / `--list` inspect the pipeline without running it
- Shell executor fallback with `--executor shell` when Docker isn't available
