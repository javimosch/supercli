# supercli-zig-cli

A clean-room Zig 0.16.0 implementation of the SuperCLI core CLI (`sc`).

Reads the same `~/.supercli/plugins/plugins.lock.json` as the Node.js implementation.
No Node.js, no npm — a single static binary.

## Installation

### Quick Install (curl)

```bash
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash
```

This installs as `sc-zig` (co-exists with Node.js `sc`).

### Install and replace Node.js version

```bash
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash -s -- --replace
```

This replaces the Node.js `sc` command with the Zig version.

### NPM (Node.js version)

```bash
npm install -g superacli  # Node.js version, slower
```

### Build from source

Requires Zig 0.16.0.

```sh
cd supercli-zig-cli
zig build
# binary: zig-out/bin/sc-zig
```

For a release build:

```sh
zig build --release=small
```

## Progressive Adoption

The Zig CLI is designed for progressive adoption:

1. **Co-existence**: Default install as `sc-zig` doesn't conflict with Node.js `sc`
2. **Optional replacement**: Use `--replace` flag to replace Node.js `sc` when ready
3. **Easy revert**: `npm uninstall -g supercli && npm install -g supercli` to go back to Node.js

### Check which version you're using

```bash
# Zig version
sc --version
# Output: SuperCLI (Zig) v0.1.0

# Node.js version (if still installed)
sc --version
# Output: different version info
```

### Replace Node.js with Zig version

```bash
# Option 1: During install
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash -s -- --replace

# Option 2: After install
sc-zig install-as-sc
sudo ln -sf /usr/local/bin/sc-zig /usr/local/bin/sc
```

### Revert to Node.js version

```bash
npm uninstall -g supercli
npm install -g supercli
```

## Features

- `sc-zig` / `sc` — agent bootstrap (JSON envelope with version + first_steps)
- `sc-zig --version` / `sc-zig --info` — show version and implementation (Zig vs Node.js)
- `sc-zig install-as-sc` — instructions to replace Node.js `sc` with Zig binary
- `sc-zig commands [--query=<q>] [--limit=<n>] [--json]` — list all installed commands
- `sc-zig inspect <ns> <res> <act> [--json]` — inspect a command's schema
- `sc-zig plugins list [--json]` — list installed plugins (from lockfile)
- `sc-zig plugins explore [--name=<q>] [--json]` — browse bundled plugins directory (4000+ plugins)
- `sc-zig plugins update [--check] [--force] [--json]` — update bundled plugins via curl + tar
- `sc-zig <ns> [res] [act] [--flags]` — dispatch a process-adapter command

## Usage

```sh
# Bootstrap (JSON envelope)
sc --json

# Check version
sc --version

# List installed plugins (from lockfile)
sc plugins list --json

# List bundled plugins (3300+ plugins)
sc plugins explore --json

# List all commands
sc commands --json

# Filter commands
sc commands --query=git --limit=10 --json

# Inspect a command
sc inspect yek serialize run --json

# Run a plugin command
sc yek serialize run --json

# Update plugins
sc plugins update --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--json` | Force JSON output |
| `--human` | Force human-readable output |
| `--compact` | Compact mode (not yet implemented) |
| `--query=<str>` | Filter commands by keyword |
| `--limit=<n>` | Limit results |
| `--check` | Check-only mode for `plugins update` |
| `--force` | Force re-download for `plugins update` |

**Note:** Use `--key=value` form for flags that take a value (e.g. `--limit=5`, not `--limit 5`).

## Storage compatibility

Both Node.js and Zig implementations read from:
- `~/.supercli/plugins/plugins.lock.json` — installed plugin registry
- `{root}/plugins/` — bundled plugins directory (4000+ plugins)

## Architecture

| File | Description |
|------|-------------|
| `src/main.zig` | Entry point, arg parsing, command dispatch |
| `src/config.zig` | Reads `plugins.lock.json` |
| `src/registry.zig` | Discovers bundled plugins in `plugins/` directory |
| `src/executor.zig` | Process adapter — spawns and captures subprocess output |
| `src/update.zig` | `plugins update` — fetch catalog, diff, download tarball, extract |
| `src/output.zig` | JSON/human output helpers, error envelope |
| `build.zig` | Zig build system |

## Excluded

- MCP server, MCP daemon
- `sc server` / HTTP adapter
- Plugin installation from registry (use `sc plugins install` via Node.js)

## Performance

The Zig version is significantly faster than the Node.js version:
- No Node.js startup overhead
- Single static binary (no node_modules)
- Direct binary execution

## Version Compatibility

- Zig version: v0.1.0 (targeting Zig 0.16.0)
- Node.js version: tracks main supercli releases
- Both read the same `plugins.lock.json` format
- Both support the same plugin storage structure
