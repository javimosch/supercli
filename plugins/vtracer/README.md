# vtracer Plugin for SuperCLI

[vtracer](https://github.com/visioncortex/vtracer) — vtracer is a Rust-based raster-to-vector converter (visioncortex).

## Installation

```bash
cargo install vtracer
Verify: vtracer --version

# Install supercli plugin
supercli plugins install ./plugins/vtracer
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli vtracer self version` | Show vtracer version |
| `supercli vtracer vectorize convert` | Convert raster image to SVG |
| `supercli vtracer <any>` | Passthrough to vtracer CLI |

## Usage

```bash
vtracer --input logo.png --output logo.svg --colormode color --hierarchical stacked
```

## Notes

Key flags: `--colormode color|binary`, `--mode polygon|spline|none`, `--filter_speckle`, `--corner_threshold`.
