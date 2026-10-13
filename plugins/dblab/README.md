# dblab Plugin for SuperCLI

[dblab](https://github.com/danvergara/dblab) is a fast, interactive TUI database
client written in Go. It connects to PostgreSQL, MySQL, SQLite3, and Oracle, and
lets you browse schemas, tables, and rows or run SQL — all with vim-like
keybindings, in the terminal.

## Installation

```bash
# Install dblab binary (pick one)
go install github.com/danvergara/dblab@latest
# or: brew install danvergara/tools/dblab
# or: download a prebuilt binary from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/dblab
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli dblab self version` | Show dblab version |
| `supercli dblab tui open --url <dsn>` | Open the interactive TUI |
| `supercli dblab <any>` | Passthrough to dblab CLI |

## Usage

```bash
# Open TUI against Postgres
supercli dblab --url "postgres://user:pass@localhost:5432/mydb?sslmode=disable"

# Or with discrete flags
supercli dblab --driver postgres --host localhost --user postgres --db mydb --port 5432
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
