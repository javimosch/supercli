# cmdcenter Quickstart

## Overview
cmdcenter is a generic command execution dashboard with configurable commands via JSON config file. It provides both a web UI and CLI for managing and executing shell commands.

## Quick Start

### Initialize Config
```bash
cmdcenter init
```

This creates `~/.cmdcenter/config.json` with an empty commands array.

### Add Commands
```bash
# Add a simple command
cmdcenter add --id status --name "System Status" --command "uptime" --icon "📊"

# Add command with argument support
cmdcenter add --id df --name "Disk Free" --command "df" --icon "💾" --supports-args
```

### Start Web UI
```bash
# Start as daemon
cmdcenter start -daemon

# Check status
cmdcenter status
```

Access the UI at `http://localhost:3031`

### Execute Commands
```bash
# Via CLI
cmdcenter run --id status

# With arguments (if supports-args enabled)
cmdcenter run --id df --args "-h /"
```

## Common Commands

### Config Management
```bash
cmdcenter init                          # Initialize config file
cmdcenter add --id <id> --name <name> --command <cmd> [--icon <emoji>] [--supports-args]
cmdcenter edit --id <id> [--name <name>] [--command <cmd>] [--icon <emoji>] [--supports-args]
cmdcenter remove --id <id>
cmdcenter list                            # List all commands
```

### Server Management
```bash
cmdcenter start [-port <port>] [-daemon]  # Start HTTP server
cmdcenter stop                            # Stop daemon
cmdcenter status                          # Check daemon status
cmdcenter version                         # Show version
```

## Config File
Location: `~/.cmdcenter/config.json`

### Example Config
```json
{
  "title": "Command Center",
  "subtitle": "Generic command execution dashboard",
  "commands": [
    {
      "id": "status",
      "name": "System Status",
      "description": "Check system status",
      "icon": "📊",
      "command": "uptime",
      "supports_args": false
    },
    {
      "id": "df",
      "name": "Disk Free",
      "description": "Show disk free space",
      "icon": "💾",
      "command": "df",
      "supports_args": true
    }
  ]
}
```

## Command Fields
- `id`: Unique identifier (required)
- `name`: Display name (required)
- `command`: Shell command to execute (required)
- `description`: Command description
- `icon`: Emoji icon
- `supports_args`: Enable argument input modal/CLI args support

## Tips
- Use unique IDs for commands (avoid spaces, use hyphens)
- Enable `--supports-args` for commands that need flexible arguments
- The web UI automatically reloads when config changes via CLI
- Daemon logs are stored at `/tmp/cmdcenter.log`
- Commands with `supports_args: true` show argument input modal in UI
