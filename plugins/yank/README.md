# yank Plugin for SuperCLI

[yank](https://github.com/mptre/yank) yanks terminal output to the clipboard.
Pipe anything into it: it splits input into fields (by delimiter or regex),
lets you pick one — or auto-picks with `-1` — and hands the field to a
clipboard command (xsel by default, anything via `-- <cmd>`).

## Installation

```bash
# Install yank binary
sudo apt install yank
# or: brew install yank / make install from source

# Install supercli plugin
supercli plugins install ./plugins/yank
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli yank self version` | Show yank version |
| `supercli yank clipboard yank` | Pick a field → clipboard |
| `supercli yank clipboard first` | Auto-select single field (`-1`) |
| `supercli yank <any>` | Passthrough to yank CLI |

## Usage

```bash
# Interactive field picker → clipboard
env | supercli yank clipboard yank -- -d =
make 2>&1 | supercli yank clipboard yank -- -l

# Script-friendly: single field straight to stdout when piped
ps ux | yank -g [0-9]+ | xargs kill
cat file.txt | yank -1 -- wl-copy
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
