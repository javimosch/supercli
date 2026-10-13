# pmtiles Plugin for SuperCLI

[pmtiles](https://github.com/protomaps/go-pmtiles) is the reference CLI for the
PMTiles format — a single-file archive for map tiles addressable by HTTP range
requests, so a whole tileset can live on cheap static/S3 storage. Convert
MBTiles, inspect archives, extract subsets, merge, and serve locally.

## Installation

```bash
# Download binary release (full Go CLI)
# https://github.com/protomaps/go-pmtiles/releases -> move `pmtiles` into PATH

# or JS subset: npm install -g pmtiles
# or docker:    docker run -v $(pwd):/data --rm protomaps/go-pmtiles ...

# Install supercli plugin
supercli plugins install ./plugins/pmtiles
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli pmtiles self help` | Show CLI usage |
| `supercli pmtiles archive convert` | MBTiles → PMTiles |
| `supercli pmtiles archive show` | Show archive metadata/tile stats |
| `supercli pmtiles archive verify` | Verify archive integrity |
| `supercli pmtiles archive extract` | Extract subset by zoom/bbox |
| `supercli pmtiles archive merge` | Merge two archives |
| `supercli pmtiles server serve` | Serve tiles over HTTP with map preview |
| `supercli pmtiles <any>` | Passthrough to pmtiles CLI |

## Usage

```bash
supercli pmtiles archive convert europe.mbtiles europe.pmtiles
supercli pmtiles archive show europe.pmtiles
supercli pmtiles archive extract europe.pmtiles paris.pmtiles --bbox=2.2,48.8,2.5,49.0
supercli pmtiles server serve . --port 8080
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
