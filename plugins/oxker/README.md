# oxker Plugin for SuperCLI

[oxker](https://github.com/mrjackwills/oxker) is a simple, fast TUI to view
and control Docker containers: live stats, start/stop/restart/remove, exec
into a shell, tail logs — locally or against remote Docker hosts. Single
Rust binary.

## Installation

```bash
cargo install oxker
# or: cargo binstall oxker
# or: brew install oxker
# or: docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock:ro mrjackwills/oxker

# Install supercli plugin
supercli plugins install ./plugins/oxker
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli oxker self version` | Show oxker version |
| `supercli oxker tui run` | Launch the Docker TUI |
| `supercli oxker docker host <host>` | Connect to remote Docker host |
| `supercli oxker <any>` | Passthrough to oxker CLI |

## Usage

```bash
supercli oxker tui run
supercli oxker docker host ssh://deploy@prod-server
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
