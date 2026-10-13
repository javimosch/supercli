---
name: abcde
description: Use this skill when the user wants to rip an audio CD to FLAC/MP3/Ogg with automatic track naming and tagging.
---

# abcde Plugin

abcde (A Better CD Encoder) automates CD ripping: cdparanoia reads, CDDB/MusicBrainz tags, encoder of choice writes FLAC/MP3/Ogg/Opus/AAC/WAV. One command from disc to tagged files.

## Commands

### Ripping
- `abcde cd rip` — Rip the disc: sc abcde cd rip -o flac

### General
- `abcde self version` — Print abcde version
- `abcde _ _` — Passthrough to abcde CLI

## Usage Examples
- "Rip this CD to FLAC with tags"
- "Rip only tracks 3-5 to mp3"
- "Re-encode from a previously saved cuesheet"

## Installation

```bash
sudo apt-get install -y abcde cdparanoia flac lame vorbis-tools
```

## Examples

```bash
abcde -o flac
abcde -o mp3 1-5
abcde -a read,cue,encode,tag,move,clean -o flac,mp3
```

## Key Features
- Multi-format encode in one pass
- CDDB + MusicBrainz tagging
- Single-track or range ripping
- ~/.abcde.conf for persistent config
