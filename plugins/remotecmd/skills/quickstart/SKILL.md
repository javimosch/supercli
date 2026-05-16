---
name: remotecmd
description: Use this skill when the user wants to execute shell commands on a remote machine via the remotecmd WebSocket relay, or speak text aloud on p22.
---

# remotecmd Plugin

Remote command execution via WebSocket relay. Execute shell commands on remote machines over Tailscale or public internet.

## Architecture

```
Client (sc remotecmd exec) → remotecmd-cli → WebSocket → Relay Hub → WebSocket → Target Daemon → shell
```

Three-node topology:
- **Relay**: Central WebSocket hub that routes messages by target name
- **Target Daemon**: Connects to relay, registers itself, waits for commands, executes them
- **Client**: One-shot CLI that connects to relay, sends a command, and prints the result as JSON

## Commands

### Execute
- `remotecmd exec run --target <name> --cmd <command>` — Execute command on remote target

### Speak (convenience)
- `remotecmd speak text --text <text>` — Speak text aloud on p22 (Spanish, voice F2)

### Daemon Management
- `remotecmd daemon start [--token <t>] [--daemon]` — Start target daemon
- `remotecmd daemon stop` — Stop target daemon
- `remotecmd daemon status` — Check target daemon status

### Relay Management
- `remotecmd relay start [--port <n>] [--daemon]` — Start relay hub
- `remotecmd relay stop` — Stop relay hub
- `remotecmd relay status` — Check relay hub status
- `remotecmd relay config --url <u> --name <n>` — Configure relay connection

### Target Configuration
- `remotecmd target add --name <n> --token <t>` — Add a known target
- `remotecmd target remove --name <n>` — Remove a target
- `remotecmd target list` — List configured targets

### Info
- `remotecmd self version` — Show remotecmd-cli version

## Usage Examples

- "Speak something on p22: `remotecmd speak text --text \"Hola mundo\"`"
- "Run a command on my remote PC: `remotecmd exec run --target p22 --cmd \"uptime\"`"
- "Check if the target daemon is running: `remotecmd daemon status`"
- "Start the relay hub: `remotecmd relay start --port 3032 --daemon`"
- "Add a new target: `remotecmd target add --name p22 --token abc123`"

## Installation

```bash
curl -LO https://github.com/javimosch/remotecmd-cli/releases/latest/download/remotecmd-cli-linux-amd64
chmod +x remotecmd-cli-linux-amd64
sudo mv remotecmd-cli-linux-amd64 /usr/local/bin/remotecmd-cli
```

## Setup

1. Start relay on a reachable machine:
   ```bash
   remotecmd-cli relay daemon start --port 3032 -daemon
   ```

2. Start target daemon on the machine that will execute commands:
   ```bash
   remotecmd-cli set-relay --url http://<relay-host>:3032 --name my-node
   remotecmd-cli daemon start -daemon
   ```

3. From a client machine:
   ```bash
   remotecmd-cli set-relay --url http://<relay-host>:3032 --name client
   remotecmd-cli add-target --name my-node --token <token>
   remotecmd-cli --target my-node --cmd 'echo "hello"'
   ```

## Key Features
- WebSocket relay for bidirectional real-time communication
- Token-based authentication between targets and clients
- Parallel command execution on target daemon
- Auto-reconnect on connection loss
- JSON output for machine parsing
- Auto-generated auth tokens with file persistence
