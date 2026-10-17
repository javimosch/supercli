---
name: changesets
description: Use this skill when the user wants to manage semantic versioning and changelogs for monorepo projects.
---

# changesets Plugin

changesets manages versioning and changelogs for monorepos.

## Commands
- `changesets <resource> <action>` — Execute changesets commands
- `changesets self version` — Print changesets version
- `changesets _ _` — Passthrough to changesets CLI

## Usage Examples

- "create a new changeset for a feature"
- "version all packages with pending changesets"
- "publish updated packages to npm"
- "generate changelog from changesets"

## Installation

```bash
npm install -g @changesets/cli
```

## Key Features
- Changeset-based versioning workflow
- Semantic versioning support
- Monorepo-aware version bumps
- Automated changelog generation
- GitHub Actions integration
- Package publishing automation
