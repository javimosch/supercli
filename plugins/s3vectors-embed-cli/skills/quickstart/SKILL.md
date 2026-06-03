---
name: s3vectors-embed-cli
description: Use this skill when the user wants to perform semantic similarity search on media files stored in S3.
---

# S3Vectors Embed CLI Plugin

Semantic similarity search on S3 media, written in Python.

## Commands

### Media
- `s3vectors-embed-cli media index` — Index media files for semantic search
- `s3vectors-embed-cli media search` — Semantic similarity search on indexed media

## Usage Examples

```bash
s3vectors-embed-cli media index --bucket my-media-bucket
s3vectors-embed-cli media search --query "sunset photo" --top 5
s3vectors-embed-cli media index --prefix videos/ --format mp4
s3vectors-embed-cli --help
```

## Installation

```bash
pip install s3vectors-embed-cli
```

## Key Features
- Embed media files for semantic search
- Vector-based similarity search on S3 content
- Support for images, audio, and video
- Fast indexing and retrieval
