# Zig CLI Alignment Plan — Replace Node.js CLI

**Goal:** Make `sc-zig` feature-complete with the Node.js `sc` CLI, then replace it as the default `sc` binary. Server features are deprioritized and may be dropped.

---

## Current State

### Zig CLI has (✅)
- `--version` / `--info` — version info
- Bootstrap (no args) — agent JSON envelope
- `commands` — list/filter commands (--query, --limit, --json)
- `inspect <ns> <res> <act>` — command schema
- `plugins list` — installed plugins from lockfile
- `plugins explore` — browse bundled registry (--name, --tags, --limit, --installed)
- `plugins install <name>` — delegates to Node.js `sc plugins install`
- `plugins update` — fetch catalog, diff, download tarball, extract
- `install-as-sc` — replace Node.js sc instructions
- Namespace dispatch (ns res act) — process adapter execution
- Passthrough dispatch — raw arg forwarding
- `--json` / `--human` output modes
- Error envelope matching Node.js format
- Non-TTY safety validation

### Zig CLI is missing (❌)
| # | Feature | Node.js file | Priority |
|---|---------|-------------|----------|
| 1 | `plugins remove <name>` | `cli/plugins-install.js:228` | P0 |
| 2 | `plugins show <name>` | `cli/plugins-command.js:224` | P0 |
| 3 | `plugins learn <name>` | `cli/plugins-learn.js` | P0 |
| 4 | `plugins doctor [name]` | `cli/plugins-doctor.js` | P1 |
| 5 | `discover --intent "<task>"` | `cli/discover.js` | P0 |
| 6 | `run <plugin> <res> <act>` | `cli/run.js` | P1 |
| 7 | `skills sync` | `cli/skills.js` | P1 |
| 8 | `skills list --catalog` | `cli/skills.js` | P1 |
| 9 | `skills search --query` | `cli/skills.js` | P1 |
| 10 | `skills get <id>` | `cli/skills.js` | P1 |
| 11 | `onboard --detect` / `onboard --harness` | `cli/harness-onboard.js` | P2 |
| 12 | `offboard` | `cli/harness-onboard.js` | P2 |
| 13 | `config show` | `cli/config.js` | P2 |
| 14 | `plan <ns> <res> <act>` | `cli/execute-handler.js` | P2 |
| 15 | `--help` / `--help-json` | `cli/help.js` | P1 |
| 16 | Namespace browse (1-2 positionals) | `cli/commands-handler.js:127` | P1 |
| 17 | `--schema` flag on ns.res.act | `cli/supercli.js:243` | P2 |
| 18 | `daemon start/stop/status` | `cli/daemon.js` | P2 |
| 19 | Lockfile write (install/remove) | `cli/plugins-store.js` | P0 |
| 20 | `--name-only` filter on explore | `cli/plugins-command.js:93` | P2 |
| 21 | `--offset` pagination on explore/commands | `cli/plugins-command.js:113` | P2 |
| 22 | `--source` filter on explore | `cli/plugins-command.js:99` | P2 |
| 23 | `--has-learn` filter on explore | `cli/plugins-command.js:94` | P2 |
| 24 | `--namespace/--resource/--action` filters on commands | `cli/commands-handler.js:5-8` | P2 |
| 25 | `args` field in `commands` output | `cli/commands-handler.js:33` | P1 |
| 26 | `args` field in `inspect` output (parsed) | `cli/commands-handler.js` | P1 |
| 27 | `_warning` auto-limit on explore/commands | `cli/plugins-command.js:196` | P2 |

### Server features (deprioritized — may drop)
| Feature | Node.js file | Status |
|---------|-------------|--------|
| `sc server` | `cli/server-command.js` | Drop |
| `--server` flag / SUPERCLI_SERVER | `cli/supercli.js:25` | Drop |
| `sc sync` | `cli/supercli.js:156` | Drop |
| `sc mcp` | `cli/mcp-local.js` | Drop |
| `sc execute <plan_id>` | `cli/execute-handler.js` | Drop |
| MCP daemon | `cli/mcp-daemon.js` | Drop |
| MCP stdio JSON-RPC | `cli/mcp-stdio-jsonrpc.js` | Drop |
| MCP discovery | `cli/mcp-discovery.js` | Drop |
| MCP diagnostics | `cli/mcp-diagnostics.js` | Drop |
| `sc ask` (LLM suggestions) | `cli/ask.js` | Drop (requires LLM endpoint) |

---

## Implementation Phases

### Phase 1 — Core Plugin Management (P0)
**Goal:** Zig CLI can install, remove, show, and learn plugins without Node.js.

#### 1.1 Lockfile Write Support
- **File:** `src/config.zig`
- Add `writeLock()` function that serializes the `Lock` struct back to `plugins.lock.json`
- Must handle the `installed` object map format (not array)
- Include file locking (flock) to prevent concurrent corruption — fixes gap #2 from `gaps.md`
- ~80 LOC addition

#### 1.2 `plugins remove <name>`
- **New file:** `src/handlers/plugins.zig` (extend existing)
- Read lock → remove plugin entry → write lock
- Support `--force` flag to skip post-uninstall hook failures
- ~40 LOC addition

#### 1.3 `plugins show <name>`
- **Extend:** `src/handlers/plugins.zig`
- Look up plugin in lockfile, output full detail (name, version, description, source, commands list)
- ~30 LOC addition

#### 1.4 `plugins learn <name>`
- **New file:** `src/handlers/learn.zig`
- Resolve manifest from: installed plugin → bundled registry → git (if source is git)
- Read `learn` field from manifest (string, file path, or meta.json `has_learn` → `skills/quickstart/SKILL.md`)
- Output markdown content
- ~120 LOC (new file)

#### 1.5 Native `plugins install` (stop delegating to Node.js)
- **Extend:** `src/handlers/plugins.zig`
- Replace current delegation to `sc plugins install` with native implementation:
  - Resolve plugin from bundled registry or git
  - Parse `plugin.json` manifest
  - Handle conflict detection (--on-conflict fail|skip|replace)
  - Write to lockfile
  - Skip post-install hooks (Node.js hooks) — document this limitation
- ~150 LOC addition

### Phase 2 — Discovery & Help (P0/P1)
**Goal:** Agents can discover plugins and get help without Node.js.

#### 2.1 `discover --intent "<task>"`
- **New file:** `src/handlers/discover.zig`
- Tokenize intent (split, lowercase, remove stopwords, apply synonyms)
- Score plugins by name/tag/description/keyword hits
- Return ranked list with next_steps
- ~130 LOC (new file)

#### 2.2 `--help` / `--help-json`
- **New file:** `src/handlers/help.zig`
- Static JSON help envelope (commands reference, exit codes, output formats)
- Human-readable help (subcommand list)
- ~80 LOC (new file)

#### 2.3 Namespace browse (1-2 positionals)
- **Extend:** `src/main.zig`
- When 1 positional: list all resources/actions under that namespace
- When 2 positionals: list all actions under namespace.resource
- ~50 LOC addition

#### 2.4 Enrich `commands` and `inspect` output
- **Extend:** `src/handlers/commands.zig`
- Add `args` field to command output (parsed arg names with required marker)
- Add `--namespace`, `--resource`, `--action` filter flags
- Add `--offset` pagination
- Add auto-limit warning when no --limit specified in JSON mode
- ~60 LOC addition

### Phase 3 — Skills System (P1)
**Goal:** Skill documents are accessible from the Zig CLI.

#### 3.1 Skills catalog
- **New file:** `src/handlers/skills.zig`
- `skills sync` — scan skill providers, build index at `~/.supercli/skills/index.json`
- `skills list --catalog` — list from index
- `skills search --query` — search index
- `skills get <id>` — read skill markdown
- Skill providers: `~/.supercli/skills/`, bundled `skills/` directory
- ~200 LOC (new file, may need splitting)

### Phase 4 — Quality & Polish (P2)
**Goal:** Feature parity for remaining commands.

#### 4.1 `run <plugin> <res> <act>`
- One-shot: update catalog → install plugin → execute
- Combines existing `plugins update` + `plugins install` + execute
- ~60 LOC (extend main.zig)

#### 4.2 `plugins doctor [name]`
- Check binary availability for plugin commands
- Spawn `binary --version` with timeout
- ~80 LOC (new handler)

#### 4.3 `onboard` / `offboard`
- Detect harness directories (.claude, .opencode, .cursor, .windsurf)
- Copy compiled skill files
- ~100 LOC (new handler)

#### 4.4 `config show`
- Output lockfile path, plugin count, command count
- ~20 LOC

#### 4.5 `plan <ns> <res> <act>`
- Preview execution steps (dry-run)
- Show command, args, adapter info
- ~40 LOC

#### 4.6 Explore filter enhancements
- `--name-only`, `--source`, `--has-learn`, `--offset`
- ~40 LOC addition to plugins.zig

#### 4.7 `daemon start/stop/status`
- PID file management at `~/.supercli/daemon.pid`
- ~60 LOC

---

## Architecture Decisions

### Keep
- `src/main.zig` as pure router — all logic in handlers
- `src/config.zig` for lockfile read/write
- `src/registry.zig` for bundled plugin discovery
- `src/executor.zig` for process adapter
- `src/output.zig` for JSON/human output
- `src/args.zig` for argument parsing
- `src/update.zig` for plugin updates

### Add
- `src/handlers/discover.zig` — intent-based plugin discovery
- `src/handlers/learn.zig` — plugin learn content
- `src/handlers/skills.zig` — skills catalog
- `src/handlers/help.zig` — help output
- `src/handlers/doctor.zig` — plugin health checks
- `src/handlers/onboard.zig` — harness onboarding
- `src/lockfile.zig` — lockfile write support (split from config.zig if it exceeds 500 LOC)

### Drop (server features)
- No MCP server, MCP daemon, HTTP adapter
- No `sc server`, `sc sync`, `sc mcp`
- No `sc ask` (requires LLM endpoint)
- No `sc execute <plan_id>` (requires server)
- No SUPERCLI_SERVER env var

### Modify
- `src/handlers/plugins.zig` — add `remove`, `show`, native `install`
- `src/handlers/commands.zig` — enrich output, add filters
- `src/main.zig` — add new command routes
- `src/handlers/bootstrap.zig` — update bootstrap to list all available commands

---

## File Size Budget (500 LOC max per file)

| File | Current LOC | After Phase 1-4 | Action |
|------|------------|-----------------|--------|
| `src/main.zig` | 175 | ~250 | OK |
| `src/config.zig` | 380 | ~450 | Watch — may need split |
| `src/registry.zig` | 269 | 269 | OK |
| `src/executor.zig` | 458 | 458 | OK (at limit) |
| `src/output.zig` | 180 | 180 | OK |
| `src/args.zig` | 137 | 137 | OK |
| `src/update.zig` | 370 | 370 | OK |
| `src/handlers/plugins.zig` | 336 | ~450 | Watch — may need split |
| `src/handlers/commands.zig` | 153 | ~200 | OK |
| `src/handlers/execute.zig` | 142 | 142 | OK |
| `src/handlers/bootstrap.zig` | 136 | ~160 | OK |
| `src/handlers/discover.zig` | — | ~130 | New |
| `src/handlers/learn.zig` | — | ~120 | New |
| `src/handlers/skills.zig` | — | ~200 | New |
| `src/handlers/help.zig` | — | ~80 | New |
| `src/handlers/doctor.zig` | — | ~80 | New |
| `src/handlers/onboard.zig` | — | ~100 | New |

If `config.zig` or `plugins.zig` exceed 500 LOC, extract lockfile write logic to `src/lockfile.zig`.

---

## Migration Path

### Step 1: Feature parity (Phases 1-2)
- Implement all P0 features
- Smoke test: `sc-zig` produces identical JSON output to `sc` for all non-server commands
- Update bootstrap JSON to match Node.js envelope

### Step 2: Skills & polish (Phases 3-4)
- Implement P1-P2 features
- Full smoke test against Node.js output

### Step 3: Replace Node.js as default
- Update `install.sh` to default to `--replace` mode
- Rename binary from `sc-zig` to `sc` in releases
- Update AGENTS.md to reflect Zig CLI as primary
- Keep Node.js `sc` as fallback (`npm install -g superacli`)

### Step 4: Deprecate Node.js CLI
- Remove `cli/` directory (or archive to `legacy/cli/`)
- Remove `package.json` dependencies for CLI runtime
- Keep `scripts/` for catalog generation
- Update README to reference Zig CLI only

---

## Testing Strategy

- **Unit tests:** Each new handler gets Zig test blocks
- **Smoke test:** Run `sc-zig <cmd> --json` vs `sc <cmd> --json` for every command, diff output
- **Integration test:** Install a plugin, execute a command, remove the plugin — all via Zig CLI
- **Regression:** Existing test suite in `__tests__/` should pass against Zig CLI output format

---

## Estimated Effort

| Phase | New LOC | Files touched | Effort |
|-------|---------|--------------|--------|
| Phase 1 | ~420 | 4 modified + 1 new | High |
| Phase 2 | ~320 | 3 modified + 2 new | Medium |
| Phase 3 | ~200 | 1 new | Medium |
| Phase 4 | ~400 | 5 modified + 3 new | Medium |
| **Total** | ~1340 | ~15 files | |
