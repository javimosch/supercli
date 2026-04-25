---
name: nodemon
description: Use this skill when the user wants to auto-restart Node.js applications on file changes.
---

# Nodemon Plugin

Monitor for changes and automatically restart Node.js applications.

## Commands

### Application Monitoring
- `nodemon script watch` — Watch and restart Node.js application

## Usage Examples
- "nodemon script watch --script index.js"
- "nodemon script watch --script index.js --watch src/"

## Installation

```bash
npm install -g nodemon
```

## Examples

```bash
# Watch default entry point
nodemon

# Watch specific script
nodemon index.js

# Watch specific directory
nodemon --watch src

# Watch specific file extensions
nodemon --ext js,json

# Ignore specific files/directories
nodemon --ignore lib

# Run with custom exec
nodemon --exec babel-node

# Delay restart
nodemon --delay 2

# Verbose output
nodemon -V

# Use config file
nodemon --config nodemon.json
```

## Key Features
- Automatic restart on file changes
- Customizable watch patterns
- File extension filtering
- Ignore patterns
- Custom execution commands
- Configurable via nodemon.json
- Development-only tool
