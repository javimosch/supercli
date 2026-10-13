---
name: utimer
description: Use this skill when the user wants a terminal timer, countdown, or stopwatch — pomodoro-style breaks, cooking timers, or elapsed-time measurement with utimer.
---

# utimer Plugin

µTimer is a tiny C CLI timer. Durations accept mixed suffixes `d`, `h`, `m`, `s`, `ms` in any order (`utimer -c 1h30m45s300ms`). Spacebar pauses/resumes; `q` quits the stopwatch; `-q` silences the live counter for scripts.

## Commands

- `utimer countdown run` — `--countdown/-c <duration>` down to zero
- `utimer timer run` — `--timer/-t <duration>` up to the target, then exits
- `utimer stopwatch run` — `--stopwatch/-s` runs until `q`
- `utimer self help` — `--help` usage printout
- `utimer _ _` — Passthrough (`-q` quiet, `-v` verbose)

## Usage Examples

- "Set a 25-minute pomodoro countdown"
- "Time how long this compile takes"
- "Beep me in 90 seconds"
- "Run a stopwatch while I do this migration"

## Installation

```bash
sudo apt install utimer
```

## Examples

```bash
utimer -c 5m30s                # countdown
utimer -t 10m                  # timer (exits at target)
utimer -s                      # stopwatch
utimer -q -c 10m && mpv beep.mp3   # quiet mode + notification
utimer -t 1d5h38m && reboot        # very long timer
```

## Key Features

- Flexible time syntax: `d`/`h`/`m`/`s`/`ms` combined freely
- Sub-second precision display (millisecond resolution)
- Script-friendly: `-q` quiet mode, exit-on-target semantics, `&&` chaining
- Multilingual (i18n), pause/resume via spacebar
