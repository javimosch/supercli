---
name: scriptreplay
description: scriptreplay — replay terminal typescripts recorded by script(1)
---

# scriptreplay Plugin

Replay terminal typescripts recorded by `script(1)`, using timing information.

## Commands

- `scriptreplay self version` — Print version
- `scriptreplay session replay <timingfile> [typescript]` — Replay a recorded session
- `scriptreplay session replay-timing -t <timingfile> [typescript]` — Replay with explicit timing
- `scriptreplay session replay-speed -d <divisor> <timingfile> [typescript]` — Replay at speed
- `scriptreplay session summary --summary <timingfile> [typescript]` — Session overview
- `scriptreplay session replay-maxdelay -m <maxdelay> <timingfile> [typescript]` — Replay with max delay
- `scriptreplay _ _ [args]` — Passthrough to scriptreplay

## Usage Examples

Record a session with timing, then replay it:

```bash
script --timing=timing.txt session.log
# run commands, then exit
scriptreplay -t timing.txt session.log
```

Replay at 2x speed:

```bash
scriptreplay -d 2 -t timing.txt session.log
```

## Installation

Part of util-linux, pre-installed on most Linux distributions.
