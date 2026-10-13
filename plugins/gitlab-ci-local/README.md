# gitlab-ci-local Plugin for SuperCLI

[gitlab-ci-local](https://github.com/firecow/gitlab-ci-local) runs GitLab CI pipelines
on your machine — it parses `.gitlab-ci.yml` (includes, extends, needs, artifacts,
variables) and executes each job in Docker, so you can debug pipelines without pushing.

## Installation

```bash
# Install gitlab-ci-local binary (needs Node.js + Docker)
npm install -g gitlab-ci-local

# Install supercli plugin
supercli plugins install ./plugins/gitlab-ci-local
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli gitlab-ci-local self version` | Show version |
| `supercli gitlab-ci-local pipeline run` | Run the full pipeline |
| `supercli gitlab-ci-local job run <job>` | Run a single job |
| `supercli gitlab-ci-local pipeline list` | List jobs/stages/needs |
| `supercli gitlab-ci-local pipeline preview` | Show resolved pipeline YAML |
| `supercli gitlab-ci-local <any>` | Passthrough to CLI |

## Usage

```bash
# Run everything
supercli gitlab-ci-local pipeline run

# One job with its needs
supercli gitlab-ci-local job run build --needs

# Inspect resolved YAML
supercli gitlab-ci-local pipeline preview
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
