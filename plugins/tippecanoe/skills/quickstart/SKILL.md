---
name: tippecanoe
description: Use this skill when the user wants to build vector map tilesets (MBTiles/PMTiles) from GeoJSON, FlatGeobuf, or CSV data with tippecanoe.
---

# tippecanoe Plugin

tippecanoe builds Mapbox Vector Tilesets from large GeoJSON/FlatGeobuf/CSV collections, with zoom-dependent simplification and density-based feature dropping. Maintained by Felt (originally Mapbox).

## Commands

### Tiles
- `tippecanoe tiles build` — Build a tileset: `-o out.mbtiles in.geojson` (also outputs `.pmtiles` directly)
- `tippecanoe tiles decode` — Decode an MBTiles archive or single PBF tile to GeoJSON (tippecanoe-decode)
- `tippecanoe tiles join` — Merge/filter MBTiles archives (tile-join)
- `tippecanoe _ _` — Passthrough to tippecanoe CLI

## Usage Examples

- "Turn this GeoJSON of buildings into vector tiles"
- "Make a PMTiles archive from this flatgeobuf file, zoom 0-14"
- "Decode this mbtiles file so I can inspect its contents"
- "Merge these regional mbtiles into one archive"

## Installation

```bash
sudo apt-get install -y build-essential libsqlite3-dev zlib1g-dev
git clone https://github.com/felt/tippecanoe.git && cd tippecanoe
make -j$(nproc) && sudo make install
# or: brew install tippecanoe
```

## Examples

```bash
# Auto zoom, drop densest features as needed at low zooms
tippecanoe -o tiles.mbtiles -zg --drop-densest-as-needed data.geojson

# Multiple layers in one tileset
tippecanoe -o tiles.mbtiles -L roads:roads.geojson -L water:water.geojson

# Keep attributes selective, force max zoom
tippecanoe -o out.mbtiles -z12 --include=name --include=kind places.geojson

# Decode archive for inspection
tippecanoe-decode tiles.mbtiles | head

# Join regional archives
tile-join -o country.mbtiles region1.mbtiles region2.mbtiles
```

## Key Features

- Scales to hundreds of millions of features via zoom-based simplification
- Writes MBTiles and PMTiles (v3) directly
- `--drop-densest-as-needed` / `--coalesce-densest-as-needed` handle over-dense data automatically
- Companions: `tile-join`, `tippecanoe-decode`, `tippecanoe-enumerate`, `tippecanoe-json-tool`
