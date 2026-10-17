---
description: Agent quickstart for using the squirrelscan Docker plugin in supercli.
tags: squirrelscan,seo,audit,docker,plugin,quickstart
---

# SquirrelScan Quickstart

Use this when you need a fast website audit through `supercli`.

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

## Install and verify

```bash
supercli plugins install ./plugins/squirrelscan --json
supercli plugins doctor squirrelscan --json
```

## Recommended command

```bash
supercli squirrel audit https://example.com -C quick
```

## Structured equivalent

```bash
supercli squirrel audit run --url https://example.com --coverage quick
```

## Useful follow-ups

```bash
supercli squirrel report list
supercli squirrel report show --format llm
supercli squirrel report show --format json --output report.json
```

## Notes

- First run can be slower because the plugin builds a local Docker image.
- Later runs are faster due to local image and volume reuse.
- If you need full CLI behavior not wrapped by structured commands, use passthrough (`supercli squirrel ...`).
