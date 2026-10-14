---
name: rqlite
description: Use this skill when the user wants to query an rqlite node, inspect cluster status, or run SQLite SQL against a distributed database.
---

# rqlite Plugin

rqlite pairs SQLite's SQL surface with Raft replication. The rqlite CLI talks to any node over HTTP — open an interactive shell or run one-shot queries with -e.

## Commands

- `rqlite self version` — Print rqlite CLI version
- `rqlite shell open` — Open the interactive rqlite shell (rqlite -H localhost -p 4001; dot-commands: .tables .schema .status .backup .exit)
- `rqlite query run` — Execute a SQL statement non-interactively: rqlite -e 'SELECT * FROM t' -H host -p port
- `rqlite _ _` — Passthrough to rqlite CLI

## Usage Examples

- "Open a SQL shell against my local rqlite node"
- "Run SELECT count(*) on the remote cluster"
- "Check node and cluster status"

## Installation

```bash
brew install rqlite
# or: grab the release tarball (rqlited + rqlite) from
#     https://github.com/rqlite/rqlite/releases
# or: docker pull rqlite/rqlite
```

## Examples

```bash
rqlited ~/node.1                                  # run a node
rqlite                                            # shell -> localhost:4001
rqlite -H 10.0.0.5 -p 4001                        # remote shell
rqlite -e "SELECT * FROM users LIMIT 5"           # one-shot query
# inside the shell: .tables / .schema / .status / .backup db.bak
```

## Key Features

- Full SQLite SQL with Raft-based replication and leader failover
- Interactive shell with .meta commands for schema, status, backup, restore
- -e flag runs statements non-interactively — clean for scripts and CI
