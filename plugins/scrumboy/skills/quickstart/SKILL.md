---
name: scrumboy
description: Use this skill when the user wants to manage kanban boards, project tasks, sprints, or todo items — or when they need a shared visual board that both humans and AI agents can update.
---

# scrumboy — Kanban & Project Management for Humans + Agents

Self-hosted kanban with Docker, MCP, real-time SSE, and shareable boards. Both humans and AI agents manage the same boards.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser   │────▶│  scrumboy    │◀────│  AI Agent    │
│  (human)    │     │  :8081       │     │  (via MCP)   │
└─────────────┘     │  Docker      │     └──────────────┘
                    │  SQLite      │
                    └──────────────┘
                           │
                    ┌──────┴──────┐
                    │  MCP Tools  │
                    │  (JSON-RPC) │
                    └─────────────┘
```

## Quick Start

```bash
sc scrumboy self start    # Start Docker container
sc scrumboy self mcp      # Register MCP for agent use
# Open http://localhost:8081 in browser, register account
sc scrumboy self login    # Save session cookie for CLI commands
sc scrumboy board list    # List all boards/projects
sc scrumboy todo list <slug>  # List todos in a project
```

## Commands

### Instance Management
- `sc scrumboy self start` — Start scrumboy Docker container
- `sc scrumboy self stop` — Stop the container
- `sc scrumboy self status` — Check if running
- `sc scrumboy self login` — Login and save session cookie (needs SCRUMBOY_EMAIL + SCRUMBOY_PASSWORD)
- `sc scrumboy self mcp` — Register MCP server for agent interaction

### Board Operations
- `sc scrumboy board list` — List all boards/projects with role info

### Todo Operations
- `sc scrumboy todo list <project-slug>` — List todos in a project grouped by column

## MCP Tools Available (via JSON-RPC)

Once registered with `sc scrumboy self mcp`, agents can use these tools:

| Tool | Description |
|------|-------------|
| `projects.list` | List all projects |
| `todos.create` | Create a todo in a project |
| `todos.move` | Move a todo between columns |
| `sprints.create` | Create a sprint |
| `board.get` | Get full board state (all columns + items) |
| `tags.listProject` | List project-scoped tags |

**Note:** There is NO `todos.list` tool. Use `board.get` instead to list all todos grouped by column.

## Sessions & Authentication

### How Authentication Works
- scrumboy runs in `full` mode by default, which requires login
- The `/mcp` endpoint returns 401 for unauthenticated requests
- For `/api/` endpoints, include the `X-Scrumboy: 1` header
- Session cookies expire server-side

### Saving a Session Cookie
After registering via the browser:
```bash
# Login and save cookie:
SCRUMBOY_EMAIL="your@email.com" SCRUMBOY_PASSWORD="yourpass" sc scrumboy self login

# The cookie is saved at ~/.scrumboy/cookies.txt
# All scripts use it automatically
```

### Cookie Location
- Default: `~/.scrumboy/cookies.txt`
- Override: `export SCRUMBOY_COOKIE_FILE=/path/to/cookies.txt`

## Scripts & Implementation

### Port Default
All scripts default to port **8081** to avoid conflicts with system services on 8080.
Override: `SCRUMBOY_PORT=9090 sc scrumboy todo list <slug>`

### Script Reference
- `scripts/start.sh` — Docker run/build from source
- `scripts/stop.sh` — Docker stop + rm
- `scripts/status.sh` — Container status (fixed: uses script file, not inline bash -c)
- `scripts/boards.sh` — Project list via MCP with auth cookie
- `scripts/todos.sh` — Todo list via MCP board.get with auth cookie
- `scripts/register-mcp.js` — MCP server registration
- `scripts/login.sh` — Session cookie persistence

### Plugin JSON Configuration
The `todo list` command uses `passthrough: true` with `baseArgs: ["scripts/todos.sh"]` and no defined `args`. The project slug is passed as a positional arg via `__rawArgs`. After editing `plugin.json`, run `sc plugins install ./plugins/scrumboy --on-conflict replace` for changes to take effect.

## Real-World Workflow

### Creating a Project
```bash
# Via REST API (POST, no X-Scrumboy needed for /api/projects):
curl -X POST http://localhost:8081/api/projects \
  -H "Content-Type: application/json" \
  -H "X-Scrumboy: 1" \
  -b ~/.scrumboy/cookies.txt \
  -d '{"name":"My Project"}'

# The slug is auto-generated from the name
```

### Creating Todos
```bash
# Via MCP JSON-RPC:
curl -s http://localhost:8081/mcp/rpc \
  -H "Content-Type: application/json" \
  -b ~/.scrumboy/cookies.txt \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
       "params":{"name":"todos.create",
         "arguments":{"projectSlug":"my-project","title":"Task name","columnKey":"backlog"}}}'
```

### Moving Todos Between Columns
```bash
# Via MCP:
curl -s http://localhost:8081/mcp \
  -H "Content-Type: application/json" \
  -b ~/.scrumboy/cookies.txt \
  -d '{"tool":"todos.move",
       "input":{"projectSlug":"my-project","localId":1,"toColumnKey":"doing"}}'
```

## Lessons Learned

### Port Conflicts
Default port 8080 is often in use by system processes (nginx, apache, etc.).
Fixed default to 8081. The container maps `HOST:8081 → CONTAINER:8080`.

### Status Command Adapter
The original status command used inline `bash -c "..."` in the process adapter,
which caused `bash: status: No such file or directory` errors. Fixed by creating
a proper `scripts/status.sh` script file.

### Session Authentication
The `/mcp` endpoint requires authentication after the first user is created.
CLI scripts must pass the session cookie with `-b` flag. Without a saved cookie,
all commands return "auth required" errors.

### Plugin Changes Require Reinstall
Editing `plugin.json` alone doesn't register changes with supercli. Run:
```bash
node ./cli/supercli.js plugins install ./plugins/scrumboy --on-conflict replace
```

### No todos.list MCP Tool
The scrumboy MCP API does not expose a `todos.list` tool. Use `board.get`
instead, which returns all columns with their items.

### JSON-RPC vs Legacy MCP
scrumboy supports two MCP interfaces:
- `/mcp` — Legacy format: `{"tool":"...","input":{...}}`
- `/mcp/rpc` — JSON-RPC 2.0 format: `{"jsonrpc":"2.0","method":"tools/call","params":{"name":"...","arguments":{...}}}`

The JSON-RPC endpoint requires the `X-Scrumboy: 1` header or auth cookie.
The legacy `/mcp` endpoint works with auth cookies.

## Configuration

Environment variables (set before any `sc scrumboy` command):
- `SCRUMBOY_PORT=8081` — HTTP port
- `SCRUMBOY_HOST=http://localhost` — Host for MCP URL
- `SCRUMBOY_MODE=full` — `full` (auth) or `anonymous` (no login)
- `SCRUMBOY_DATA_DIR=~/.scrumboy/data` — Data persistence directory
- `SCRUMBOY_EMAIL` — Email for login script
- `SCRUMBOY_PASSWORD` — Password for login script
- `SCRUMBOY_COOKIE_FILE=~/.scrumboy/cookies.txt` — Session cookie file

## Prompt Templates

- "Start scrumboy so we can share a kanban board"
- "List all my projects on scrumboy"
- "Show me what's in the Backlog lane of project X"
- "Create a new todo in project Y: 'Investigate login issue'"
- "Move todo ABC to the 'In Progress' lane"
- "Register scrumboy MCP so I can manage boards from here"
