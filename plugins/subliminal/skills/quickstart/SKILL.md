---
name: subliminal
description: Use this skill when the user wants to fetch subtitles for movies/episodes - single files or whole folders - in one or more languages.
---

# subliminal Plugin

Subliminal finds and downloads subtitles for videos from multiple providers, scoring candidates against embedded metadata to pick the best match. It handles folders recursively and supports multi-language and hearing-impaired filters.

## Commands

### Downloading
- `subliminal subtitles download` — Fetch subtitles: sc subliminal subtitles download -l en video.mkv

### General
- `subliminal self version` — Print subliminal version
- `subliminal _ _` — Passthrough to subliminal CLI

## Usage Examples
- "Download English subtitles for this movie"
- "Fetch subtitles for every video in this folder"
- "Get hearing-impaired French subtitles for this episode"

## Installation

```bash
pipx install subliminal
```

## Examples

```bash
subliminal download -l en movie.mkv
subliminal download -l en -l fr -a 30d /media/series/
subliminal download -l en --hi video.mp4
```

## Key Features
- Multi-provider search
- Metadata-based best-match scoring
- Recursive folder scan
- Hearing-impaired (-hi) and multi-language support
