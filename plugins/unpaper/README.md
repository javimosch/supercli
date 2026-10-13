# unpaper Plugin for SuperCLI

[unpaper](https://github.com/Flameeyes/unpaper) — unpaper cleans up scanned book/document pages: auto-deskew, black-border and mask detection, noise filtering, blank-page detection, and splitting double-page scans.

## Installation

```bash
sudo apt-get install -y unpaper
Verify: unpaper --version

# Install supercli plugin
supercli plugins install ./plugins/unpaper
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli unpaper self version` | Show unpaper version |
| `supercli unpaper scan clean` | Deskew/clean a scanned page |
| `supercli unpaper <any>` | Passthrough to unpaper CLI |

## Usage

```bash
unpaper --layout double scan.pbm out%d.pbm
```

## Notes

unpaper only speaks PNM (pbm/pgm/ppm/pam) - convert other formats first. Double-page output uses the `%d` placeholder (e.g. out%d.pbm).
