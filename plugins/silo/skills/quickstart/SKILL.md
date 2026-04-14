---
name: silo
description: Use this skill when the user wants to run multiple instances of the same app on the same port, resolve port conflicts in worktrees, or develop in parallel.
---

# silo Plugin

Run the same app, on the same port, at the same time — zero config, no containers.

## Commands

### Run
- `silo run command` — Run command with IP isolation

### Info
- `silo ip show` — Show resolved IP for current directory

### Session
- `silo ls` — List active silo sessions

## Usage Examples
- "Run two instances of the same app"
- "Start dev servers in different worktrees"
- "Resolve port 3000 conflicts"

## Installation

```bash
curl -fsSL https://setup.silo.rs | sh
```

## Examples

```bash
# In main worktree
silo npm run dev  # → 127.1.42.7:3000

# In feature worktree
silo npm run dev  # → 127.1.98.3:3000

# Show current IP
silo ip

# List sessions
silo ls

# With process managers
silo make dev
silo just dev
silo turbo run dev
```

## Key Features
- Transparent IP isolation
- Works with any command
- Child processes inherit session
- Environment variables set (SILO_IP, SILO_NAME, etc.)
- No config needed
