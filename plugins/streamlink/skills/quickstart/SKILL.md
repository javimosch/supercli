# streamlink - Video Stream CLI

## Overview
streamlink is a CLI utility that extracts streams from various services (Twitch, YouTube, etc.) and pipes them to video players or files. It supports JSON output for automation and integration with other tools.

## Quick Start

### Stream video to player
```bash
sc streamlink stream url <url> <quality>
```

### List available stream qualities in JSON
```bash
sc streamlink list qualities <url>
```

### Download stream to file
```bash
sc streamlink download stream <url> <quality>
```

### Passthrough to streamlink CLI
```bash
sc streamlink _ <streamlink-args>
```

## Key Features

- **JSON Output**: Use `--json` to get machine-readable output for automation
- **Multi-Service Support**: Works with Twitch, YouTube, and many other streaming services
- **Quality Selection**: Choose best, worst, or specific stream quality
- **Download or Stream**: Either play in video player or download to file
- **Plugin System**: Extensible via plugins for new streaming services

## Installation

```bash
pip install streamlink
```

## Usage Examples

### Stream the best quality
```bash
streamlink "https://www.twitch.tv/example" best
```

### Download a stream
```bash
streamlink --output "%(title)s.%(ext)s" "https://www.youtube.com/watch?v=example" best
```

### List available qualities as JSON
```bash
streamlink --json "https://www.twitch.tv/example"
```

### Check if a URL is supported
```bash
streamlink --can-handle-url "https://www.youtube.com/watch?v=example"
```

## Notes

- The default player is VLC, but can be configured
- Use `--help` to see all available options
- Stream metadata can be read without playing the stream
- Supports cookies and authentication for some services
