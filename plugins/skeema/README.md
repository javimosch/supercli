# skeema Plugin for SuperCLI

[skeema](https://github.com/skeema/skeema) is a declarative schema management system
for MySQL and MariaDB. You track table definitions as plain `CREATE` statements in
`.sql` files inside a git repo; `skeema diff` and `skeema push` figure out the DDL
needed to make the databases match — no hand-written migrations.

## Installation

```bash
# Install skeema binary (pick one)
go install github.com/skeema/skeema@latest
# or: brew install skeema
# or: download the static binary tarball from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/skeema
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli skeema self version` | Show skeema version |
| `supercli skeema repo init --host <h>` | Dump schemas from a live server into a repo |
| `supercli skeema diff preview` | Preview DDL changes (dry run) |
| `supercli skeema push apply` | Apply schema changes to databases |
| `supercli skeema format run` | Canonicalize .sql files |
| `supercli skeema lint run` | Check schema files for issues |
| `supercli skeema pull run` | Sync repo from direct DB changes |
| `supercli skeema <any>` | Passthrough to skeema CLI |

## Usage

```bash
# Capture an existing database's schema into a repo
supercli skeema repo init --host prod.internal --user root --dir schemas

# After editing .sql files:
supercli skeema diff preview   # see what would change
supercli skeema push apply     # apply it
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
