---
description: Run crawl/analyze/report workflow with squirrelscan using supercli.
tags: squirrelscan,audit,crawl,analyze,report,workflow
---

# SquirrelScan Audit Workflow

Use this to separate crawling, analysis, and reporting.

## Commands
- `squirrelscan <resource> <action>` — Execute squirrelscan commands
- `squirrel audit run` — Run website audit (crawl and analyze)
- `squirrel crawl run` — Crawl website without analysis
- `squirrel analyze run` — Analyze latest or selected crawl
- `squirrel report show` — Show latest or selected report
- `squirrel report list` — List recent reports
- `squirrel report publish` — Publish latest or selected report
- `squirrel auth login` — Authenticate for report publishing
- `squirrel auth logout` — Sign out and revoke token
- `squirrel auth status` — Show authentication status
- `squirrel config show` — Show current configuration
- `squirrel config set` — Set config key to value
- `squirrel config path` — Print active config file path
- `squirrel config validate` — Validate configuration file
- `squirrel init project` — Initialize squirrel.toml in current directory
- `squirrel feedback send` — Send interactive feedback
- `squirrel self install` — Install squirrel CLI files in container
- `squirrel self update` — Check for or install updates
- `squirrel self completion` — Generate shell completion script
- `squirrel self doctor` — Run squirrel health checks
- `squirrel self version` — Show squirrel version info
- `squirrel self uninstall` — Uninstall squirrel from container
- `squirrel settings show` — Show squirrel self settings
- `squirrel settings set` — Set squirrel self setting
- `squirrel skills install` — Install squirrelscan coding-agent skill
- `squirrel skills update` — Update squirrelscan coding-agent skill
- `squirrel _ _` — Passthrough to any squirrel CLI command in Docker

## Crawl only

```bash
supercli squirrel crawl run --url https://example.com --max-pages 200
```

## Analyze latest crawl

```bash
supercli squirrel analyze run
```

## View and export report

```bash
supercli squirrel report show --format markdown --output report.md
supercli squirrel report show --severity error
```

## Compare regressions

```bash
supercli squirrel report show --regression-since https://example.com --format llm
```
