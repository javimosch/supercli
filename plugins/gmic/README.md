# gmic Plugin for SuperCLI

[gmic](https://github.com/GreycLab/gmic) — G'MIC is a full-featured open-source framework for image processing.

## Installation

```bash
sudo apt-get install -y gmic
Verify: gmic -version

# Install supercli plugin
supercli plugins install ./plugins/gmic
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli gmic self version` | Show gmic version |
| `supercli gmic image apply` | Run a filter pipeline on an image |
| `supercli gmic docs lookup` | Help for a G'MIC command/filter |
| `supercli gmic <any>` | Passthrough to gmic CLI |

## Usage

```bash
gmic photo.jpg -resize 1600,1600 -sharpen 50 -o photo_small.jpg
```

## Notes

G'MIC input is processed left-to-right as a pipeline; `-o` writes the result. See `gmic -h` for the full filter list.
