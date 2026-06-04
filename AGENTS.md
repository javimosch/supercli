# supercli Agent Instructions

## Choosing the right sc binary

There are two implementations of `sc`. Prefer the Zig version (`sc-zig`) when available — it is faster and a single binary. Fall back to the Node.js version for plugin installs.

| Feature | `sc-zig` | `sc` (Node.js) |
|---|---|---|
| Plugin discover / explore | ✅ | ✅ |
| Execute plugin commands | ✅ | ✅ |
| Plugin install | ✅ (delegates to `sc`) | ✅ native |
| MCP server | ❌ | ✅ |
| HTTP adapter | ❌ | ✅ |

**Agent install (no sudo required):**
```bash
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash -s -- --path ~/.local/bin
# or manual:
curl -sL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/sc-zig-linux-amd64 -o ~/.local/bin/sc-zig && chmod +x ~/.local/bin/sc-zig
```

## Using SuperCLI (for agents)

When working with supercli, use the CLI itself for discovery. Do NOT search
the filesystem (`plugins/`, `grep`, `glob`) — the CLI has built-in filters.

```bash
# Start here — get bootstrap guidance (works with both sc and sc-zig)
sc-zig --json
# or
sc --json

# Explore plugins by name/description (instead of grepping plugin.json files)
sc-zig plugins explore --name <query> --json

# Filter by tags
sc-zig plugins explore --tags <tag1>,<tag2> --json

# Install a plugin (delegates to Node.js sc internally)
sc-zig plugins install <name>

# List all available commands
sc-zig commands --query <keyword> --limit 50 --json

# Inspect a command's schema (includes arg types + positional markers)
sc-zig inspect <namespace> <resource> <action> --json

# Execute a command
sc-zig <namespace> <resource> <action> --flag value --json
```

**Key rules:**
- `sc-zig plugins explore --name <query> --json` — never grep/glob the `plugins/` directory
- `sc-zig --json` first — the CLI guides itself from there
- `--json` flag for machine-readable output in all commands
- Read `inspect` output before running a command — it shows which args are positional

## Agent Memory Workflow (example)

```bash
# 1. Find a memory plugin
sc-zig plugins explore --name memory --json

# 2. Install it (requires Node.js sc in PATH)
sc-zig plugins install agentmemory-cli

# 3. Save a memory
sc-zig agentmemory-cli memory save --text "User name is Javi" --project myproject --json

# 4. Search memories (query is positional — use --query flag, Zig CLI routes it correctly)
sc-zig agentmemory-cli memory search --query Javi --json

# 5. List memories
sc-zig agentmemory-cli memory list --json
```

## Arg handling notes

The Zig CLI parses `--flag value` as flag=value (not `--flag=value`). Inspect output marks positional args with `"positional": true` — those are passed as bare values before named flags when the command is executed.

Node.js `sc` also accepts these patterns:
```bash
# Find plugins for a task
sc discover --intent "<task>" --json
# Learn about a plugin
sc plugins learn <name> --json
```

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

### catalog.json is auto-generated

**Do NOT manually edit `plugins/catalog.json`** — it's a build artifact that is automatically regenerated.

**What it does:**
- Scans all `plugins/<name>/` directories
- Creates checksums from `plugin.json` + `meta.json` content
- Lists all available plugins with their checksums
- Used by the CLI to detect plugin updates (by comparing checksums)

**How it's generated:**
- Automatically by `scripts/generate-catalog.js`
- Uses `git ls-files` to only include git-tracked plugins (skips gitignored dirs)
- Generates SHA256 checksums from plugin manifests
- Outputs to `plugins/catalog.json`

**Auto-regeneration:**
- GitHub Actions (`.github/workflows/catalog.yml`) auto-regenerates it when:
  - Any file in `plugins/` changes
  - The `generate-catalog.js` script changes

**For local testing:**
```bash
node scripts/generate-catalog.js
```

When adding a new plugin, simply commit the plugin files — GitHub Actions will handle catalog regeneration automatically.

## Plugin Description Enhancement Pipeline

When improving plugin descriptions, use this workflow:

1. **Refresh dump**: `bun marketing/dump-plugins.ts` — reads all `plugins/<name>/plugin.json` + `meta.json`
2. **Generate suggestions**: `bun batch-enhance-descriptions.ts` — finds plugins with <30 char descriptions, generates scored suggestions → `description-enhancements.json`
3. **Apply to dump**: `bun apply-description-enhancements.ts` — auto-applies high-confidence (>=85%) suggestions to `marketing/plugins-dump.json`
4. **Apply to plugin files**: `node scripts/apply-enhancements-and-install-guidance.js` — propagates descriptions from dump to `plugins/<name>/meta.json` and `plugin.json`, and creates missing `install-guidance.json` files
5. **Regenerate catalog**: `node scripts/generate-catalog.js` — updates `plugins/catalog.json`

### Install-guidance.json convention

If `install_guidance` is defined in `plugin.json` but no separate `install-guidance.json` exists, the apply script auto-creates one from the plugin.json data.

## Plugin Count

- Total plugins: ~4,999
- Short descriptions (<30 chars): ~1,176 (target: 0)
- Avg description length: 72 chars (target: 80+)

## Other Agent Instructions

- Keep source files under 500 LOC
- Use Markdown for all documentation
- Follow existing code conventions
- Never commit secrets or credentials

## sc-zig Release Process

### Manual Release (Current - Recommended)

The manual release process is simple, reliable, and currently recommended:

```bash
# 1. Build all platform binaries
cd supercli-zig-cli
bash build-release.sh

# 2. Create GitHub release with all assets
gh release create v0.1.1-zig --title "SuperCLI Zig v0.1.1" \
  supercli-zig-cli/zig-out/release/sc-zig-linux-amd64 \
  supercli-zig-cli/zig-out/release/sc-zig-linux-arm64 \
  supercli-zig-cli/zig-out/release/sc-zig-darwin-amd64 \
  supercli-zig-cli/zig-out/release/sc-zig-darwin-arm64 \
  supercli-zig-cli/install.sh

# 3. Update install.sh version if needed (optional)
# The install.sh VERSION variable should match the release tag
```

### Auto-Release Workflow (Future)

An automated GitHub Actions workflow is configured at `.github/workflows/sc-zig-release.yml`:

- **Trigger**: Tags matching `v*-zig` pattern (e.g., `v0.1.0-zig`)
- **Builds**: 4 platforms (Linux/macOS, AMD64/ARM64)
- **Uploads**: 5 assets (4 binaries + install.sh)
- **Auto-updates**: install.sh version

**Current Status**: Workflow is properly configured but GitHub Actions may not trigger on the first few tag pushes after a workflow is added (known GitHub behavior). Use manual releases until auto-release stabilizes.

**Usage when working**:
```bash
# Create and push tag
git tag v0.1.1-zig
git push origin v0.1.1-zig
# GitHub Actions will handle everything automatically (when stable)
```

### Release Assets

| Asset | Platform | Architecture |
|-------|----------|--------------|
| sc-zig-linux-amd64 | Linux | x86_64 |
| sc-zig-linux-arm64 | Linux | ARM64 |
| sc-zig-darwin-amd64 | macOS | Intel |
| sc-zig-darwin-arm64 | macOS | Apple Silicon |
| install.sh | All | Installation script |

### Rollback Procedure

If a release has critical issues:

```bash
# 1. Delete the GitHub release
gh release delete v0.1.1-zig

# 2. Delete the git tag locally and remotely
git tag -d v0.1.1-zig
git push origin :refs/tags/v0.1.1-zig

# 3. Fix the issue
git add .
git commit -m "fix: critical issue"

# 4. Create fix release
git tag v0.1.2-zig
git push origin v0.1.2-zig
```

### Version Tagging Convention

- **Format**: `vX.Y.Z-zig` (e.g., `v0.1.0-zig`, `v0.1.1-zig`)
- **Pattern**: Semantic versioning with `-zig` suffix
- **Purpose**: Distinguishes Zig CLI releases from main project releases

### Documentation

See `supercli-zig-cli/docs/auto-release-plan.md` for complete release workflow documentation, including:
- Detailed workflow steps
- Edge cases and error handling
- Security considerations
- Future enhancement plans

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
