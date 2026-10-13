# utimer Plugin for SuperCLI

[µTimer](https://sourceforge.net/projects/utimer/) is a multilingual
command-line multifunction timer. It provides a timer (count up to a target),
a countdown, and a stopwatch — with flexible durations like `1d2h3m45s300ms`
and a quiet mode for scripts.

## Installation

```bash
# Install utimer binary
sudo apt install utimer
# Arch: AUR package 'utimer'

# Install supercli plugin
supercli plugins install ./plugins/utimer
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli utimer self help` | Show utimer usage |
| `supercli utimer countdown run` | Count down to zero (`-c 5m30s`) |
| `supercli utimer timer run` | Count up to a duration (`-t 10m`) |
| `supercli utimer stopwatch run` | Free-running stopwatch (`-s`) |
| `supercli utimer <any>` | Passthrough to utimer CLI |

## Usage

```bash
# Countdown / timer / stopwatch
supercli utimer countdown run -- 5m30s
supercli utimer timer run -- 10m
supercli utimer stopwatch run

# Script-friendly quiet mode
utimer -q -c 10m && echo "Time's up!"
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
