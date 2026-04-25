---
name: entr
description: Use this skill when the user wants to run commands when files change.
---

# Entr Plugin

Run arbitrary commands when files change. A high-performance file watcher for automation.

## Commands

### File Watching
- `entr run watch` — Run command when files change

## Usage Examples
- "find src/ | entr -s 'make | head -n 20'"
- "ls *.js | entr -r node app.js"
- "echo my.sql | entr -cp psql -f /_"

## Installation

```bash
brew install entr
```

## Examples

```bash
# Rebuild project when source files change
find src/ | entr make

# Auto-reload a node.js server
ls *.js | entr -r node app.js

# Clear screen and run command after SQL update
echo my.sql | entr -cp psql -f /_

# Watch directory for file additions
while sleep 0.1; do ls src/*.rb | entr -d make; done
```

## Key Features
- High-performance file system monitoring
- Receives file list from stdin
- Supports restart mode for long-running processes
- Clear screen option for clean output
- Directory watching for new files
- Shell command execution with flags
