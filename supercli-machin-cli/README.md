# supercli-machin-cli

A single-binary implementation of the SuperCLI core (`sc`), written in
[machin](https://github.com/javimosch/machin) (MFL) — machine-first,
Go-flavored, compiles through C to a static-ish native binary. No Node.js,
no Zig toolchain, no interpreter at runtime.

Reads the same `~/.supercli/plugins/plugins.lock.json` as the Node.js `sc`
and the Zig `sc-zig`, so it co-habits with both — same lockfile, same
command surface, same JSON envelope shapes. Nothing about your existing
setup changes; this is a third, optional implementation.

## Why a third implementation?

`sc` (Node.js) is the reference implementation; `sc-zig` is a fast
single-binary reimplementation. `sc-machin` is that same idea taken one
step further: written in a language its own author also builds — a real,
non-trivial dogfood case for machin's CLI/backend domain (static typed
JSON parsing via `parse(json, T{})`, `exec()`/`system()` process
orchestration, no cgo).

## Installation

### Quick install (curl)

```bash
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.2.0-machin/install.sh | bash
```

Installs as `sc-machin` (co-exists with `sc` / `sc-zig`). Add `--replace`
to install as `sc` instead, or `--path <dir>` for a custom location.

### Build from source

Requires [machin](https://github.com/javimosch/machin) and a C compiler
(`cc`/`gcc`/`clang`) on `PATH`.

```bash
cd supercli-machin-cli
./build.sh
# binary: ./sc-machin
```

`./build.sh --safe` builds with bounds/div-zero/overflow checks (useful
while developing this CLI itself, not for the release binary).

## Command surface

```
sc-machin                                  agent bootstrap (JSON envelope)
sc-machin --version | --info
sc-machin commands [--query=<q>]
sc-machin inspect <ns> <res> <act>
sc-machin plugins list
sc-machin plugins explore [--name=<q>] [--tags=<a,b>]
sc-machin plugins install <name>           (delegates to Node.js `sc`)
sc-machin plugins update [--check]         (delegates to Node.js `sc`)
sc-machin mcp serve                        MCP server over stdio (JSON-RPC 2.0)
sc-machin <ns> <res> <act> [--flags]       execute a plugin command
```

`--json` forces machine-readable output on any subcommand; default is
human-readable.

Plugin **install/update is delegated to the Node.js `sc`** via
`system("sc plugins install ...")` (stdio inherited, exit code
propagated) — same division of labor as `sc-zig`. Registry resolution,
downloads, and lockfile writes stay in one place (Node.js `sc`); every
implementation just reads the resulting lockfile.

## Architecture

```
src/
├── strutil.src     JSON string escaping + POSIX shell single-quoting
├── pathutil.src     path_dirname (the one path helper machin's stdlib lacks)
├── argv.src         top-level arg parsing — mirrors cli/arg-parser.js 1:1
├── lockfile.src     typed structs + parse() of plugins.lock.json
├── executor.src     process-adapter dispatch via exec()/system()
├── registry.src     `plugins explore` — scans the bundled plugin catalog
├── plugins.src      `plugins list/explore/install/update` rendering
├── commands.src     `commands` / `inspect` rendering
├── bootstrap.src     agent bootstrap envelope + --version/--info
├── mcp.src          MCP server over stdio (JSON-RPC 2.0, JSONL transport)
├── main.src         thin router tying the above together
└── tests.src        machin test unit tests (shell_quote, argv parsing, MCP, ...)
```

`plugins.lock.json`'s `{ version, installed: { <name>: {...} } }` shape
maps directly onto MFL's `map[K]V` JSON-parse witness — `parse(raw,
LockFile{})` decodes the whole file in one typed call, no dynamic-JSON
traversal needed.

One JSON key can't be represented directly: an arg's `"type"` field is
omitted from `ArgDef` because `type` is an MFL keyword. `inspect` still
shows every other field (name/required/positional/description).

## MCP server (`mcp serve`)

`sc-machin mcp serve` is the first implementation of SuperCLI's
"MCP-native runtime" roadmap item (Phase I, Q4 2026) — and the first
`sc-machin` feature that runs a long-running stdio loop, which is the
dogfooding point: `input()`/`flush()`/`json_get()`/`parse()` under load.

It exposes every installed SuperCLI command as an MCP tool over JSON-RPC
2.0 (JSONL transport, protocol version `2025-06-18`). Any MCP client
(Claude Code, Claude Desktop, any LLM agent) that spawns `sc-machin mcp
serve` gets the full SuperCLI tool graph: discover via `tools/list`,
execute via `tools/call`.

### Register with Claude Code

```bash
claude mcp add supercli-machin -- /path/to/sc-machin mcp serve
claude mcp get supercli-machin   # verify: Status: Connected
```

### Protocol surface

| Method | Behavior |
|--------|----------|
| `initialize` | Returns server info + `tools` capability |
| `notifications/initialized` | Notification — no response |
| `ping` | Empty result (health check) |
| `tools/list` | All installed commands as MCP tools |
| `tools/call` | Execute the named command, return result |
| anything else | `-32601 Method not found` |

### Tool naming

Each command is exposed as `<ns>.<res>.<act>` (dotted — matches the
Node.js `mcp bind --as <ns.res.act>` convention). `tools/call {name}`
splits on `.` to recover the triple and dispatches through the existing
executor — no new execution code.

### Scope (v1)

- **JSONL transport only** (no LSP `Content-Length` framing)
- **stdio only** (no SSE/HTTP transport)
- **No daemon** — each MCP client gets a fresh process
- **No `resources` or `prompts`** — tools only (the valuable one)
- **No pagination** on `tools/list` — returns all tools (with the
  `join()`-based rendering fix, 852 tools serialize in ~1ms)

## Testing

```bash
machin test src/strutil.src src/pathutil.src src/lockfile.src src/argv.src src/executor.src src/mcp.src src/tests.src
```

(`./build.sh` runs this automatically.)

## Known gaps (v1)

- **No per-command timeout enforcement.** `sc-zig` kills a hung process
  after `timeout_ms`; machin's `exec()`/`system()` are simple blocking
  shell calls with no built-in watchdog, and wrapping every command in the
  `timeout` coreutil isn't portable (not preinstalled on macOS). Rely on an
  outer timeout if you need one for now.
- **`install-as-sc` is manual-instructions only.** machin has no
  `/proc/self/exe`-style "real path of the running binary" builtin (unlike
  Zig's `std.process.executablePathAlloc`), so a reliable self-locate/copy
  isn't possible from `argv[0]` alone; it prints the two commands to run
  instead.
- **No MCP client adapter / HTTP adapter / daemon mode.** `sc-machin`
  implements the MCP **server** side (`mcp serve`); the Node.js-only
  client adapter (consuming external MCP servers), HTTP adapter, and
  stateful daemon stay Node.js-only — same scope cut as `sc-zig`.
- **Named-flag ordering across a command line is unspecified** (map
  iteration order), same limitation as the Node.js and Zig CLIs.

## Requires machin >= 0.108.0

`argv.src` combines an array bounds guard and the indexed access in the
same `&&` expression (`if i+1 < n && has_prefix(argv[i+1], "--") { ... }`).
On machin <= v0.107.0 this panicked under `--safe` and segfaulted in a
release build — `&&`/`||` failed to short-circuit
([machin#437](https://github.com/javimosch/machin/issues/437), fixed in
v0.108.0). The code nests the index access inside its own guarded `if`
instead, which is correct on every version, so `sc-machin` builds fine
either way — but build with `machin >= 0.108.0` if you hit anything else
that smells like this.
