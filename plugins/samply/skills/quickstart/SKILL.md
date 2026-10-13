---
name: samply
description: Use this skill when the user wants to CPU-profile a command or running process and view flame graphs in the Firefox Profiler with samply.
---

# samply Plugin

samply is a sampling CPU profiler (Linux/macOS/Windows) that uses the Firefox Profiler as its UI. No code changes needed — it attaches to or launches the target binary.

## Commands

- `samply profile record` — `samply record <cmd> [args]`; `--save-only -o out.json` for headless capture, `-p <pid>` to attach, `--rate`, `--iteration-count`
- `samply profile import` — Convert `perf.data` etc. into a profile (`samply import perf.data -o out.json`)
- `samply profile load` — Serve a saved profile in the Firefox Profiler
- `samply _ _` — Passthrough to samply CLI

## Usage Examples

- "Profile this binary and save the profile to a file"
- "Attach to PID 4321 for 10 seconds and produce a profile.json"
- "Convert this perf.data into something I can open in the Firefox Profiler"

## Installation

```bash
cargo install --locked samply
# or prebuilt installer:
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/mstange/samply/releases/latest/download/samply-installer.sh | sh
```

## Examples

```bash
# Headless capture (agents/CI): no browser opened
samply record --save-only -o profile.json -- ./my-app --bench

# Attach to running process
samply record -p 1234 --save-only -o profile.json

# Rust: build with a 'profiling' profile for symbols
cargo build --profile profiling
samply record ./target/profiling/myapp

# Open an existing profile
samply load profile.json
```

## Key Features

- Works on any binary with symbols — no instrumentation
- `--save-only -o profile.json` makes it fully headless/scriptable
- Imports perf.data and other formats (`samply import`)
- On Linux needs `kernel.perf_event_paranoid <= 1`; on macOS run `samply setup` for codesigning
