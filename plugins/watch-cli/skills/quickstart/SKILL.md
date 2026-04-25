---
name: watch-cli
description: Use this skill when the user wants to watch files for changes, run commands on file changes, or automate development workflows.
---

# watch-cli Plugin

Watch files and execute npm scripts when files change. File watcher for development workflows.

## Commands

### File Monitoring
- `watch monitor files` — Watch files and execute commands on change

### Utility
- `watch _ _` — Passthrough to watch CLI

## Usage Examples
- "Watch for file changes"
- "Run tests on file change"
- "Watch this directory"
- "Execute command when files change"

## Installation

```bash
npm install -g watch-cli
```

## Examples

```bash
# Watch files and run command
watch monitor files "**/*.js" "npm test"

# Watch specific directory
watch monitor files "src/**/*.js" "npm run build"

# Multiple patterns
watch monitor files "**/*.js" "**/*.css" "npm run lint"

# Watch and run npm script
watch monitor files "**/*.js" "npm run test"

# Any watch command with passthrough
watch _ _ "**/*.js" "npm run build"
watch _ _ "src/**" "npm run dev"
```

## Key Features
- **Glob patterns** - Flexible file matching
- **Multiple patterns** - Watch multiple file types
- **Command execution** - Run any command on change
- **npm integration** - Designed for npm workflows
- **Environment variables** - Exported for commands
- **Debouncing** - Prevents rapid execution
- **Cross-platform** - Works on all OS
- **Simple** - Easy to configure

## Environment Variables
- **WATCH_FILE** - Changed file path
- **WATCH_EVENT** - Change event type
- **WATCH_TIME** - Timestamp of change

## Notes
- Default debounce delay applies
- Can be used with any command
- Great for development workflows
- Works with build tools
- Supports all file types
