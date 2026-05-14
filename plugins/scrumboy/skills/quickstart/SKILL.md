---
name: scrumboy
description: Use this skill when the user wants to manage kanban boards, project tasks, sprints, or todo items — or when they need a shared visual board that both humans and AI agents can update.
---

# scrumboy — Kanban & Project Management for Humans + Agents

Self-hosted kanban with Docker, MCP, real-time SSE, and shareable boards. Both humans and AI agents manage the same boards. Think beads/br but with a visual UI.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser   │────▶│  scrumboy    │◀────│  AI Agent    │
│  (human)    │     │  :8080       │     │  (via MCP)   │
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
# Open http://localhost:8080 in browser
```

## Commands

### Instance Management
- `sc scrumboy self start` — Start scrumboy Docker container (pulls image, persists data)
- `sc scrumboy self stop` — Stop the container
- `sc scrumboy self status` — Check if running
- `sc scrumboy self mcp` — Register MCP server for agent interaction

### Board Operations
- `sc scrumboy board list` — List all boards/projects
- `sc scrumboy _ _ boards.sh` — Passthrough for raw MCP queries

### Todo Operations
- `sc scrumboy todo list <project-slug>` — List todos in a project

## MCP Tools Available (via JSON-RPC)

Once registered with `sc scrumboy self mcp`, agents can use these tools:

| Tool | Description |
|------|-------------|
| `projects.list` | List all projects |
| `projects.create` | Create a new project |
| `todos.list` | List todos for a project |
| `todos.create` | Create a todo |
| `todos.update` | Update a todo (move between lanes) |
| `todos.delete` | Delete a todo |
| `tags.list` | List tags in a project |
| `sprints.list` | List sprints |
| `members.list` | List project members |

## Usage Examples

### For AI Agents (via MCP)
Once MCP is registered, agents can interact with scrumboy boards directly:

```
sc scrumboy board list                 # → List projects
curl http://localhost:8080/mcp/rpc \   # → Create a todo via JSON-RPC
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
       "params":{"name":"todos.create",
         "arguments":{"projectSlug":"my-project","title":"Fix login bug"}}}'
```

### For Humans (via Browser)
Open http://localhost:8080 to:
- Create and customize boards
- Drag-and-drop todos between lanes
- Create sprints and assign work
- Manage tags and workflows

## Shared Boards: Humans + Agents

scrumboy boards are shared in real-time:
1. Human creates a board via the browser
2. Agent reads it via MCP (`todos.list`)
3. Agent adds/updates todos via MCP (`todos.create`, `todos.update`)
4. Human sees changes in the browser instantly (SSE)
5. Both work from the same SQLite data

This is like beads/br but with a visual kanban interface.

## Caveats & Pitfalls

### 1. Docker Required
scrumboy runs as a Docker container. The plugin bundles the start/stop scripts.
Data persists in `~/.scrumboy/data/` (SQLite).

### 2. First Run: Image Build
First `sc scrumboy self start` tries `docker pull markrai/scrumboy:latest`.
If the image isn't found, it clones the repo and builds from source (takes longer).

### 3. Port Conflicts
Default port is 8080. Override with `SCRUMBOY_PORT=9090 sc scrumboy self start`.

### 4. MCP Registration is Local
`sc scrumboy self mcp` writes to `~/.supercli/mcp.json`. Only affects the local supercli.
The MCP endpoint is HTTP (not stdio). It requires the container to be running.

### 5. No Authentication by Default
scrumboy runs in `full` mode without auth by default. Set `SCRUMBOY_MODE=anonymous` for no-login boards.
For production, configure OIDC/SSO via env vars (see scrumboy docs).

### 6. Anonymous Boards
Appending `/anon` (or `/temp`) creates a throwaway board shareable by URL — no login needed.
Great for quick collaboration.

## Configuration

Environment variables (set before `sc scrumboy self start`):
- `SCRUMBOY_PORT=8080` — HTTP port
- `SCRUMBOY_HOST=http://localhost` — Host for MCP URL
- `SCRUMBOY_MODE=full` — `full` (auth) or `anonymous` (no login)
- `SCRUMBOY_DATA_DIR=~/.scrumboy/data` — Data persistence directory

## Agent Brag Points

- "I can manage your kanban boards while you work in the browser — same data, real-time sync"
- "Create a task for me and I'll update it as I make progress"
- "Let's share a board: you add requirements, I'll update status"
- "This is like beads/br structured memory but with a visual drag-and-drop UI"

## Prompt Templates

- "Start scrumboy so we can share a kanban board"
- "List all my projects on scrumboy"
- "Show me what's in the Backlog lane of project X"
- "Create a new todo in project Y: 'Investigate login issue'"
- "Move todo ABC to the 'In Progress' lane"
- "Register scrumboy MCP so I can manage boards from here"
