---
name: goose-skills
description: Use this skill when the user needs GTM (Go-to-Market) tasks — sales research, competitor analysis, SEO, ad campaigns, lead generation, Reddit monitoring, and marketing content creation.
---

# Goose Skills — 207 GTM Skills for AI Agents

Growth & GTM skills from [gooseworks-ai/goose-skills](https://github.com/gooseworks-ai/goose-skills). Auto-discovered via `remote_repo` provider.

## Quick Start

```bash
sc goose-skills self setup      # Register provider + sync 207 skills
sc goose-skills self search     # Search skills by keyword
sc goose-skills self status     # Check indexed count
```

## Searching Skills

```bash
# Search across all goose-skills
sc skills search "reddit" --provider goose-skills
sc skills search "competitor" --provider goose-skills
sc skills search "seo" --provider goose-skills
sc skills search "ads" --provider goose-skills
```

## Getting a Skill

```bash
# Get full skill content
sc skills get goose-skills:capabilities.reddit-post-finder
sc skills get goose-skills:capabilities.competitor-research
sc skills get goose-skills:composites.seo-content-strategy
```

## Skill Categories

- **Capabilities** (51): Atomic single-purpose tools — reddit scraper, apollo finder, brand monitor, SEO analyzer
- **Composites** (52): Multi-skill chains — campaign builder, competitor intel, content strategy
- **Playbooks** (5): End-to-end workflows — go-to-market, product launch
- **Packs** (variable): Grouped collections

## Tips

- Skills are fetched on-demand from raw.githubusercontent.com
- Run `sc goose-skills self sync` periodically to refresh
- Use `sc skills search --provider goose-skills` for full-text search
- Combine with other plugins for execution (e.g. playwright-mcp for browser, agentmemory-cli for storing leads)
