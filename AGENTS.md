# supercli Agent Instructions

## Adding a New Bundled Plugin

When adding a new bundled plugin, create files ONLY inside `plugins/<name>/`.
**Never edit** `plugins/plugins.json` or `cli/plugin-install-guidance.js` for new bundled plugins.

### Required files

1. **`plugins/<name>/plugin.json`** — Manifest with metadata, checks, commands
2. **`plugins/<name>/meta.json`** — Registry metadata:
   ```json
   {
     "description": "Plugin description for registry discovery",
     "tags": ["tag1", "tag2"],
     "has_learn": true
   }
   ```

### Optional files

- **`plugins/<name>/install-guidance.json`** — Install steps (if not embedded in meta.json):
  ```json
  {
    "plugin": "name",
    "binary": "binary-name",
    "check": "binary --version",
    "install_steps": ["step1", "step2"],
    "note": "Optional note"
  }
  ```
- **`plugins/<name>/skills/quickstart/SKILL.md`** — Agent usage guide (set `has_learn: true` in meta.json)
- **`plugins/<name>/README.md`** — Human documentation

### Why this convention?

The old method required editing shared files (`plugins/plugins.json`, `cli/plugin-install-guidance.js`)
which caused merge conflicts between parallel plugin PRs. The new `meta.json` convention keeps each
plugin fully isolated — adding a plugin is just creating files in its own directory.

Existing plugins using the old method continue to work (retrocompatible), but all new bundled plugins
must use the isolated approach.

### Quick example: adding a "mytool" plugin

```
plugins/mytool/
├── plugin.json              # Required: manifest with commands
├── meta.json                # Required: description, tags, has_learn
├── install-guidance.json    # Optional: install steps
├── skills/quickstart/SKILL.md  # Optional: agent guide (if has_learn: true)
└── README.md                # Optional: human docs
```

No edits to any file outside `plugins/mytool/` are needed.

## Other Agent Instructions

- Keep source files under 500 LOC
- Use Markdown for all documentation
- Follow existing code conventions
- Never commit secrets or credentials

## Codebase Exploration

When exploring or preparing context from a codebase for LLM consumption, use **yek** to serialize files efficiently.

### Quick Setup
```bash
# Install yek plugin
sc plugins install yek

# Sync skills to make yek skill available
sc skills sync

# Search for yek skill
sc skills search --query yek

# Load yek quickstart skill
sc skills teach yek:quickstart
```

### Usage
```bash
# Serialize entire repo for LLM (with token limit)
yek --tokens 128k

# JSON output for AI pipelines
yek --json --max-size 100KB

# Specific directory with glob patterns
yek "src/**/*.ts" "tests/*.rs"

# Show directory tree only
yek --tree-only
```

See `sc skills get yek` for full command reference.
