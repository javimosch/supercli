# GitHub CLI Plugin Harness

This plugin integrates the official GitHub CLI (`gh`) into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install GitHub CLI with your preferred package manager, then verify it is available:

```bash
gh --version
```

Authenticate before running account or repository operations:

```bash
gh auth login
```

## Available Commands

### Account Status (Wrapped)

Returns GitHub CLI authentication status via `gh auth status --json hosts`.

```bash
dcli gh account status --json
```

### Full Passthrough

You can run any GitHub CLI command through the `gh` namespace.

```bash
# List your repositories
dcli gh repo list --limit 10 --json name,nameWithOwner,url

# Show pull requests in the current repo
dcli gh pr list --json number,title,state

# Show CLI help
dcli gh --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
