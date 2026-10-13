# wayshot Plugin for SuperCLI

[wayshot](https://github.com/waycrate/wayshot) is a native Rust screenshot
tool for wlroots-based Wayland compositors (sway, river, Hyprland, wayfire).
It captures whole outputs or slurp-selected regions and can stream PNG bytes
to stdout or the clipboard.

## Installation

```bash
# Install wayshot binary
cargo install wayshot
# or: nixpkgs / wayshot-bin (AUR)

# Install supercli plugin
supercli plugins install ./plugins/wayshot
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli wayshot self version` | Show wayshot version |
| `supercli wayshot screen capture` | Screenshot all outputs → png file |
| `supercli wayshot screen stdout` | Screenshot → png bytes on stdout |
| `supercli wayshot screen region` | Screenshot a slurp geometry region |
| `supercli wayshot screen output` | Pick one output interactively |
| `supercli wayshot <any>` | Passthrough to wayshot CLI |

## Usage

```bash
# Full screenshot to ./<timestamp>.png
supercli wayshot screen capture

# Region + clipboard (needs slurp and wl-clipboard)
supercli wayshot screen region -- "$(slurp)"
supercli wayshot screen stdout -- > shot.png
wayshot --stdout | wl-copy

# Other formats
wayshot --extension jpeg -f shot.jpeg
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
