# av1an Plugin for SuperCLI

[av1an](https://github.com/rust-av/Av1an) — Av1an splits a video into scenes and encodes chunks in parallel across workers, driving encoders like SVT-AV1, rav1e, aomenc, x265, x264, and vpxenc.

## Installation

```bash
sudo apt-get install -y ffmpeg svt-av1
cargo install av1an

# Install supercli plugin
supercli plugins install ./plugins/av1an
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli av1an self version` | Show av1an version |
| `supercli av1an video encode` | Chunked parallel encode |
| `supercli av1an <any>` | Passthrough to av1an CLI |

## Usage

```bash
av1an -i input.mkv -o output.mkv -e svt-av1 -w 8 --target-quality 93
```

## Notes

Requires ffmpeg/ffprobe and an encoder binary (SvtAv1EncApp, rav1e, x265...). Use `--resume` to continue interrupted jobs.
