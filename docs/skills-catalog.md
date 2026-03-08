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
- Current provider types include `local_fs`, `repo_fs`, and `remote_static`.
- Existing command-skill flow remains available (`skills list`, `skills get <ns.res.act>`, `skills teach`).

## Remote Provider Example: agency-agents

```bash
supercli plugins install agency-agents --json
supercli skills list --catalog --provider agency-agents --json
supercli skills get agency-agents:engineering.engineering-frontend-developer
```

`agency-agents` maps skills one-to-one to upstream `.md` files in
`msitarzewski/agency-agents`. If upstream paths change or files are removed,
individual skills may stop resolving until reinstalled/refreshed.
