---
name: osmium
description: osmium — OpenStreetMap data processing toolkit for command-line. Converts, filters, extracts, and analyzes .osm, .pbf, and .o5m map files. Supports geographic queries, tag filtering, bounding box extraction, and data statistics for OSM data workflows.
---

# osmium Plugin

osmium — OpenStreetMap data processing toolkit for command-line. Converts, filters, extracts, and analyzes .osm, .pbf, and .o5m map files. Supports geographic queries, tag filtering, bounding box extraction, and data statistics for OSM data workflows.

## Installation

```bash
brew install osmium
Verify: osmium --version
```

## Commands

### `sc osmium self version`

Print osmium version

## Passthrough

```bash
sc osmium _ _ <args...>
```

## SuperCLI

```bash
sc osmium _ _ --help
sc plugins learn osmium
```
