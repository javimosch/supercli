---
name: kokoro-tts
description: Use this skill when the user wants to generate speech from text locally
---

# Kokoro-tts Plugin

generate speech from text locally

## Commands
- `kokoro-tts self version` — Print kokoro-tts version
- `kokoro-tts _ _` — Passthrough to kokoro-tts CLI

## Usage Examples
- "Convert this text to speech"
- "Generate audio from text file"
- "Create TTS output in MP3"

## Installation

```bash
pip install kokoro-tts
```

## Examples
```bash
kokoro-tts "Hello world" --output hello.mp3
kokoro-tts --file input.txt --output speech.wav
kokoro-tts --voice female --text "Welcome" --format mp3
```

## Key Features
- Fast local TTS engine
- Multiple voice options
- Multiple output formats
- No cloud dependency
