# samply Plugin for SuperCLI

[samply](https://github.com/mstange/samply) is a command-line sampling CPU
profiler for Linux, macOS, and Windows that renders captures in the Firefox
Profiler. Prepend `samply record` to any command — no instrumentation or
recompilation needed.

## Installation

```bash
cargo install --locked samply
# or prebuilt:
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/mstange/samply/releases/latest/download/samply-installer.sh | sh

# Install supercli plugin
supercli plugins install ./plugins/samply
```

Linux note: set `kernel.perf_event_paranoid <= 1` to allow profiling.

## Commands

| Command | Description |
|---------|-------------|
| `supercli samply self version` | Show samply version |
| `supercli samply profile record` | Record a profile of a command |
| `supercli samply profile import` | Convert perf.data to a profiler JSON |
| `supercli samply profile load` | Serve/open a saved profile in Firefox Profiler |
| `supercli samply <any>` | Passthrough to samply CLI |

## Usage

```bash
# Profile a binary, save without opening a browser (agent-friendly)
supercli samply profile record --save-only -o profile.json -- ./target/release/app

# Attach to a running process
supercli samply profile record -p 1234 --save-only -o profile.json

# View a saved profile later
supercli samply profile load profile.json
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
