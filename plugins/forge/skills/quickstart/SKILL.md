---
name: forge
description: Use this skill when the user wants to interact with Git forges like GitLab, Gitea, or Forgejo from the command line using forge.
---

# forge Plugin

Git forges CLI (GitLab, Gitea, Forgejo) — interact with multiple git hosting platforms from a single unified interface.

## Commands

- `forge repo run <args>` -- Run Git forges CLI (GitLab, Gitea, Forgejo)

## Usage Examples

List repositories:
```
forge repo run list
```

Create a new repository:
```
forge repo run create --name "my-project"
```

Clone a repository:
```
forge repo run clone <repo_url>
```

View repository details:
```
forge repo run show <repo_name>
```

## Installation

```
go install github.com/charmbracelet/forge@latest
```

## Key Features

- Unified interface for multiple git forges
- Supports GitLab, Gitea, and Forgejo
- Repository management (create, clone, list)
- Issue and pull request management
- Beautiful terminal UI
