---
name: supertonic-cli
description: Use this skill when the user needs to generate speech from text using on-device TTS — 31 languages, 10 voice styles, no cloud.
---

# supertonic-cli — On-Device TTS

Generate speech from text using Supertonic — lightning-fast, on-device, multilingual TTS via ONNX Runtime.

## Installation

```bash
pip install supertonic
pip install supertonic-cli
```

First run downloads the model (~300MB) from Hugging Face automatically.

## Commands

- `supertonic-cli tts synthesize <text> [--voice M1] [--lang en] [-o output.wav]` — Generate speech
- `supertonic-cli tts voices` — List available voices
- `supertonic-cli tts languages` — List supported languages
- `supertonic-cli self version` — Show engine info

## Usage Examples

- "Synthesize 'Hello, world!' with voice F1 in French, save to hello.wav"
- "What languages does supertonic support?"
- "List available voice styles"
- "Generate speech from this text: The quick brown fox jumps over the lazy dog"

## Key Features

- 31 languages: EN, KO, JA, AR, DE, FR, ES, and more
- 10 voices: M1-M5 (male), F1-F5 (female)
- On-device inference, zero network after model download
- CPU real-time, ~99M parameters
- JSON output for automation
