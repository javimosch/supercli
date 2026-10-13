# n-m3u8dl-re Plugin for SuperCLI

[N_m3u8DL-RE](https://github.com/nilaoda/N_m3u8DL-RE) is a cross-platform command-line
downloader for HLS (m3u8), DASH (mpd), and MSS streams. It handles decryption
(AES-128/SAMPLE-AES, user-supplied keys), multi-track selection, live recording with
real-time merge, and muxing to mp4/mkv via ffmpeg or mp4box.

## Installation

```bash
# Install N_m3u8DL-RE binary (self-contained .NET single-file per arch)
curl -s https://api.github.com/repos/nilaoda/N_m3u8DL-RE/releases/latest \
  | grep -o 'https://[^"]*linux_x64[^"]*\.tar\.gz' | head -1 \
  | xargs curl -sSfL | tar xz -C ~/.local/bin && chmod +x ~/.local/bin/N_m3u8DL-RE

# Optional: ffmpeg for --mux-after-done
sudo apt-get install -y ffmpeg

# Install supercli plugin
supercli plugins install ./plugins/n-m3u8dl-re
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli n-m3u8dl-re self version` | Show N_m3u8DL-RE version |
| `supercli n-m3u8dl-re download run <url>` | Download a stream |
| `supercli n-m3u8dl-re download best <url>` | Auto-select best tracks |
| `supercli n-m3u8dl-re live record <url>` | Record a live stream |
| `supercli n-m3u8dl-re <any>` | Passthrough to N_m3u8DL-RE CLI |

## Usage

```bash
# Download an HLS stream
supercli n-m3u8dl-re download run "https://example.com/master.m3u8" --save-dir ./out

# Best quality, mux straight to mp4
supercli n-m3u8dl-re download best "https://example.com/manifest.mpd" -M format=mp4

# Record a live stream as it airs
supercli n-m3u8dl-re live record "https://example.com/live.m3u8"
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
