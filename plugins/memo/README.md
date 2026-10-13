# memo Plugin for SuperCLI

[memo](https://github.com/mattn/memo) is a Markdown memo/notes CLI by mattn.
Notes are plain Markdown files in a configurable directory, listed through a
fuzzy picker (fzf/peco/percol), full-text searchable with grep, and browsable
via a built-in HTTP server.

## Installation

```bash
# Install memo binary
go install github.com/mattn/memo@latest

# Install supercli plugin
supercli plugins install ./plugins/memo
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli memo self version` | Show memo version |
| `supercli memo notes new` | Create a memo (title prompt, opens $EDITOR) |
| `supercli memo notes list` | Pick a memo via fuzzy finder |
| `supercli memo notes grep` | Full-text search memos |
| `supercli memo notes cat` | Print a picked memo to stdout |
| `supercli memo notes edit` | Edit a picked memo |
| `supercli memo server serve` | Browse memos in a web UI |
| `supercli memo config edit` | Edit config.toml |
| `supercli memo <any>` | Passthrough to memo CLI |

## Usage

```bash
# Create / search / view memos
supercli memo notes new
supercli memo notes grep "deploy checklist"
supercli memo notes cat

# Browse the whole memo dir over HTTP
supercli memo server serve
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
