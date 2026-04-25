# glab Plugin

## Overview
The glab plugin provides access to the GitLab CLI tool (`glab`), bringing GitLab to your command line. Work with GitLab directly from the terminal without leaving your workflow.

## What is glab?
`glab` is an open-source GitLab CLI tool that allows you to work with GitLab directly from your terminal. It provides a unified interface for managing repositories, issues, merge requests, pipelines, and more.

## Quick Start

### 1. Install glab
```bash
curl -sL https://git.io/glab | sh
# or with Homebrew
brew install glab
```

### 2. Authenticate
```bash
sc glab auth login
```

### 3. Verify installation
```bash
sc glab self version
```

## Common Workflows

### Working with Merge Requests
```bash
# List merge requests
sc glab mr list

# List only opened MRs
sc glab mr list --state opened

# View a specific MR
sc glab mr view 123
```

### Working with Issues
```bash
# List issues
sc glab issue list

# List issues assigned to you
sc glab issue list --assignee @me

# List closed issues
sc glab issue list --state closed
```

### CI/CD Pipelines
```bash
# List pipelines
sc glab ci list

# View pipeline status
sc glab ci view 12345
```

### Repository Operations
```bash
# Clone a repository
sc glab repo clone owner/repo

# View repository info
sc glab repo view
```

## Authentication
Authenticate with your GitLab instance:
```bash
sc glab auth login
```

For self-hosted GitLab instances:
```bash
sc glab auth login --hostname gitlab.example.com
```

## Requirements
- GitLab account
- Personal access token with appropriate permissions

## Useful Commands
- `sc glab auth login` - Authenticate with GitLab
- `sc glab mr list` - List merge requests
- `sc glab mr view [iid]` - View a merge request
- `sc glab issue list` - List issues
- `sc glab ci list` - List CI/CD pipelines
- `sc glab repo clone [repo]` - Clone a repository

## Passthrough
For any glab command not exposed as a specific command, use the passthrough:
```bash
sc glab _ _ [any glab args]
```

## Resources
- Official docs: https://docs.gitlab.com/ee/user/cli/
- GitHub repo: https://github.com/profclems/glab
