---
name: plugin-migration
description: Migrate bundled plugins from legacy centralized pattern to isolated meta.json format
---

## When to Use

When adding a new bundled plugin or migrating an existing one to the isolated pattern.

## Required Files

### 1. `plugins/<name>/plugin.json`
Manifest with commands, checks, and adapter configuration. Keep minimal metadata here.

### 2. `plugins/<name>/meta.json`
Registry metadata for discovery:
```json
{
  "description": "Plugin description for registry discovery",
  "tags": ["tag1", "tag2"],
  "has_learn": true
}
```

## Optional Files

### `plugins/<name>/install-guidance.json`
Install steps (if not embedded in meta.json):
```json
{
  "plugin": "name",
  "binary": "binary-name",
  "check": "binary --version",
  "install_steps": ["step1", "step2"],
  "note": "Optional note"
}
```

### `plugins/<name>/skills/quickstart/SKILL.md`
Agent usage guide. Set `has_learn: true` in meta.json to enable.

### `plugins/<name>/README.md`
Human documentation.

## Migration Checklist

### 1. Create meta.json
Extract `description`, `tags`, and `has_learn` from `plugin.json` or `plugins/plugins.json`.

### 2. Create install-guidance.json (if needed)
Move `install_guidance` from `plugin.json` to separate file.

### 3. Update plugin.json
- Remove `install_guidance` block
- Remove `learn` block (use `meta.json` instead)
- Keep only commands, checks, and minimal metadata

### 4. Verify no centralized files
Ensure the plugin is NOT in:
- `plugins/plugins.json` (centralized registry)
- `cli/plugin-install-guidance.js` (legacy guidance map)

### 5. Test
Run: `npm run test:unit -- --testPathPatterns=<plugin-name> --testTimeout=15000`

## Why Isolated?

The old method required editing shared files (`plugins/plugins.json`, `cli/plugin-install-guidance.js`) which caused merge conflicts between parallel plugin PRs. The new `meta.json` convention keeps each plugin fully isolated — adding a plugin is just creating files in its own directory.

## Code Support

The codebase already supports the isolated pattern:
- `cli/plugins-registry.js:87-106` — reads `meta.json` for bundled plugins
- `cli/plugins-learn.js` — falls back to `meta.json` for `has_learn` and default skill path
- `cli/plugin-install-guidance.js:498-506` — checks `meta.json` for install guidance
