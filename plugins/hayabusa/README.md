# hayabusa Plugin for SuperCLI

[Hayabusa](https://github.com/Yamato-Security/hayabusa) is a fast Windows event
log forensics and threat-hunting tool by Yamato Security. It parses exported
.evtx files with ~4000 bundled Sigma-compatible rules and outputs severity-
tagged forensic timelines in CSV or JSONL.

## Installation

```bash
# Download release zip from
# https://github.com/Yamato-Security/hayabusa/releases
# or: cargo install --git https://github.com/Yamato-Security/hayabusa

# Install supercli plugin
supercli plugins install ./plugins/hayabusa
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli hayabusa self version` | Show hayabusa version |
| `supercli hayabusa timeline csv` | CSV forensic timeline |
| `supercli hayabusa timeline json` | JSON/JSONL timeline |
| `supercli hayabusa logs metrics` | Event-ID counts per file |
| `supercli hayabusa logs search` | Keyword search in event data |
| `supercli hayabusa rules update` | Update detection rules |
| `supercli hayabusa <any>` | Passthrough to hayabusa CLI |

## Usage

```bash
# Analyze a directory of exported .evtx files
supercli hayabusa timeline json -d ./evtx -o detections.jsonl -L
supercli hayabusa logs metrics -d ./evtx
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
