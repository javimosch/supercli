# library - Media Toolkit

## Overview
library provides 99+ CLI tools to build, browse, and blend your media library. Extract metadata, watch/listen from local files or websites, and manage media databases.

## Quick Start

### Passthrough to library CLI
```bash
sc library _ <library-args>
```

## Key Features

- **99+ CLI Tools**: Comprehensive toolkit for media management
- **Metadata Extraction**: Extract metadata from media files
- **Local Playback**: Watch/listen from local files
- **Website Integration**: Watch/listen from websites
- **Database Management**: Create and manage media databases
- **FFmpeg Integration**: Built on ffmpeg for media processing

## Installation

```bash
pip install library
```

## Usage Examples

### Extract metadata
```bash
library extract metadata video.mp4
```

### Play local media
```bash
library play video.mp4
```

### Download and play from website
```bash
library download youtube https://youtube.com/watch?v=xxx
```

### Create database
```bash
library database create my_library
```

## Notes

- Run `library --help` to see all available commands
- Supports various media formats via ffmpeg
- Can organize media via separate databases
