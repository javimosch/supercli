# Skills Catalog

SuperCLI can discover SKILL.md files from multiple local providers and expose them with stable `provider:id` identifiers.

## Provider Commands

```bash
supercli skills providers list --json
supercli skills providers add --name mykb --type local_fs --roots /path/to/skills
supercli skills providers show --name mykb --json
supercli skills providers remove --name mykb --json
```

## Build Local Catalog

```bash
supercli skills sync --json
```

This scans enabled provider roots for `SKILL.md` files and rebuilds the local index.

## Query Catalog Skills

```bash
supercli skills list --catalog --json
supercli skills search --query "planning" --json
supercli skills get opencode:plan-changes
```

## Notes

- IDs are always provider-qualified (`provider:id`) for future-proof disambiguation.
- Current scope is local-only providers (`local_fs`, `repo_fs`).
- Existing command-skill flow remains available (`skills list`, `skills get <ns.res.act>`, `skills teach`).
