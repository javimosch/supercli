# Plugins

supercli supports plugin discovery through auto-discovery of bundled manifests at `plugins/*/plugin.json` plus optional per-plugin metadata files.

## How Discovery Works

### Bundled plugins (auto-discovered)

Any directory under `plugins/` containing a `plugin.json` is automatically discovered as a bundled plugin.

For registry metadata (description, tags, learn content), the system checks:

1. **`plugins/<name>/meta.json`** (preferred — isolated, no shared file edits)
2. **`plugins/<name>/plugin.json`** (fallback for description and install_guidance)

### Registry entries (legacy + remote)

`plugins/plugins.json` contains curated registry entries. This file is used for:
- Legacy bundled plugins that haven't migrated to `meta.json`
- Remote git-sourced plugins (type: "git")

**Do not add new bundled plugin entries to this file.** Use `meta.json` in the plugin directory instead.

## Adding a New Bundled Plugin

Create files ONLY inside `plugins/<name>/`:

```
plugins/my-plugin/
├── plugin.json              # Required: manifest
├── meta.json                # Required: description, tags, has_learn
├── install-guidance.json    # Optional: install steps
└── skills/quickstart/SKILL.md  # Optional: agent guide
```

No edits to `plugins/plugins.json` or `cli/plugin-install-guidance.js` are needed.

See [AGENTS.md](../AGENTS.md) for the full isolated plugin convention.

## Plugin Commands

```bash
supercli plugins list
supercli plugins explore
supercli plugins explore --name commiat
supercli plugins explore --tags git,ai
supercli plugins explore --has-learn true --installed false --source bundled --limit 10 --json
supercli plugins learn <plugin-name>
supercli plugins install <plugin-name>
supercli plugins install --git https://github.com/org/repo.git --manifest-path plugins/supercli/plugin.json --ref main
supercli plugins show <plugin-name>
supercli plugins doctor
supercli plugins doctor <plugin-name>
supercli plugins remove <plugin-name>
```

Install conflict policy:

```bash
supercli plugins install <plugin-name> --on-conflict fail
supercli plugins install <plugin-name> --on-conflict skip
supercli plugins install <plugin-name> --on-conflict replace
```

Default is `fail`.

## Command Reference

| Command | Description |
|---------|-------------|
| `plugins list` | Show installed plugins |
| `plugins explore` | Show discoverable plugins (merged: registry + bundled manifests) |
| `plugins explore --json` | Includes `has_learn`, `installed`, `filters` metadata for agent prioritization |
| `plugins learn <name>` | Print plugin-provided learning content (before or after install) |
| `plugins install <name>` | Install from local path, registry name, or direct remote git manifest |

### Exploration Filters

```bash
supercli plugins explore --name <query>                  # Filter by name/description
supercli plugins explore --tags <tag1>,<tag2>            # Filter by tags
supercli plugins explore --has-learn true --installed false --source bundled --limit 10 --json
```

## Plugin Manifest Features

- **`learn` content** — Define via `learn.text` (inline) or `learn.file` (path inside plugin folder).
- **`post_install` hooks** — `script`, optional `runtime`, optional `timeout_ms`. Execute from the plugin folder after install.
- **`install_guidance`** — Plugin-specific setup guidance without core edits in `cli/plugin-install-guidance.js`.

## Notable Bundled Plugins

### Remote Skill-Document Providers

| Plugin | Type | What It Does |
|--------|------|-------------|
| `agency-agents` | Zero-command | Adds remote skill-doc provider from `msitarzewski/agency-agents` |
| `visual-explainer` | Zero-command | Adds remote skill-doc provider from `javimosch/visual-explainer` (normalized markdown) |

### Hybrid Plugins (MCP + Direct Commands)

| Plugin | What It Does |
|--------|-------------|
| `browser-use` | Auto-registers `browser-use` MCP server, binds MCP tools into `browseruse.tool.*` commands, installs local skill documents |
| `cocoindex-code` | Auto-registers local `cocoindex-code` MCP server, exposes `cocoindex.code.search` for fast direct search, keeps `cocoindex.mcp.search` for MCP-native flows |

### Full-CLI Plugins

| Plugin | CLI Coverage | Notes |
|--------|-------------|-------|
| `squirrelscan` | Docker-backed, broad coverage (`audit`, `crawl`, `analyze`, `report`, `auth`, `config`, `init`, `feedback`, `self`, `skills`) + passthrough | Lazily builds pinned local image on first use for fast repeat scans |
| `openhands` | OpenHands headless workflows (`task run`, `task file`, `task json`) + passthrough | Full CLI coverage |
| `uipathcli` | UiPath automation lifecycle (`project pack`, `project analyze`, `project deploy`) + passthrough | Full CLI coverage |
