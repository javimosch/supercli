# lavat Plugin for SuperCLI

[lavat](https://github.com/AngelJumbo/lavat) renders a soothing animated lava
lamp in your terminal — metaball blobs simulated with configurable colors,
shapes and speed. Pure eye-candy for idle terminals, screenshots and demos.

## Installation

```bash
cargo install lavat
# or: cargo binstall lavat
# or: brew install lavat

# Install supercli plugin
supercli plugins install ./plugins/lavat
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli lavat self version` | Show lavat version |
| `supercli lavat lamp run` | Run the lava lamp |
| `supercli lavat lamp color <color>` | Pick a lava color |
| `supercli lavat <any>` | Passthrough to lavat CLI |

## Usage

```bash
supercli lavat lamp run
supercli lavat lamp color blue
lavat -c magenta -r 8 -s 5   # custom blob look
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
