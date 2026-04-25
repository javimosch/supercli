# concurrently - Run Commands Concurrently

## Overview
concurrently is a CLI tool that runs multiple commands concurrently with better output tracking and error handling. It's cross-platform (including Windows) and makes it easy to track which command is outputting what.

## Quick Start

### Run commands concurrently
```bash
sc concurrently run commands "command1" "command2" "command3"
```

### Run commands with kill-others flag
```bash
sc concurrently run kill-others "command1" "command2"
```

### Passthrough to concurrently CLI
```bash
sc concurrently _ <concurrently-args>
```

## Key Features

- **Cross Platform**: Works on Windows, macOS, and Linux
- **Output Prefixing**: Each command's output is prefixed for easy tracking
- **Kill Others**: Option to kill all commands if one fails
- **Color Coding**: Different colors for each command's output
- **Flexible Input**: Can run npm scripts, shell commands, or any executable

## Installation

```bash
npm install -g concurrently
```

## Usage Examples

### Run npm scripts
```bash
concurrently "npm run watch-js" "npm run watch-css"
```

### Run shell commands
```bash
concurrently "sleep 5 && echo done" "sleep 3 && echo done"
```

### Kill others on first failure
```bash
concurrently --kill-others "npm test" "npm run lint"
```

### With custom names
```bash
concurrently --names "server,client" "npm run server" "npm run client"
```

## Notes

- Surround commands with quotes to avoid shell interpretation issues
- On Windows, use double quotes for commands
- Can be used in package.json scripts for development workflows
- Output is easier to follow than using & in shell
