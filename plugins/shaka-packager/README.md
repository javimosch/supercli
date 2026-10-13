# shaka-packager Plugin for SuperCLI

[shaka-packager](https://github.com/shaka-project/shaka-packager) — Shaka Packager (packager) converts media files into DASH and HLS streams for web playback: it segments video/audio, generates MPD manifests and m3u8 playlists, supports Widevine/PlayReady/FairPlay encryption, and produces CMAF/fMP4 outputs.

## Installation

```bash
mkdir -p ~/.local/bin
curl -sL https://github.com/shaka-project/shaka-packager/releases/latest/download/packager-linux-x64 -o ~/.local/bin/packager

# Install supercli plugin
supercli plugins install ./plugins/shaka-packager
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli shaka-packager self version` | Show packager version |
| `supercli shaka-packager media package` | Package media for DASH/HLS |
| `supercli shaka-packager <any>` | Passthrough to packager CLI |

## Usage

```bash
packager 'in=input.mp4,stream=audio,output=audio.mp4' 'in=input.mp4,stream=video,output=video.mp4' --mpd_output manifest.mpd
```

## Notes

Stream descriptors use 'in=...,stream=...,output=...' syntax; multiple descriptors build multi-rendition output.
