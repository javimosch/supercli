# rqlite Plugin for SuperCLI

[rqlite](https://github.com/rqlite/rqlite) — Distributed relational database built on SQLite — CLI shell to query nodes and inspect cluster state.

## Installation

```bash
brew install rqlite
# or: grab the release tarball (rqlited + rqlite) from
#     https://github.com/rqlite/rqlite/releases
# or: docker pull rqlite/rqlite

# Install supercli plugin
supercli plugins install ./plugins/rqlite
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli rqlite self version` | Print rqlite CLI version |
| `supercli rqlite shell open` | Open the interactive rqlite shell |
| `supercli rqlite query run` | Execute a SQL statement non-interactively: rqlite -e 'SELECT * FROM t' -H host -p port |
| `supercli rqlite <any>` | Passthrough to rqlite CLI |

## Usage

```bash
supercli rqlite shell open
supercli rqlite query run
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
