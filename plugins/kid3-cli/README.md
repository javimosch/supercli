# kid3-cli Plugin for SuperCLI

[kid3-cli](https://invent.kde.org/multimedia/kid3) — kid3-cli is the command-line interface of Kid3 (KDE).

## Installation

```bash
sudo apt-get install -y kid3-cli
Verify: kid3-cli --version

# Install supercli plugin
supercli plugins install ./plugins/kid3-cli
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli kid3-cli self version` | Show kid3-cli version |
| `supercli kid3-cli tags read` | Print all tags of an audio file |
| `supercli kid3-cli tags run` | Run kid3-cli -c command sequences |
| `supercli kid3-cli <any>` | Passthrough to kid3-cli |

## Usage

```bash
kid3-cli -c 'set artist "Someone"' -c save track.flac
```

## Notes

Commands run in order: use `-c 'select FILE'`, `-c 'set FIELD VALUE'`, `-c get`, `-c save`. `kid3-cli` alone opens an interactive shell.
