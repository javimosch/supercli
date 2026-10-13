# tippecanoe Plugin for SuperCLI

[tippecanoe](https://github.com/felt/tippecanoe) builds vector tilesets from large
GeoJSON, FlatGeobuf, and CSV feature collections. Originally from Mapbox, now
maintained by Felt. It scales to millions of features with zoom-based
simplification and density-aware dropping, and outputs MBTiles or PMTiles.

## Installation

```bash
# Build from source (Linux)
sudo apt-get install -y build-essential libsqlite3-dev zlib1g-dev
git clone https://github.com/felt/tippecanoe.git && cd tippecanoe
make -j$(nproc) && sudo make install

# or: brew install tippecanoe

# Install supercli plugin
supercli plugins install ./plugins/tippecanoe
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli tippecanoe self version` | Show tippecanoe version |
| `supercli tippecanoe tiles build` | Build vector tiles from GeoJSON/FlatGeobuf/CSV |
| `supercli tippecanoe tiles decode` | Decode MBTiles/PBF tiles to GeoJSON |
| `supercli tippecanoe tiles join` | Merge MBTiles archives (tile-join) |
| `supercli tippecanoe <any>` | Passthrough to tippecanoe CLI |

## Usage

```bash
# Build a tileset, auto-picking max zoom
supercli tippecanoe tiles build -o tiles.mbtiles -zg data.geojson

# Output PMTiles directly
supercli tippecanoe tiles build -o tiles.pmtiles -z14 --coalesce-densest-as-needed data.geojson

# Inspect a built archive
supercli tippecanoe tiles decode tiles.mbtiles

# Merge two archives
supercli tippecanoe tiles join -o merged.mbtiles a.mbtiles b.mbtiles
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
