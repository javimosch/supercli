# cmdcenter Plugin

Generic command execution dashboard with configurable commands via JSON config file.

## Features

- 🎯 **Generic Command Center**: Execute any shell commands from a web UI
- ⚙️ **Configurable Commands**: Define commands in `~/.cmdcenter/config.json`
- 🔧 **CLI Management**: Full CRUD operations via command-line interface
- 📋 **Command Logging**: All command executions logged with timestamps and status
- 🔍 **Search Logs**: Search through daemon logs with filtering
- 🗑️ **Log Management**: Clear logs when needed
- 🎨 **Modern UI**: Argentine flag color scheme with bento-grid layout
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🚀 **Daemon Mode**: Run as background service
- 💬 **Non-blocking Toasts**: Custom toast notifications instead of native alerts
- 🔄 **Argument Support**: Commands can accept extra arguments
- 🤖 **Agent-first**: Designed for AI/agent workflows with comprehensive CLI

## Installation

### Via Supercli
```bash
sc plugins install cmdcenter
```

### Manual Installation
1. Download the appropriate binary for your platform from [releases](https://github.com/javimosch/cmdcenter/releases)
2. Move the binary to your PATH (e.g., `/usr/local/bin/` or `~/bin/`)
3. Make it executable: `chmod +x cmdcenter`
4. Initialize config: `cmdcenter init`

## Quick Start

```bash
# Initialize config
cmdcenter init

# Add a command
cmdcenter add --id status --name "System Status" --command "uptime" --icon "📊"

# Start web UI
cmdcenter start -daemon

# Execute command
cmdcenter run --id status
```

Access the UI at `http://localhost:3031`

## Usage

### Config Commands
```bash
cmdcenter init                          # Initialize config file
cmdcenter add --id <id> --name <name> --command <cmd> [--icon <emoji>] [--supports-args]
cmdcenter edit --id <id> [--name <name>] [--command <cmd>] [--icon <emoji>] [--supports-args]
cmdcenter remove --id <id>
cmdcenter list                            # List all commands
```

### Execution Commands
```bash
cmdcenter run --id <id> [--args <args>]  # Execute a command
```

### Server Commands
```bash
cmdcenter start [-port <port>] [-daemon]  # Start HTTP server
cmdcenter stop                            # Stop daemon
cmdcenter status                          # Check daemon status
cmdcenter version                         # Show version
```

## Configuration

Config file location: `~/.cmdcenter/config.json`

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
    }
  ]
}
```

## Web UI Features

- Click command buttons to execute
- Commands with `supports_args: true` show argument input modal
- Live command output display
- Add/Edit/Delete commands via UI
- Raw JSON config editing
- View and search daemon logs
- Non-blocking toast notifications
- Custom confirmation dialogs

## Agent Usage

Load the quickstart skill for agent-specific guidance:
```bash
sc skills teach cmdcenter:quickstart
```

## License

MIT

## Links

- [GitHub Repository](https://github.com/javimosch/cmdcenter)
- [Releases](https://github.com/javimosch/cmdcenter/releases)
- [supercli-clis](https://github.com/javimosch/cmdcenter)
