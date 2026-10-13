---
name: shaka-packager
description: Use this skill when the user wants to package video/audio for DASH or HLS streaming, generate MPD/m3u8 manifests, or apply DRM encryption.
---

# shaka-packager Plugin

Shaka Packager converts media into DASH and HLS streaming formats: segmenting streams, writing MPD manifests and m3u8 playlists, and optionally encrypting for Widevine/PlayReady/FairPlay.

## Commands

### Packaging
- `shaka-packager media package` — Package to DASH/HLS: sc shaka-packager media package 'in=in.mp4,stream=video,out=v.mp4' --mpd_output out.mpd

### General
- `shaka-packager self version` — Print packager version
- `shaka-packager _ _` — Passthrough to packager CLI

## Usage Examples
- "Package this mp4 into a DASH stream"
- "Generate an HLS m3u8 playlist for this video"
- "Encrypt these streams with a Widevine key"

## Installation

```bash
curl -sL https://github.com/shaka-project/shaka-packager/releases/latest/download/packager-linux-x64 -o ~/.local/bin/packager && chmod +x ~/.local/bin/packager
```

## Examples

```bash
packager 'in=input.mp4,stream=audio,output=audio.mp4' 'in=input.mp4,stream=video,output=video.mp4' --mpd_output manifest.mpd
packager 'in=in.mp4,stream=video,output=v.mp4,playlist_name=v.m3u8' --hls_master_playlist_output master.m3u8
```

## Key Features
- DASH MPD + HLS m3u8 output
- CMAF/fMP4/TS segments
- Widevine/PlayReady/FairPlay encryption
- Live packaging support
