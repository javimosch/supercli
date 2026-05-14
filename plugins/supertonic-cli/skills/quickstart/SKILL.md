---
name: supertonic-cli
description: Use this skill when the user needs to generate speech from text using on-device TTS — 31 languages, 10 voice styles, no cloud, ONNX Runtime.
---

# supertonic-cli — On-Device TTS

Generate speech from text using Supertonic — lightning-fast, on-device, multilingual TTS via ONNX Runtime (5.3k ⭐, MIT).

## Installation & Dependencies

```bash
pip install supertonic          # Core TTS engine + ONNX Runtime (~100MB)
pip install supertonic-cli      # CLI wrapper
```

## Commands

- `supertonic-cli tts synthesize <text> [--voice M1] [--lang en] [-o output.wav] [--machine]` — Generate speech to file
- `supertonic-cli tts speak <text> [--voice M1] [--lang en] [--machine]` — Synthesize and play aloud immediately (auto-cleanup)
- `supertonic-cli tts voices` — List available voices
- `supertonic-cli tts languages` — List supported languages
- `supertonic-cli self version` — Show engine info

## Critical Caveats & Pitfalls

### 1. First Run: Model Download (Mandatory)
The first `synthesize` or `info` call downloads the ONNX model from Hugging Face (~300MB, 26 files).
**Always warn the user** about this before running. Do NOT run synthesize without warning.

```bash
# Expected first-run output:
Fetching 26 files:   0%|  | 0/26 [00:00<?, ?it/s]
# Download can take 2-5 minutes depending on connection.
```

**Affected commands**: `synthesize`, `voices`, `info`
**Safe commands** (no download): `languages`

### 2. Timeout Configuration
The default supercli timeout may not be enough for first-run model download.
Always use `--machine` flag which returns faster (no file I/O), OR set `timeout_ms` higher.
First-run synthesize typically needs **120-300 seconds**.

### 3. soundfile / _ctypes Issues
On some Python installations, `_ctypes` module is missing, causing `save_audio()` to fail.
The CLI has a built-in fallback that writes raw WAV without soundfile.
**If you see "soundfile library is required"**, the fallback should handle it automatically.

### 4. Duration is numpy.float32, not a plain float
When processing machine JSON output, the `duration_s` field may be a numpy type (not serializable to JSON).
The CLI handles this internally by converting to float.

### 5. Output Format
- Default: **44100Hz** mono 16-bit WAV (correct sample rate is critical for natural sound)
- The model outputs at 44100Hz. If audio sounds like a "drunk robot" or slowed down, the WAV was saved at the wrong sample rate (early versions hardcoded 24000Hz). Update to the latest CLI to fix.
- The `--machine` flag returns metadata without audio to stdout; the WAV file is written to disk

### 6. Voice Styles
| Voice | Style | Best For |
|-------|-------|----------|
| M1-M5 | Male voices (5 variants) | General purpose, varies by language |
| F1-F5 | Female voices (5 variants) | General purpose, varies by language |

Not all voices are equally good for all languages. If output sounds wrong, suggest trying a different voice.

### 7. Language Codes (31 languages)
Use ISO 639-1 two-letter codes. Full list via `supertonic-cli tts languages`:
`en, ko, ja, ar, bg, cs, da, de, el, es, et, fi, fr, hi, hr, hu, id, it, lt, lv, nl, pl, pt, ro, ru, sk, sl, sv, tr, uk, vi`

### 8. Text Length & Quality
- Short text (< 200 chars) works best
- Long text may cause OOM on low-memory systems
- For long text (> 500 chars), consider splitting into sentences and synthesizing separately
- Supertonic handles punctuation, numbers, dates, currency, and abbreviations well
- Supports expressive tags: `<laugh>`, `<breath>`, `<sigh>`

### 9. Performance Characteristics
- Typical RTF (Real-Time Factor): **0.2-0.5** on modern CPU (faster than real-time)
- ~99M parameters, runs entirely on CPU (no GPU needed)
- Memory usage: ~500MB-1GB during synthesis
- Faster after model is cached (subsequent runs skip download)

### 10. Model Cache
The ONNX model is cached at Hugging Face's default cache location:
`~/.cache/huggingface/hub/`
Can be deleted and re-downloaded if corrupted.

### 11. JSON Output Format
```json
{
  "ok": true,
  "output": "/path/to/output.wav",
  "duration_s": 2.08,
  "real_time_s": 0.56,
  "rtf": 0.267,
  "voice": "M1",
  "lang": "es"
}
```

### 12. Speak Command — Say Something Aloud
The `speak` command synthesizes and plays audio in one step, then deletes the temp file.
Useful for agents that want to "say something" when supercli runs on a machine with speakers.

```bash
sc supertonic-cli tts speak "Hello, I am ready" --voice M1 --lang en
```

**Player detection** (in order): ffplay, paplay, aplay (Linux), afplay (macOS).
Headless servers without audio will fail — use `synthesize` instead.

### 13. No Cloud / No API
This runs entirely on-device. No internet connection needed after model download.
No API keys required. No data leaves the machine. **Guarantee this to the user.**

## Prompt Templates

Best prompts to use with this plugin:

- "Synthesize '[text]' with voice [M1-F5] in [language], save as [filename]"
- "Generate Spanish speech: Hola Ma, anda a dormir — voice M1, save to hola_ma.wav"
- "List available voices and their languages"
- "What languages does supertonic support? Output as a table"
- "Create audio from this text: [long text]. Split into sentences if too long."
- "Download the supertonic model first (warn user about 300MB), then synthesize..."

## Common Workflows

### One-shot TTS
```
→ "Generate 'Hello world' in French with voice F2"
← supertonic-cli tts synthesize "Hello world" --voice F2 --lang fr -o hello.wav
```

### Multi-language comparison
```
→ "Synthesize 'Good morning' in English, Spanish, and Japanese"
← Run 3 separate commands with different --lang codes
```

### JSON for automation
```
→ "Generate speech from this text and return the duration: 'The quick brown fox'"
← Use --machine flag to get structured output
```
