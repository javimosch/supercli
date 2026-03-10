# Plugins

DCLI supports plugin discovery through the registry file at `plugins/plugins.json`.

Plugin owners can submit PRs that add or update metadata in this registry:

- `name`
- `description`
- `tags`
- `source` (`bundled` path or remote `git` repo + manifest path)

## Plugin Commands

```bash
dcli plugins list
dcli plugins explore
dcli plugins explore --name commiat
dcli plugins explore --tags git,ai
dcli plugins install <plugin-name>
dcli plugins install --git https://github.com/org/repo.git --manifest-path plugins/supercli/plugin.json --ref main
dcli plugins show <plugin-name>
dcli plugins doctor
dcli plugins doctor <plugin-name>
dcli plugins remove <plugin-name>
```

Install conflict policy:

```bash
dcli plugins install <plugin-name> --on-conflict fail
dcli plugins install <plugin-name> --on-conflict skip
dcli plugins install <plugin-name> --on-conflict replace
```

Default is `fail`.

## Notes

- `plugins list` shows installed plugins.
- `plugins explore` shows discoverable plugins from `plugins/plugins.json`.
- `plugins install` supports local path, registry name, and direct remote git manifest installs.
- Plugin manifests can define `post_install` hooks (`script`, optional `runtime`, optional `timeout_ms`) that execute from the plugin folder after install.
- `agency-agents` is a bundled zero-command plugin. Installing it adds a remote skills provider named `agency-agents` and refreshes the local skills catalog.
- `visual-explainer` is a bundled zero-command plugin. Installing it adds a remote skills provider named `visual-explainer` sourced from normalized markdown skills in `javimosch/visual-explainer` and refreshes the local skills catalog.
- For baked AI guidance: use `supercli skills get plugins.registry.usage --format skill.md` for plugin install workflows and `supercli skills get plugins.harness.create --format skill.md` for plugin creation workflows.
