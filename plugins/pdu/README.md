# pdu Plugin for SuperCLI

[pdu](https://github.com/KSXGitHub/parallel-disk-usage) (parallel disk usage)
is a highly parallel `du -sh` replacement. It scans directory trees across all
CPU cores, shows a live progress bar, and prints an ASCII tree — much faster
than `du` on large filesystems.

## Installation

```bash
cargo install parallel-disk-usage
# or: cargo binstall parallel-disk-usage
# or: brew install pdu

# Install supercli plugin
supercli plugins install ./plugins/pdu
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli pdu self version` | Show pdu version |
| `supercli pdu disk scan [paths]` | Parallel disk-usage scan |
| `supercli pdu disk json [paths]` | Scan and emit JSON |
| `supercli pdu <any>` | Passthrough to pdu CLI |

## Usage

```bash
supercli pdu disk scan /var
supercli pdu disk scan -- --top=20 ~/projects
supercli pdu disk json ~ | jq '.size'
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
