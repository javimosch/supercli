---
name: lab
description: Use this skill when the user wants to manage GitLab repositories, issues, merge requests, or pipelines from the command line.
---

# lab Plugin

A hub-like CLI for GitLab. Manage GitLab repositories, issues, merge requests, and pipelines from the command line.

## Commands

### Merge Requests
- `lab mr list` — List merge requests
- `lab mr create` — Create a merge request

### Issues
- `lab issue list` — List issues

### Utility
- `lab _ _` — Passthrough to lab CLI

## Usage Examples
- "List GitLab merge requests"
- "Create GitLab MR"
- "List GitLab issues"
- "Manage GitLab from CLI"

## Installation

```bash
brew install lab
```

Or via Go:
```bash
go install github.com/zaquestion/lab/cmd/lab@latest
```

Requires GitLab access token.

## Examples

```bash
# List merge requests
lab mr list

# List MR by assignee
lab mr list --assignee me

# Create merge request
lab mr create --title "Fix bug" --source feature-branch --target main

# List issues
lab issue list

# List issues by state
lab issue list --state opened

# Any lab command with passthrough
lab _ _ mr list
lab _ _ issue list --assignee @me
lab _ _ ci view
```

## Key Features
- **MRs** - Merge request management
- **Issues** - Issue tracking
- **Pipelines** - CI/CD pipelines
- **Repos** - Repository management
- **GitLab** - GitLab integration
- **CLI** - Command line native
- **Auth** - Token authentication
- **Filter** - Powerful filtering
- **DevOps** - DevOps workflows
- **Automation** - Automate GitLab

## Notes
- Requires GitLab access token
- Similar to GitHub's gh
- Great for GitLab workflows
- Supports CI/CD management
