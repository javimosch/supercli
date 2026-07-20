---
name: rbspy
description: Use this skill when the user wants to profile Ruby CPU usage — sample a running process, record stack traces, or generate flamegraphs without modifying the Ruby app.
---

# rbspy Plugin

Sampling CPU profiler for Ruby. Attaches to running Ruby processes (MRI, JRuby, TruffleRuby) and records stack samples with minimal overhead — ideal for production flamegraphs and call-graph analysis.

## Installation

```bash
curl -L https://raw.githubusercontent.com/rbspy/rbspy/main/install.sh | sh
# or
cargo install rbspy
```

## Basic Usage

```bash
# Profile a Ruby script by PID
rbspy record --pid 12345 --duration 30

# Profile a command directly
rbspy record -- ruby my_app.rb

# Live top-like view of hot methods
rbspy top --pid 12345

# Generate a flamegraph SVG
rbspy record --format flamegraph --output profile.svg -- ruby server.rb
```

## Common Patterns

```bash
# Sample for 60 seconds, write raw data
rbspy record --duration 60 --file profile.gz --pid $(pgrep -f puma)

# Subprocess profiling with rate control
rbspy record --rate 100 -- bundle exec rails server

# Show version and supported Ruby versions
rbspy --version
```

## Usage Examples

- "Profile my Rails server and find slow methods"
- "Generate a flamegraph for this Ruby worker"
- "See which methods use the most CPU in PID 9999"

## SuperCLI

```bash
sc rbspy _ _ record --pid 12345 --duration 30
sc rbspy _ _ top --pid 12345
sc plugins learn rbspy
```
