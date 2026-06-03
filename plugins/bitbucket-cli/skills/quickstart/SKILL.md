---
name: bitbucket-cli
description: Use this skill when the user wants to interact with Bitbucket repositories and pull requests.
---

# Bitbucket CLI Plugin

Bitbucket CLI with gh-like ergonomics, written in Go.

## Commands

### Repositories
- `bitbucket-cli repo list` — List Bitbucket repositories
- `bitbucket-cli repo create` — Create a Bitbucket repository

### Pull Requests
- `bitbucket-cli pr list` — List pull requests
- `bitbucket-cli pr create` — Create a pull request

## Usage Examples

```bash
bitbucket-cli repo list --owner myteam
bitbucket-cli repo create --name myrepo --private
bitbucket-cli pr list --repo myteam/myrepo
bitbucket-cli pr create --repo myteam/myrepo --title "Fix bug"
bitbucket-cli --help
```

## Installation

```bash
go install github.com/bitbucket-cli/bitbucket-cli@latest
```

## Key Features
- gh-like ergonomics for Bitbucket
- Repository management
- Pull request workflows
- Go-based performance
