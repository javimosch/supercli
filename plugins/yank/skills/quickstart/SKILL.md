---
name: yank
description: Use this skill when the user wants to copy a field from command output to the clipboard — pick tokens, numbers, paths, or lines with yank.
---

# yank Plugin

yank reads stdin, splits it into fields (default delimiters: space/tab/newline, or `-d` custom, or `-g` regex), shows a tiny selection UI on a TTY, and pipes the choice to a clipboard command (xsel by default; `-- wl-copy` on Wayland). Non-TTY stdout gets the field directly — great for scripts.

## Commands

- `yank clipboard yank` — Interactive field selection → clipboard command
- `yank clipboard first` — `-1`: skip the UI when only one field matches
- `yank _ _` — Passthrough (`-d` delimiter, `-g` pattern, `-i`, `-l` whole line, `-- <cmd>`)

## Usage Examples

- "Copy just the PID out of this ps output"
- "Yank a key=value value from env into the clipboard"
- "Grab the URL from this command's output"
- "Select the whole last line to the clipboard"

## Installation

```bash
sudo apt install yank
# or: brew install yank
```

## Examples

```bash
env | yank -d =                        # pick a key or value
make 2>&1 | yank -l                    # pick whole lines
ps ux | yank -g [0-9]+ | xargs kill    # field → stdout when piped
echo "token=abc123" | yank -1 -d = -- wl-copy   # Wayland clipboard
```

## Key Features

- Tiny, dependency-free C tool (OpenBSD-style)
- Field detection by default delimiters, `-d` custom set, or `-g` regex
- Clipboard backend is fully pluggable: `yank -- wl-copy`, `yank -- xclip -i`
- `-1` mode is deterministic and script-safe (no UI needed)
