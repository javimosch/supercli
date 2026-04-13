# Act Plugin for SuperCLI

Semantic commands for running GitHub Actions locally — finally, test your CI/CD before pushing.

## Installation

```bash
# Install act first
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sh
# or: brew install act

# Install the plugin
supercli plugins install ./plugins/act --on-conflict replace --json
```

## Requirements

- **act** CLI tool
- **Docker** must be running
- Workflow files in `.github/workflows/`

## Commands

### Workflow Operations
```bash
# List all workflows and jobs
supercli act workflow list

# Run push event (default)
supercli act workflow run

# Run pull_request event
supercli act workflow run --event pull_request

# Run specific job
supercli act workflow run --job build

# Validate without running
supercli act workflow validate

# Dry run mode
supercli act workflow dryrun

# Watch mode (auto-reload on file changes)
supercli act workflow watch
```

### Job Operations
```bash
# Run specific job
supercli act job run --job test
```

### Secrets Management
```bash
# List configured secrets
supercli act secret list

# Add a secret
supercli act secret add --name GITHUB_TOKEN --value "xxx"
```

## Common Patterns

```bash
# Test before pushing to GitHub
supercli act workflow run --job test

# Validate workflow files
supercli act workflow validate

# Run with specific secrets
supercli act workflow run --secrets '["GITHUB_TOKEN=xxx"]'
```

## Flags

| Flag | Description |
|------|-------------|
| `--event` | Event type (push, pull_request, workflow_dispatch) |
| `--job` | Specific job name |
| `--secrets` | JSON array of secrets |
| `--dryrun` | Validate without running |

## Docker

act runs workflows in Docker containers:
- Default image: `catthehacker/ubuntu:act-latest`
- Use `--platform` flag to customize: `act -P ubuntu-latest=my-image`

## Security Notes

- Secrets are stored in `~/.actrc`
- Use `--dryrun` to validate before running
- Workflows have full access to Docker on host