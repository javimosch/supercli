# websocketd Plugin for SuperCLI

[websocketd](https://github.com/joewalnes/websocketd) — Turn any command-line program or script into a WebSocket server — stdin/stdout become a bidirectional socket.

## Installation

```bash
brew install websocketd
# or: go install github.com/joewalnes/websocketd@latest
# or: download from https://github.com/joewalnes/websocketd/releases

# Install supercli plugin
supercli plugins install ./plugins/websocketd
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli websocketd self version` | Print websocketd version |
| `supercli websocketd server run` | Start a WebSocket server bridging each connection to a command/script |
| `supercli websocketd server devconsole` | Serve the built-in developer console for browser testing |
| `supercli websocketd <any>` | Passthrough to websocketd CLI |

## Usage

```bash
supercli websocketd server run
supercli websocketd server devconsole
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
