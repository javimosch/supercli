# moor Plugin for SuperCLI

[moor](https://github.com/walles/moor) (formerly *moar*) is a pager designed to
just do the right thing without configuration: syntax highlighting, incremental
search, arrow-key/trackpad scrolling, and sane defaults — a modern `less`
replacement.

## Installation

```bash
# Install moor binary (pick one)
go install github.com/walles/moor@latest
# or: brew install moor
# or: download from https://github.com/walles/moor/releases

# Install supercli plugin
supercli plugins install ./plugins/moor
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli moor self version` | Show moor version |
| `supercli moor file view <file>` | Page a file with highlighting |
| `supercli moor <any>` | Passthrough to moor CLI |

## Usage

```bash
supercli moor file view main.go
git log | supercli moor _ _        # or just: git log | moor
```

Set it as your pager: `export PAGER=moor`.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
