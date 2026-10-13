---
name: av1an
description: Use this skill when the user wants to transcode video efficiently - chunked parallel encoding to AV1/VP9/x265 with target quality control.
---

# av1an Plugin

Av1an is a Rust encoding orchestrator: it splits input into scenes, encodes chunks in parallel across workers, and muxes the result. It drives SVT-AV1, rav1e, aomenc, vpxenc, x264, x265 and supports resumable encodes and per-scene VMAF target quality.

## Commands

### Encoding
- `av1an video encode` — Parallel encode: sc av1an video encode -i in.mkv -o out.mkv -e svt-av1 -w 8

### General
- `av1an self version` — Print av1an version
- `av1an _ _` — Passthrough to av1an CLI

## Usage Examples
- "Encode this video to AV1 using all cores"
- "Re-encode with target VMAF quality 93"
- "Resume an interrupted av1an encode"

## Installation

```bash
cargo install av1an  # also needs ffmpeg + encoder (e.g. svt-av1)
```

## Examples

```bash
av1an -i input.mkv -o output.mkv -e svt-av1 -w 8
av1an -i in.mkv -o out.mkv -e svt-av1 --target-quality 93 --resume
av1an --help
```

## Key Features
- Scene-based chunked parallelism
- Resumable encodes (--resume)
- Per-scene target quality (VMAF)
- Works with any supported encoder
