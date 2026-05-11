# fkill

Fabulously kill processes. Cross-platform.

## Features

- Kill processes by name, PID, or port
- Interactive fuzzy search UI
- Cross-platform (macOS, Linux, Windows)
- Shows CPU and memory usage in interactive mode

## Usage

```bash
# Interactive mode (with fuzzy search)
fkill

# Kill by process name
fkill safari

# Kill by PID
fkill 1337

# Kill by port
fkill :8080

# Force kill
fkill --force 1337
```

## Options

- `--force, -f` - Force kill
- `--verbose, -v` - Show process arguments
- `--silent, -s` - Silently kill and always exit with code 0
- `--smart-case` - Case-insensitive unless pattern contains uppercase

## Links

- Repository: https://github.com/sindresorhus/fkill-cli
