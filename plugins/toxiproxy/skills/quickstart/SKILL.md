---
name: toxiproxy
description: Use this skill when the user wants to test how an application handles network failures — inject latency, timeouts, bandwidth limits, or connection drops between an app and its database, cache, or external API.
---

# toxiproxy Plugin

Toxiproxy (Shopify) is a TCP proxy for chaos/resilience testing. `toxiproxy-server` runs proxies between an app and its dependencies; `toxiproxy-cli` creates proxies and attaches "toxics" that degrade the connection — latency, bandwidth limits, timeouts, resets — so you can prove timeouts and retries behave.

## Commands

- `toxiproxy server start` — Run the daemon (API on :8474)
- `toxiproxy proxy create` — New proxy (`--listen`, `--upstream`)
- `toxiproxy proxy list` — All proxies + state
- `toxiproxy proxy inspect` — Proxy detail + active toxics
- `toxiproxy proxy toggle` — Kill/restore a proxy (outage simulation)
- `toxiproxy toxic add` — Attach a fault (`--type latency --attribute ...`)
- `toxiproxy _ _` — Passthrough to toxiproxy-cli

## Usage Examples

- "Add 2 seconds of latency between my app and Redis"
- "Simulate the database going away mid-test"
- "Throttle this connection to 100KB/s to reproduce the mobile bug"

## Installation

```bash
brew install toxiproxy
# or download toxiproxy-cli + toxiproxy-server from GitHub releases
toxiproxy-server &   # daemon on :8474
```

## Examples

```bash
# Wrap a local redis: clients hit :26379 → real :6379
toxiproxy-cli create redis --listen localhost:26379 --upstream localhost:6379

# +1s latency with 100ms jitter, downstream direction
toxiproxy-cli toxic add redis --type latency --attribute latency=1000 --attribute jitter=100

# Full outage: toggle off, then back on
toxiproxy-cli toggle redis

# Slow-drip bandwidth cap
toxiproxy-cli toxic add redis --type bandwidth --attribute rate=50
```

## Key Features

- Toxics: latency (jitter), bandwidth, slow_close, timeout, reset_peer, slicer, limit_data
- `--toxicity` applies faults probabilistically; `--downstream`/`--upstream` picks direction
- JSON config file for declarative proxy setup; HTTP API for test harnesses
- The canonical tool for "does our retry/timeout code actually work"
