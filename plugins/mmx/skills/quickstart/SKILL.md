---
name: mmx.quickstart
description: Complete mmx CLI reference for agents — all commands, flags, auth/config precedence, exit codes, and dual-region setup.
tags: mmx,minimax,text,image,video,speech,music,vision,search,agent,quickstart
---

# mmx Quickstart

Use mmx to generate text, images, video, speech, music, and search via the MiniMax AI platform.

## Install and Authenticate

```bash
# Install
npm install -g mmx-cli

# Authenticate with API key (persisted to ~/.mmx/credentials.json)
mmx auth login --api-key sk-xxxxx

# Or use environment variable (checked before stored credentials)
export MINIMAX_API_KEY=sk-xxxxx
```

Get API key: https://platform.minimax.io/subscribe/token-plan

## Agent Flags

Always use these flags in non-interactive (agent/CI) contexts:

| Flag | Purpose |
|---|---|
| `--non-interactive` | Fail fast on missing args instead of prompting |
| `--quiet` | Suppress spinners/progress; stdout is pure data |
| `--output json` | Machine-readable JSON output |
| `--async` | Return task ID immediately (video generation) |
| `--dry-run` | Preview the API request without executing |
| `--yes` | Skip confirmation prompts |

## Auth Precedence

Credentials are resolved in this order:
1. `--api-key` flag
2. `MINIMAX_API_KEY` env var
3. `~/.mmx/credentials.json` (stored OAuth/API key)
4. `api_key` in `~/.mmx/config.yaml`

## Config Precedence

CLI flags → environment variables → `~/.mmx/config.json` → defaults.

## Exit Codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | General error |
| 2 | Usage error (invalid arguments) |
| 3 | Authentication error |
| 4 | Quota exceeded |
| 5 | Timeout |
| 10 | Content filter triggered |
| 130 | Interrupted (Ctrl+C) |

## mmx auth

```bash
# Login with API key
mmx auth login --api-key sk-xxxxx

# OAuth browser flow
mmx auth login

# Device-code flow (no browser)
mmx auth login --no-browser

# Check authentication status
mmx auth status

# Refresh OAuth token
mmx auth refresh

# Revoke and clear credentials
mmx auth logout
```

## mmx text chat

Send a chat completion. Default model: `MiniMax-M2.7`.

```bash
mmx text chat --message <text> [flags]
```

| Flag | Type | Description |
|---|---|---|
| `--message` | string, repeatable | Message text. Prefix with `role:` to set role (`user:`, `assistant:`, `system:`) |
| `--messages-file` | string | JSON file with messages array (use `-` for stdin) |
| `--system` | string | System prompt |
| `--model` | string | Model ID (default: `MiniMax-M2.7`); also `MiniMax-M2.7-highspeed` |
| `--max-tokens` | integer | Max tokens to generate (default: 4096) |
| `--temperature` | number | Sampling temperature (0.0, 1.0] |
| `--top-p` | number | Nucleus sampling threshold |
| `--stream` | boolean | Stream tokens (default: on in TTY) |
| `--tool` | string, repeatable | Tool definition JSON or file path (for function calling) |
| `--output` | string | `text` (default) or `json` |

```bash
# Single message
mmx text chat --message "What is MiniMax?" --output json --quiet

# Multi-turn conversation
mmx text chat --message "user:Hi" --message "assistant:Hey!" --message "How are you?"

# With system prompt
mmx text chat --system "You are a coding assistant" --message "Write fizzbuzz in Go"

# From file
cat messages.json | mmx text chat --messages-file - --output json

# Streaming
mmx text chat --message "Tell me a story" --stream
```

## mmx image generate

Generate images. Model: `image-01`.

```bash
mmx image generate --prompt <text> [flags]
```

| Flag | Type | Description |
|---|---|---|
| `--prompt` | string, required | Image description |
| `--aspect-ratio` | string | e.g. `16:9`, `1:1`, `9:16` |
| `--n` | integer | Number of images (default: 1) |
| `--seed` | integer | Random seed for reproducible output |
| `--width` | integer | Custom width in pixels (512–2048, multiple of 8) |
| `--height` | integer | Custom height in pixels (512–2048, multiple of 8) |
| `--prompt-optimizer` | boolean | Automatically optimize the prompt |
| `--aigc-watermark` | boolean | Embed AI-generated content watermark |
| `--subject-ref` | string | Subject reference: `type=character,image=path-or-url` |
| `--out-dir` | string | Download images to directory |
| `--out-prefix` | string | Filename prefix (default: `image`) |
| `--output` | string | `text` (default) or `json` |

```bash
# Simple
mmx image generate --prompt "A cat in a spacesuit" --output json --quiet

# Multiple with aspect ratio
mmx image generate --prompt "Mountain landscape" --n 3 --aspect-ratio 16:9

# To directory
mmx image generate --prompt "Logo" --out-dir ./out/ --quiet
```

## mmx video generate

Generate video. Default model: `MiniMax-Hailuo-2.3`. Async by default — polls until completion unless `--async` is set.

```bash
mmx video generate --prompt <text> [flags]
```

| Flag | Type | Description |
|---|---|---|
| `--prompt` | string, required | Video description |
| `--model` | string | `MiniMax-Hailuo-2.3` (default) or `MiniMax-Hailuo-2.3-Fast` |
| `--first-frame` | string | First frame image (I2V mode) |
| `--last-frame` | string | Last frame image (SEF mode, requires `--first-frame`) |
| `--subject-image` | string | Subject reference image (S2V mode) |
| `--callback-url` | string | Webhook URL for completion notification |
| `--download` | string | Save video to file on completion (blocking) |
| `--no-wait` | boolean | Return task ID immediately (same as `--async`) |
| `--async` | boolean | Return task ID immediately |
| `--poll-interval` | integer | Polling interval in seconds (default: 5) |
| `--output` | string | `text` (default) or `json` |

```bash
# Blocking: wait and get file path
mmx video generate --prompt "Ocean waves." --download ocean.mp4 --quiet

# Non-blocking: get task ID
mmx video generate --prompt "A robot." --async --quiet
# stdout: {"taskId":"..."}

# I2V: first frame
mmx video generate --prompt "Walk forward" --first-frame start.jpg

# S2V: subject reference
mmx video generate --prompt "A detective walking" --subject-image character.jpg
```

## mmx video task get

Query status of a video generation task.

```bash
mmx video task get --task-id <id> [--output json]
```

## mmx video download

Download a completed video by file ID.

```bash
mmx video download --file-id <id> --out <path> [--output json]
```

## mmx speech synthesize

Text-to-speech. Default model: `speech-2.8-hd`. Max 10k chars.

```bash
mmx speech synthesize --text <text> [flags]
```

| Flag | Type | Description |
|---|---|---|
| `--text` | string | Text to synthesize |
| `--text-file` | string | Read text from file (use `-` for stdin) |
| `--model` | string | `speech-2.8-hd` (default), `speech-2.6`, `speech-02` |
| `--voice` | string | Voice ID (default: `English_expressive_narrator`) |
| `--speed` | number | Speech speed multiplier |
| `--volume` | number | Volume level |
| `--pitch` | number | Pitch adjustment |
| `--format` | string | Audio format (default: `mp3`) |
| `--sample-rate` | integer | Sample rate (default: 32000) |
| `--bitrate` | integer | Bitrate (default: 128000) |
| `--channels` | integer | Audio channels (default: 1) |
| `--language` | string | Language boost |
| `--subtitles` | boolean | Include subtitle timing data |
| `--pronunciation` | string, repeatable | Custom pronunciation (format: `from/to`) |
| `--out` | string | Save audio to file |
| `--stream` | boolean | Stream raw audio to stdout |
| `--output` | string | `text` (default) or `json` |

```bash
# Simple
mmx speech synthesize --text "Hello world" --out hello.mp3 --quiet

# Voice and speed
mmx speech synthesize --text "Hi" --voice English_magnetic_voiced_man --speed 1.2

# From stdin
echo "Breaking news" | mmx speech synthesize --text-file - --out news.mp3

# Streaming audio
mmx speech synthesize --text "Stream me" --stream | mpv -
```

## mmx speech voices

List available system voices.

```bash
mmx speech voices [--language <lang>] [--output json]
```

## mmx music generate

Generate a song. Model: `music-2.6-free` (unlimited for API key users, RPM=3).

```bash
mmx music generate [--prompt <text>] [--lyrics <text>] [flags]
```

| Flag | Type | Description |
|---|---|---|
| `--prompt` | string | Music style description |
| `--lyrics` | string | Song lyrics with structure tags |
| `--lyrics-file` | string | Read lyrics from file (use `-` for stdin) |
| `--lyrics-optimizer` | boolean | Auto-generate lyrics from prompt |
| `--instrumental` | boolean | Generate instrumental (no vocals) |
| `--vocals` | string | Vocal style (e.g. `"warm male baritone"`, `"bright female soprano"`) |
| `--genre` | string | Music genre |
| `--mood` | string | Mood or emotion |
| `--instruments` | string | Instruments to feature |
| `--tempo` | string | Tempo description (`fast`, `slow`, `moderate`) |
| `--bpm` | integer | Exact tempo in BPM |
| `--key` | string | Musical key (e.g. `C major`) |
| `--avoid` | string | Elements to avoid |
| `--use-case` | string | Use case context (e.g. `"background music for video"`) |
| `--structure` | string | Song structure (e.g. `verse-chorus-verse-bridge-chorus`) |
| `--references` | string | Reference tracks or artists |
| `--extra` | string | Additional fine-grained requirements |
| `--aigc-watermark` | boolean | Embed AI-generated content watermark |
| `--format` | string | Audio format (default: `mp3`) |
| `--sample-rate` | integer | Sample rate (default: 44100) |
| `--bitrate` | integer | Bitrate (default: 256000) |
| `--stream` | boolean | Stream raw audio to stdout |
| `--out` | string | Save audio to file |
| `--output` | string | `text` (default) or `json` |

At least one of `--prompt` or `--lyrics` is required.

```bash
# With lyrics
mmx music generate --prompt "Upbeat pop" --lyrics "[verse] La da dee..." --out song.mp3 --quiet

# Auto-generate lyrics
mmx music generate --prompt "Upbeat pop about summer" --lyrics-optimizer --out summer.mp3

# Instrumental
mmx music generate --prompt "Cinematic orchestral, building tension" --instrumental --out bgm.mp3

# Detailed
mmx music generate --prompt "Warm morning folk" \
  --vocals "male and female duet, harmonies" \
  --instruments "acoustic guitar, piano" \
  --bpm 95 --out duet.mp3
```

## mmx music cover

Generate a cover version of a song. Model: `music-cover-free` (unlimited, RPM=3).

```bash
mmx music cover --prompt <text> (--audio <url> | --audio-file <path>) [flags]
```

| Flag | Type | Description |
|---|---|---|
| `--prompt` | string, required | Target cover style |
| `--audio` | string | URL of reference audio (6s–6min, max 50MB) |
| `--audio-file` | string | Local reference audio file |
| `--lyrics` | string | Cover lyrics (if omitted, extracted via ASR) |
| `--lyrics-file` | string | Read lyrics from file |
| `--seed` | integer | Random seed 0–1000000 for reproducible results |
| `--format` | string | Audio format: `mp3`, `wav`, `pcm` (default: `mp3`) |
| `--sample-rate` | integer | Sample rate (default: 44100) |
| `--bitrate` | integer | Bitrate (default: 256000) |
| `--channel` | integer | Channels: `1` (mono) or `2` (stereo) |
| `--stream` | boolean | Stream raw audio to stdout |
| `--out` | string | Save audio to file |
| `--output` | string | `text` (default) or `json` |

```bash
# Cover from URL
mmx music cover --prompt "Indie folk, acoustic guitar" \
  --audio https://example.com/song.mp3 --out cover.mp3 --quiet

# From local file
mmx music cover --prompt "Jazz, piano, slow" \
  --audio-file original.mp3 --out jazz_cover.mp3

# Reproducible with seed
mmx music cover --prompt "Pop, upbeat" \
  --audio https://example.com/song.mp3 --seed 42 --out cover.mp3
```

## mmx vision describe

Image understanding via VLM.

```bash
mmx vision describe (--image <path-or-url> | --file-id <id>) [--prompt <text>] [--output json]
```

| Flag | Type | Description |
|---|---|---|
| `--image` | string | Local path or URL (auto base64-encoded) |
| `--file-id` | string | Pre-uploaded file ID |
| `--prompt` | string | Question about the image (default: `"Describe the image."`) |

Provide either `--image` or `--file-id`, not both.

```bash
mmx vision describe --image photo.jpg
mmx vision describe --image https://example.com/photo.jpg --prompt "What breed?"
```

## mmx search query

Web search via MiniMax.

```bash
mmx search query --q <query> [--output json]
```

```bash
mmx search query --q "MiniMax AI latest news" --output json --quiet
```

## mmx quota show

Display Token Plan usage and remaining quotas.

```bash
mmx quota show [--output json]
```

## mmx config

```bash
# Show current configuration
mmx config show

# Set a config value
mmx config set --key region --value cn
# Valid keys: region, base_url, output, timeout, api_key
# Valid regions: global, cn

# Export config schema as JSON
mmx config export-schema [--command "video generate"]
```

## Dual Region

- Global (default): `--region global` → `api.minimax.io`
- CN: `--region cn` → `api.minimaxi.com`

```bash
# Via CLI flag
mmx text chat --message "Hello" --region cn

# Persistent
mmx config set --key region --value cn
```
