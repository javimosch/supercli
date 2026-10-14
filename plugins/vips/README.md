# vips Plugin for SuperCLI

[vips](https://github.com/libvips/libvips) — Fast, low-memory image processing CLI — resize, convert, thumbnail, and chain 300+ operations.

## Installation

```bash
brew install vips
# or: apt install libvips-tools
# or: dnf install vips-tools

# Install supercli plugin
supercli plugins install ./plugins/vips
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli vips self version` | Print vips version |
| `supercli vips ops list` | List all available vips operations |
| `supercli vips image resize` | Resize an image by scale factor |
| `supercli vips image thumbnail` | Create a thumbnail of a given width in px |
| `supercli vips <any>` | Passthrough to vips CLI |

## Usage

```bash
supercli vips ops list
supercli vips image resize
supercli vips image thumbnail
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
