// onboard_content — embedded skill payloads for `sc-zig onboard`.
// ONBOARD_SKILL_MARKDOWN mirrors skills/supercli/SKILL.md (project installs);
// MASTERY_SKILL_MARKDOWN mirrors skills/supercli-mastery/SKILL.md (--global).
// Keep both in sync with the canonical sources in the repo-root skills/ dir.

pub const ONBOARD_SKILL_MARKDOWN =
    \\---
    \\skill_name: "supercli"
    \\description: "SuperCLI agent skill — discover and execute CLI tools via plugins"
    \\---
    \\# SuperCLI
    \\
    \\SuperCLI is a plugin-based CLI tool manager. Use it to discover, install, and execute CLI tools.
    \\
    \\## Discovery
    \\
    \\```bash
    \\sc plugins explore --name <query> --json
    \\sc discover --intent "I need to convert images" --json
    \\sc commands --json
    \\```
    \\
    \\## Execution
    \\
    \\```bash
    \\sc <namespace> <resource> <action> --json
    \\sc run <plugin> <resource> <action> --json
    \\```
    \\
    \\## Skills
    \\
    \\```bash
    \\sc skills list --catalog --json
    \\sc skills get <provider:skill_id>
    \\sc skills teach
    \\```
;

pub const MASTERY_SKILL_MARKDOWN =
    \\---
    \\name: supercli-mastery
    \\description: Use SuperCLI to route tasks to external CLIs. Picks the right binary (sc-machin/sc-zig/sc) — 100x faster starts than defaulting to Node — then the discover → inspect → plan → execute workflow, federation, daemon, and update surfaces.
    \\tags: supercli,cli,routing,plugins
    \\---
    \\
    \\# supercli-mastery — Agent's Guide to SuperCLI
    \\
    \\SuperCLI is a **capability router**: it wraps external CLIs ("plugins") behind a
    \\uniform `namespace.resource.action` command model, JSON output, and semantic
    \\exit codes. Three interchangeable binaries implement it on this machine.
    \\
    \\## Pick the right binary first
    \\
    \\| | `sc-machin` | `sc-zig` | `sc` (Node) |
    \\|---|---|---|---|
    \\| Binary | 100 KB static | 372 KB static | node + JS tree |
    \\| Cold start | **~1 ms** | ~1 ms | ~130 ms |
    \\| `--json` bootstrap | 2 ms | 2 ms | 146 ms |
    \\| `plugins explore` | **18 ms** | 484 ms | ~1.1 s |
    \\| `commands --query` | **6 ms** | 14 ms | 119 ms |
    \\| `inspect` | 6 ms | 2 ms | 91 ms |
    \\| `discover --intent` | — | yes | yes |
    \\| `plugins install/update` | delegates to `sc` | native | native |
    \\| `daemon` lifecycle | — | yes | yes |
    \\| `mcp` client adapter / `ask` / `skills` | — | — | **only here** |
    \\| `mcp serve` (stdio MCP server) | yes | — | — |
    \\| `--server` hub / `server` CRUD / `sync` | — | — | **only here** |
    \\
    \\**Rule of thumb: default to `sc-machin` for reads and discovery** (`--json`,
    \\`commands --query`, `plugins explore`, `inspect`, command execution). It is
    \\10–60x faster than Node `sc` on every measured verb, and faster than `sc-zig`
    \\on catalog queries. Reach for `sc` only when the verb doesn't exist elsewhere
    \\(`mcp` client calls, `ask`, `skills`, `server`, `sync`, `--server`); `sc-zig`
    \\when you need `discover --intent`, plugin installs, or the daemon without Node.
    \\
    \\`sc-machin plugins install`/`update` transparently delegate to Node `sc`
    \\(`system()` passthrough) — safe to use even when that's the goal.
    \\
    \\All three read the same `~/.supercli/` state (plugins.lock.json, config,
    \\skills index), so you can mix them freely within one task.
    \\
    \\## The workflow
    \\
    \\```
    \\discover → learn → inspect → plan → execute
    \\```
    \\
    \\```bash
    \\sc-machin --json                                  # bootstrap: what this CLI does
    \\sc-machin commands --query <keyword> --json       # find a verb
    \\sc-machin plugins explore --name <topic> --json   # find a plugin
    \\sc-machin inspect <ns> <res> <act> --json         # schema: required/positional args
    \\sc <ns> <res> <act> --<args> --json               # execute (any binary)
    \\```
    \\
    \\- `sc plugins learn <name>` — plugin docs + install guidance (Node only)
    \\- `sc plan <ns> <res> <act> --args` — dry-run a mutation before executing
    \\- `sc ask "<task>"` — LLM maps intent to commands (suggests, never executes)
    \\- `sc discover --intent "<task>"` — intent-driven plugin search (sc/sc-zig)
    \\
    \\## Output contract
    \\
    \\- `--json` on every command (or default in non-TTY): `{version, command, data}`
    \\- stdout = data, stderr = progress + typed errors
    \\- Error: `{"error":{"code":N,"type":"...","recoverable":bool,"suggestions":[...]}}`
    \\
    \\## Exit codes (semantic, Square-style ranges)
    \\
    \\| Code | Meaning | Action |
    \\|---|---|---|
    \\| 0 | success | proceed |
    \\| 3 | steady state: daemon stopped | not an error — branch, don't retry |
    \\| 5 | steady state: update available | not an error — decide to update |
    \\| 82 | validation error | fix input |
    \\| 85 | invalid argument | fix args, don't retry |
    \\| 91 | safety violation | non-TTY interactive command blocked |
    \\| 92 | resource not found | different name/id |
    \\| 105 | integration/API error | retry with backoff |
    \\| 110 | internal error | report bug |
    \\
    \\## Federation (hub + workers)
    \\
    \\```
    \\hub:     sc --server            # Express dashboard + /api + /llms.txt, :3000 (PORT env)
    \\workers: SUPERCLI_SERVER + SUPERCLI_API_KEY env
    \\         sc sync                # pull command/plugin config down
    \\         sc daemon start        # ship job logs + heartbeat up
    \\```
    \\
    \\- `GET /api` — hub self-index (route catalog, auth mode). `GET /llms.txt` — agent entry. Both unauthenticated.
    \\- `sc server status --json` — probe the hub: reachable, auth mode, your client_id.
    \\- `sc server <resource> ...` — CRUD on hub resources (plugins, commands, adapters, specs, api-keys, jobs, clients).
    \\- Auth: `X-API-Key` header; mint keys at `/api-keys` on the dashboard.
    \\
    \\## Daemons — three different surfaces, same word
    \\
    \\| Command | What | Surface |
    \\|---|---|---|
    \\| `sc --server` | the hub dashboard (has the UI) | :3000 HTTP |
    \\| `sc daemon` / `sc serve` | bookkeeper: ships job logs + heartbeat to hub | :8320 `/_health` `/_shutdown` only — **no UI** |
    \\| `sc mcp daemon` | MCP server process pool | unix socket |
    \\
    \\```bash
    \\sc daemon status   # {ok,daemon:"running"} exit 0 | "stopped" exit 3 — branch on exit
    \\sc daemon stop     # POSTs /_shutdown
    \\```
    \\
    \\## Self-update (all three)
    \\
    \\```bash
    \\<bin> update --check   # exit 5 = newer version available (steady state, not an error)
    \\<bin> update [--force]
    \\```
    \\
    \\## Token optimization
    \\
    \\For large outputs: `sc mcp call --mcp-server context-mode --tool ctx_batch_execute --input-json '...' --json` (Node `sc` only — `sc-machin mcp serve` is for *exposing* supercli over MCP, not calling other MCP servers).
    \\
    \\## Gotchas
    \\
    \\- **`sc-zig plugins explore` is slow** (~0.5 s — full catalog parse). Prefer `sc-machin` for plugin browsing.
    \\- Plugin installs always end up needing Node `sc` (native in sc/sc-zig; `sc-machin` delegates automatically).
    \\- `sc daemon` on a worker is useless without `SUPERCLI_SERVER` set — it has nowhere to ship.
;
