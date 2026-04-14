---
name: whis
description: Use this skill when the user wants to transcribe voice to text, use voice commands with AI assistants, or convert speech to clipboard content.
---

# whis Plugin

Voice-to-text CLI — record, transcribe, and pipe to clipboard.

## Commands

### Record
- `whis record start` — Start voice recording

## Usage Examples
- "Record voice and transcribe"
- "Use with AI assistants"
- "Transcribe existing audio"

## Installation

```bash
cargo install whis-cli
```

## Examples

```bash
# Record (press Enter to stop)
whis

# Background service
whis start
whis toggle  # toggle recording

# Transcribe file
whis -f recording.wav

# Use with AI
claude "$(whis --as ai-prompt)"

# Post-process with AI
whis --post-process
```

## Key Features
- Cloud or local transcription
- Multiple providers: OpenAI, Mistral, Groq, Deepgram, ElevenLabs
- Free with local Whisper
- Presets for different use cases
- Pipe to clipboard
