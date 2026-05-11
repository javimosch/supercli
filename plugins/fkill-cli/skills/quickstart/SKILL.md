# fkill-cli Quickstart

Fabulously kill processes. Cross-platform CLI tool for terminating processes by name or PID.

## Installation

```bash
npm install -g fkill-cli
```

## Basic Usage

Kill a process by name:
```bash
fkill chrome
```

Kill a process by PID:
```bash
fkill 1337
```

Kill multiple processes:
```bash
fkill chrome firefox safari
```

## Interactive Mode

Launch interactive process picker:
```bash
fkill
```

Use arrow keys to navigate, space to select, enter to kill.

## Options

Force kill (SIGKILL):
```bash
fkill -f chrome
```

Kill process running on specific port:
```bash
fkill :8080
```

Silently ignore errors if process doesn't exist:
```bash
fkill --silent chrome
```

## Tips

- Supports fuzzy matching: `fkill chr` matches chrome
- Works on macOS, Linux, and Windows
- Use `-f` flag for stubborn processes
- Interactive mode is great when you don't know the exact process name
