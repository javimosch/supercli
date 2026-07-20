---
name: hivemind
description: Use this skill when the user wants to run a Procfile-based app locally without tmux — start web + worker + redis processes together, lightweight alternative to foreman/overmind.
---

# hivemind Plugin

Lightweight process manager for Procfile-based applications. Starts all processes defined in a `Procfile` in one terminal — no tmux required.

## Installation

```bash
brew install hivemind
# or
go install github.com/DarthSim/hivemind@latest
```

## Basic Usage

```bash
# Start all processes from Procfile
hivemind

# Use a custom Procfile path
hivemind -f Procfile.dev

# Set a custom working directory
hivemind -d ./backend
```

## Procfile Example

```
web:    bundle exec rails server -p 3000
worker: bundle exec sidekiq
redis:  redis-server
```

Run `hivemind` in the project root — all three processes start with colored, prefixed output.

## Usage Examples

- "Start my Procfile processes locally"
- "Run web and worker together without tmux"
- "Lightweight alternative to overmind for dev"

## SuperCLI

```bash
sc hivemind _ _
sc plugins learn hivemind
```
