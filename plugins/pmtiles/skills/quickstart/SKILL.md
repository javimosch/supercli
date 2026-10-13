---
name: pmtiles
description: Use this skill when the user wants to create, convert, inspect, extract, merge, or serve PMTiles single-file map tile archives.
---

# pmtiles Plugin

pmtiles is the single-file utility for PMTiles archives — a cloud-native map tile format addressable by HTTP range requests (Protomaps). Convert MBTiles, inspect metadata, verify, extract subsets, merge, and serve locally.

## Commands

### Archives
- `pmtiles archive convert` — `pmtiles convert in.mbtiles out.pmtiles`
- `pmtiles archive show` — Show metadata, tile counts, compression info
- `pmtiles archive verify` — Check spec compliance / corruption
- `pmtiles archive extract` — Subset by `--maxzoom`, `--bbox`, `--region`
- `pmtiles archive merge` — Merge two archives into one
- `pmtiles server serve` — Local tile server + map preview
- `pmtiles _ _` — Passthrough (bucket, cluster, edit, tile, upload, ...)

## Usage Examples

- "Convert this mbtiles file to pmtiles"
- "What tiles and zoom levels are in this archive?"
- "Extract just zoom 0-8 into a smaller archive"
- "Serve this pmtiles file locally so I can preview it"

## Installation

```bash
# Binary release: https://github.com/protomaps/go-pmtiles/releases
# JS subset:  npm install -g pmtiles
# Docker:     docker run -v $(pwd):/data --rm protomaps/go-pmtiles <cmd>
```

## Examples

```bash
pmtiles convert input.mbtiles output.pmtiles
pmtiles show output.pmtiles
pmtiles verify output.pmtiles
pmtiles extract output.pmtiles subset.pmtiles --maxzoom=8 --bbox=-5,41,10,52
pmtiles merge a.pmtiles b.pmtiles out.pmtiles
pmtiles serve . --port 8080
```

## Key Features

- One file per tileset — upload to S3/Cloudflare R2 and query via range requests, no tile server needed
- `extract` produces ready-to-serve regional subsets
- Works on remote `https://` archives without downloading them fully
- `--quiet` flag for scripted pipelines
