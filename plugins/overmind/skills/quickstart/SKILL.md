---
name: overmind
description: Use this skill when the user wants to run Procfile-based apps with tmux integration — start processes in separate panes, reconnect to running sessions, and manage multi-process dev environments.
---

# overmind Plugin

Process manager for Procfile-based applications with tmux integration. Each process runs in its own tmux pane — reconnect anytime, restart individual processes, and inspect logs per service.

## Installation

```bash
brew install overmind
# or
gem install overmind
```

Requires **tmux** installed.

## Basic Usage

```bash
# Start all Procfile processes in tmux
overmind start

# Connect to the running tmux session
overmind connect

# Restart a single process
overmind restart web

# Stop all processes
overmind stop
```

## Procfile Example

```
web:    npm run dev
api:    go run ./cmd/server
worker: npm run worker
```

## Usage Examples

- "Start my Procfile with tmux panes for each service"
- "Reconnect to my running overmind session"
- "Restart just the web process without stopping everything"

## SuperCLI

```bash
sc overmind _ _ start
sc overmind _ _ connect
sc plugins learn overmind
```
