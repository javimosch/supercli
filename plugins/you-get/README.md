# you-get Plugin for SuperCLI

[you-get](https://github.com/soimort/you-get) — Tiny command-line utility to download media (video, audio, images) from YouTube and hundreds of sites.

## Installation

```bash
pip install you-get
# or: pipx install you-get
# or: brew install you-get

# Install supercli plugin
supercli plugins install ./plugins/you-get
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli you-get self version` | Print you-get version |
| `supercli you-get media info` | Show available streams/qualities for a URL without downloading |
| `supercli you-get media download` | Download media from a URL |
| `supercli you-get <any>` | Passthrough to you-get CLI |

## Usage

```bash
supercli you-get media info
supercli you-get media download
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
