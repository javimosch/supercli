---
name: elevenlabs-cli
description: Use this skill when the user wants to generate speech audio, manage voices, or work with ElevenLabs text-to-speech and voice cloning services.
---

# ElevenLabs CLI

Voice and audio service management from the terminal. Text-to-speech, voice cloning, and audio generation.

## Commands

- `elevenlabs-cli tts generate` — Generate speech from text
- `elevenlabs-cli voices list` — List available voices
- `elevenlabs-cli _ _` — Passthrough to elevenlabs CLI

## Installation

```bash
npm i -g elevenlabs-cli
```

## Authentication

Set `ELEVENLABS_API_KEY` environment variable.

## Usage Examples

- "Convert text to speech with voice Rachel"
- "List available voices"
- "Clone a voice from audio samples"
- "Generate audio from text file"

## Key Commands

```bash
# Text to speech
elevenlabs tts --text "Hello world" --voice Rachel --output hello.mp3

# List voices
elevenlabs voices list

# Clone a voice (from files)
elevenlabs voices clone --name "MyVoice" --files sample1.mp3 sample2.mp3
```

## Key Features
- **TTS** - High-quality text-to-speech
- **Voice Clone** - Clone voices from samples
- **API Key** - Simple env var auth
- **Non-Interactive** - Agent-friendly
- **Multiple Voices** - 100+ pre-built voices
