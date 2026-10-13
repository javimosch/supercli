# mutagen Plugin for SuperCLI

[Mutagen](https://github.com/mutagen-io/mutagen) provides real-time, continuous file
synchronization between local paths, SSH hosts, and Docker containers — plus TCP port
forwarding sessions. Built for remote development: edits propagate in both directions
with conflict handling and flexible ignore rules.

## Installation

```bash
# Install mutagen binary (pick one)
brew install mutagen-io/mutagen/mutagen
# or: curl -sSfL https://github.com/mutagen-io/mutagen/releases/latest/download/mutagen_linux_amd64.tar.gz | tar xz -C ~/.local/bin

# Install supercli plugin
supercli plugins install ./plugins/mutagen
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli mutagen self version` | Show mutagen version |
| `supercli mutagen daemon start` | Start the mutagen daemon |
| `supercli mutagen sync create <a> <b>` | Create a sync session |
| `supercli mutagen sync list` | List sessions and status |
| `supercli mutagen sync monitor` | Live session monitor |
| `supercli mutagen forward create <a> <b>` | Create a port-forwarding session |
| `supercli mutagen <any>` | Passthrough to mutagen CLI |

## Usage

```bash
# Sync a local folder to a remote host over SSH
supercli mutagen sync create ./project user@server:~/project

# Sync into a Docker container
supercli mutagen sync create ./src docker://mycontainer/app/src

# Forward remote port 80 to local 8080
supercli mutagen forward create tcp://localhost:8080 user@server:tcp://localhost:80
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
