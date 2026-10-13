# lazyjournal Plugin for SuperCLI

[lazyjournal](https://github.com/Lifailon/lazyjournal) is a terminal UI for
reading logs from everywhere: journald units, auditd, syslog files, Docker and
Podman containers, Compose stacks, and Kubernetes pods — with log
highlighting, fuzzy filters, and no flags to memorize.

## Installation

```bash
go install github.com/Lifailon/lazyjournal@latest
# or: brew install lazyjournal
# or: binary from https://github.com/Lifailon/lazyjournal/releases

# Install supercli plugin
supercli plugins install ./plugins/lazyjournal
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli lazyjournal self version` | Show lazyjournal version |
| `supercli lazyjournal tui run` | Launch the log TUI |
| `supercli lazyjournal config show <path>` | Run with a custom config |
| `supercli lazyjournal <any>` | Passthrough to lazyjournal CLI |

## Usage

```bash
supercli lazyjournal tui run          # interactive log browser
sudo lazyjournal                      # for full journald access
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
