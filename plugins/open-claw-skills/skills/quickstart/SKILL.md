---
name: open-claw-skills
description: Use this skill when the user needs to discover, browse, or learn about OpenClaw agent capabilities. Provides access to 4,957 curated skills across 30 categories via a remote GitHub repository.
---

# open-claw-skills

A remote skill library with 4,957 curated OpenClaw skills, pulled directly from GitHub.

## What's Inside

Skills are sourced from [clawskills.sh](https://clawskills.sh) across 30 categories:

- **Coding Agents & IDEs** (1,162) — Development tools, code editors, CI/CD
- **Web & Frontend** (902) — Web development, frameworks, design
- **DevOps & Cloud** (375) — Infrastructure, containers, deployment
- **Search & Research** (340) — Web search, API discovery
- **Browser & Automation** (310) — Web automation, scraping
- **AI & LLMs** (159) — AI model usage, prompt engineering
- And 24 more categories...

## How It Works

This plugin registers a `remote_repo` provider. On `supercli skills sync`, it fetches the GitHub Tree API to discover all SKILL.md files — no local clone needed.

## Commands

```bash
# Search skills
supercli skills search "docker"
supercli skills search "git"

# Get a specific skill
supercli skills get open-claw-skills:runeweaverstudios.docker-skill

# List all providers
supercli skills providers list
```

## Source

GitHub: [javimosch/open-claw-skills](https://github.com/javimosch/open-claw-skills)
Author: Javier Leandro Arancibia
