# lazyjj Plugin for SuperCLI

[lazyjj](https://github.com/Cretezy/lazyjj) is a TUI for the
[jujutsu (jj)](https://github.com/jj-vcs/jj) version control system, written in
Rust. Browse the revset log, preview diffs, describe and create changes, manage
bookmarks, and inspect the operation log — like lazygit, but for jj.

## Installation

```bash
# Install lazyjj (requires jj — cargo install --locked jj-cli)
cargo install lazyjj

# Install supercli plugin
supercli plugins install ./plugins/lazyjj
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli lazyjj self version` | Show lazyjj version |
| `supercli lazyjj tui open` | Launch the TUI in the current repo |
| `supercli lazyjj <any>` | Passthrough to lazyjj CLI |

## Usage

```bash
# Inside a jj repository
supercli lazyjj tui open
# or just:
supercli lazyjj
```

Inside the TUI: navigate the revset with arrows/`j`/`k`, press `d` to describe
a change, `n` for a new change, `b` for bookmarks, and `o` to browse the
operation log for undo.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
