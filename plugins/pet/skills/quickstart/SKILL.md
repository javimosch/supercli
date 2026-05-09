---
name: pet
description: Use this skill when the user wants to save, search, or reuse command snippets, store useful commands for later, or manage a personal snippet collection.
---

# pet Plugin

Simple CLI snippet manager. Save, tag, search, and execute command snippets.

## Commands

### Creating
- `pet snippet create -t docker,deploy` — Create a new snippet (interactively)
- `pet snippet create --description "Build and push"` — Create with description

### Reading
- `pet snippets list` — List all saved snippets
- `pet snippets search deploy` — Search snippets by keyword

### Managing
- `pet snippet edit` — Open snippets in editor for bulk editing
- `pet snippet exec -t docker` — Search and execute a snippet

### Sync
- `pet snippets sync` — Sync with Gist or GitLab Snippets

### Full Access
- `pet _ _` — Passthrough for any pet command

## Usage Examples
- "Save this docker-compose command as a snippet tagged docker"
- "Search for snippets related to deployment"
- "List all my saved snippets"
- "Execute the snippet tagged with docker"
- "Sync my snippets to GitHub Gist"

## Installation

```bash
brew install pet
```

## Key Features
- **Tag organization**: Tag snippets for easy filtering
- **Quick search**: Search by keyword across all snippets
- **Direct execution**: Search and run snippets without typing
- **Sync support**: Optional sync via Gist or GitLab Snippets
- **Go binary**: Single file, no runtime dependencies
