# Skills Catalog

SuperCLI can discover SKILL.md files from multiple local providers and expose them with stable `provider:id` identifiers.

This catalog is for **skill documents** (agent instructions), not executable command capabilities. Executable capabilities are still discovered/executed via normal command routing (`supercli <namespace> <resource> <action>` and `supercli inspect ...`).

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

## Built-in MCP Usage Skill (Agent-Friendly)

```bash
supercli skills get mcp.servers.usage
```

This built-in skill teaches non-human agents how to register, verify, and use MCP servers
through SuperCLI, including a browser-use style `mcp-remote` SSE bridge pattern with
runtime API-key passing.

## Notes

- IDs are always provider-qualified (`provider:id`) for future-proof disambiguation.
- Current provider types include `local_fs`, `repo_fs`, and `remote_static`.
- Existing capability-doc flow remains available (`skills list`, `skills get <ns.res.act>`, `skills teach`).

## Remote Provider Example: agency-agents

```bash
supercli plugins install agency-agents --json
supercli skills list --catalog --provider agency-agents --json
supercli skills get agency-agents:engineering.engineering-frontend-developer
```

`agency-agents` maps skills one-to-one to upstream `.md` files in
`msitarzewski/agency-agents`. If upstream paths change or files are removed,
individual skills may stop resolving until reinstalled/refreshed.

## Remote Provider Example: visual-explainer

```bash
supercli plugins install visual-explainer --json
supercli skills list --catalog --provider visual-explainer --json
supercli skills get visual-explainer:visual-explainer.skill
```

`visual-explainer` maps skills to normalized markdown files under
`plugins/visual-explainer-normalized` in `javimosch/visual-explainer`.

## Remote Provider Example: nullclaw

```bash
supercli plugins install nullclaw --json
supercli skills list --catalog --provider nullclaw --json
supercli skills get nullclaw:root.agents
supercli skills get nullclaw:docs.en.commands
```

`nullclaw` indexes curated upstream markdown from `nullclaw/nullclaw` so agents can pull
project overview, operator docs, security guidance, and implementation notes on demand.
It also exposes the local `nullclaw` binary through wrapped commands and full passthrough.

## Remote Provider Example: blogwatcher

```bash
supercli plugins install blogwatcher --json
supercli skills list --catalog --provider blogwatcher --json
supercli skills get blogwatcher:root.skill
supercli skills get blogwatcher:root.readme
```

`blogwatcher` indexes the upstream `SKILL.md` and `README.md` from `Hyaxia/blogwatcher`
so agents can learn the CLI workflow, storage model, and testing expectations on demand.
It also exposes the local `blogwatcher` binary through wrapped commands and passthrough.

## Remote Provider Example: xurl

```bash
supercli plugins install xurl --json
supercli skills list --catalog --provider xurl --json
supercli skills get xurl:root.skill
supercli skills get xurl:root.readme
```

`xurl` indexes the upstream `SKILL.md` and `README.md` from `xdevplatform/xurl`
so agents can learn safe X API workflows, auth constraints, and shortcut command patterns
without reading local token storage. It also exposes curated read-only wrappers for the local
`xurl` binary.

## Remote Provider Example: clix

```bash
supercli plugins install clix --json
supercli skills list --catalog --provider clix --json
supercli skills get clix:root.skill
supercli skills get clix:root.readme
```

`clix` indexes the upstream `SKILL.md` and `README.md` from `spideystreet/clix`
so agents can learn safe cookie-auth X workflows, JSON usage, and agent-mode guidance.
It also exposes curated read-only wrappers for the local `clix` binary.

## Local Repo Skill Example: cline-non-interactive

```bash
supercli skills sync --json
supercli skills list --catalog --provider repo --json
supercli skills get repo:cline-non-interactive
```

`cline-non-interactive` is a repository-local skill that teaches agents to prefer the wrapped
`supercli cline task run` and `supercli cline task plan` commands for unattended Cline usage.
