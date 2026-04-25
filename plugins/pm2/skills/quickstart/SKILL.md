---
name: pm2
description: Use this skill when the user wants to manage Node.js processes with pm2.
---

# PM2 Plugin

Process manager for Node.js applications. Production-grade process manager.

## Commands

### Process Management
- `pm2 process list` — List all processes
- `pm2 process start` — Start a process
- `pm2 process stop` — Stop a process
- `pm2 process restart` — Restart a process
- `pm2 process delete` — Delete a process

## Usage Examples
- "pm2 process start --script index.js"
- "pm2 process stop --id 0"
- "pm2 process list"

## Installation

```bash
npm install -g pm2
```

## Examples

```bash
# Start a script
pm2 start index.js

# Start with custom name
pm2 start index.js --name myapp

# Start multiple instances
pm2 start index.js -i 4

# List all processes
pm2 list

# Stop a process
pm2 stop 0
pm2 stop myapp

# Restart a process
pm2 restart 0
pm2 restart all

# Delete a process
pm2 delete 0
pm2 delete all

# View logs
pm2 logs

# Monitor
pm2 monit

# Save process list
pm2 save

# Startup script
pm2 startup
```

## Key Features
- Process management (start, stop, restart, delete)
- Clustering mode for load balancing
- Automatic restart on crash
- Log management
- Monitoring and metrics
- Zero-downtime reloads
- Process persistence across reboots
