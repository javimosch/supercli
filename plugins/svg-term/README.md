# svg-term

Share terminal sessions as razor-sharp animated SVG everywhere.

## Features

- Render asciicast to animated SVG
- Share asciicasts everywhere (sans JavaScript)
- Style with common terminal color profiles
- Sharp text rendering at any zoom level

## Usage

```bash
# Convert recorded session to SVG
cat rec.json | svg-term > output.svg

# Download and convert from asciinema
svg-term --cast 113643 --out parrot.svg

# Record and convert a command
svg-term --command "ls -la" --out output.svg

# With window decorations
svg-term --cast 113643 --out window.svg --window
```

## Options

- `--cast` - asciinema cast id to download
- `--command` - command to record
- `--window` - render with window decorations
- `--no-cursor` - disable cursor rendering
- `--term` - terminal profile format
- `--profile` - terminal profile file to use

## Links

- Repository: https://github.com/marionebl/svg-term-cli
