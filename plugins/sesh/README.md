# sesh Plugin for SuperCLI

[sesh](https://github.com/joshmedeski/sesh) is a smart terminal session
manager for tmux (and zellij/wezterm). It lists your running sessions,
tmuxinator/sesh configs, and zoxide-ranked project directories in one stream,
then connects — or clones a repo and connects — in a single command.

## Installation

```bash
# Install sesh binary
go install github.com/joshmedeski/sesh/v2@latest
# or: brew install sesh / AUR sesh-bin / dnf copr tmux-sesh

# Install supercli plugin
supercli plugins install ./plugins/sesh
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli sesh self version` | Show sesh version |
| `supercli sesh session list` | List sessions/dirs (`--json` for machines) |
| `supercli sesh session connect` | Connect/switch to a session |
| `supercli sesh session last` | Jump to the last session |
| `supercli sesh session clone` | git clone → connect |
| `supercli sesh session preview` | Preview a session's dir |
| `supercli sesh session root` | Print cwd's project root |
| `supercli sesh <any>` | Passthrough to sesh CLI |

## Usage

```bash
# Machine-readable session/dir list
supercli sesh session list -- --json

# Jump around
supercli sesh session connect -- ~/ai/supercli
supercli sesh session last

# Clone straight into a session
supercli sesh session clone -- https://github.com/waycrate/wayshot
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
