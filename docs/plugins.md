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

## Notes

- `plugins list` shows installed plugins.
- `plugins explore` shows discoverable plugins from merged sources: curated registry entries plus bundled manifest auto-discovery.
- `plugins explore` supports filters: `--name`, `--tags`, `--has-learn true|false`, `--installed true|false`, `--source bundled|git`, `--limit <n>`.
- `plugins explore --json` includes `has_learn`, `installed`, and `filters` metadata so agents can prioritize plugins with learning content.
- `plugins learn <name>` prints plugin-provided learning content before or after install.
- `plugins install` supports local path, registry name, and direct remote git manifest installs.
- Plugin manifests can define `learn` content via `learn.text` or `learn.file` (path inside plugin folder).
- Plugin manifests can define `post_install` hooks (`script`, optional `runtime`, optional `timeout_ms`) that execute from the plugin folder after install.
- Plugin manifests can define `install_guidance` so plugin-specific setup guidance does not require core edits in `cli/plugin-install-guidance.js`.
- `agency-agents` is a bundled zero-command plugin. Installing it adds a remote skill-document provider named `agency-agents` and refreshes the local skill-doc catalog.
- `visual-explainer` is a bundled zero-command plugin. Installing it adds a remote skill-document provider named `visual-explainer` sourced from normalized markdown skill documents in `javimosch/visual-explainer` and refreshes the local skill-doc catalog.
- `browser-use` is a bundled hybrid plugin. Installing it auto-registers a `browser-use` MCP server, discovers and binds Browser Use MCP tools into direct `browseruse.tool.*` commands, and installs local Browser Use skill documents from the plugin folder.
- `cocoindex-code` is a bundled hybrid plugin. Installing it auto-registers a local `cocoindex-code` MCP server, exposes fast direct search via `cocoindex.code.search`, keeps `cocoindex.mcp.search` for MCP-native flows, and installs local quickstart skill documents.
- `squirrelscan` is a bundled Docker-backed plugin with broad CLI coverage (`audit`, `crawl`, `analyze`, `report`, `auth`, `config`, `init`, `feedback`, `self`, `skills`) plus passthrough. It lazily builds a pinned local image on first use, then reuses it for fast repeat scans (example: `supercli squirrel audit https://example.com -C quick`).
- `openhands` is a bundled plugin for OpenHands headless workflows (`task run`, `task file`, `task json`) plus passthrough for full CLI coverage.
- `uipathcli` is a bundled plugin for UiPath automation lifecycle wrappers (`project pack`, `project analyze`, `project deploy`) plus passthrough.
