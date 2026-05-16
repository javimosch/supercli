---
name: paseo
description: Use this skill when the user wants to orchestrate AI coding agents — start/stop daemon, run agents, send tasks, monitor progress across Claude Code, Codex, and OpenCode.
---

# Paseo — Agent Orchestration Platform

One interface for Claude Code, Codex, and OpenCode. Self-hosted daemon. CLI, mobile, desktop, web. By [getpaseo/paseo](https://github.com/getpaseo/paseo) (6.2k⭐).

## Skills Indexed (7)

Auto-discovered via `remote_repo` from `getpaseo/paseo`:
```bash
sc skills search "handoff" --provider paseo
sc skills get paseo:paseo-handoff
sc skills get paseo:paseo-loop
sc skills get paseo:paseo-advisor
sc skills get paseo:paseo-committee
sc skills get paseo:paseo-epic
sc skills get paseo:paseo-orchestrate
```

## Quick Start

```bash
npm install -g @getpaseo/cli
paseo daemon start                     # Start daemon
sc paseo daemon status                 # Check health
sc paseo agent run --detach "fix bug"  # Deploy agent
sc paseo agent list                    # List agents
```

## Commands

### Daemon
- `sc paseo daemon start [flags]` — start daemon (`--port`, `--listen`, `--home`, `--foreground`, `--no-relay`, `--no-mcp`, `--no-inject-mcp`)
- `sc paseo daemon stop` — stop daemon
- `sc paseo daemon status` — check daemon health
- `sc paseo self version` — print version
- `sc paseo self mcp` — register MCP server

### Agent
- `sc paseo agent run <prompt>` — run agent with task (`--detach`, `--title`, `--provider`, `--model`, `--thinking`, `--mode`, `--worktree`, `--image`, `--cwd`, `--label`, `--wait-timeout`, `--output-schema`)
- `sc paseo agent list [-a]` — list agents (include archived)
- `sc paseo agent send <id> [msg]` — send message (`--prompt`, `--prompt-file`, `--image`, `--no-wait`)
- `sc paseo agent logs <id>` — view logs (`--follow`, `--tail`, `--filter`, `--since`)

### Global Flags
- `--host <host>` — connect to remote daemon
- `--json` — JSON output
- `-q, --quiet` — minimal output

## Requirements

- Node.js 18+
- `npm install -g @getpaseo/cli` (500+ deps, ~2 min install, proprietary license)
- At least one agent CLI: Claude Code, Codex, or OpenCode

## Setup Guide

### 1. Install

```bash
npm install -g @getpaseo/cli
```

The install takes ~2 minutes with 500+ dependencies. Heavy but expected for agent orchestration.

### 2. Verify the CLI binary

```bash
paseo --version
# → 0.1.76
```

**Caveat:** If you also have the Paseo desktop AppImage installed, check that `which paseo` points to the CLI at `~/.nvm/versions/node/.../bin/paseo`, NOT a desktop AppImage symlink at `~/.local/bin/paseo`. The AppImage will fail with `error: unknown command '...supervisor-entrypoint.js'`.

### 3. Start the daemon

```bash
paseo daemon start --port 6767
```

The daemon starts in background automatically (daemonizes). Check status:
```bash
paseo status
```

### 4. Verify providers

The daemon auto-detects available agent CLIs:
```
Providers
  Claude   /path/to/claude (2.1.128)
  Codex    /path/to/codex  (0.112.0)
  OpenCode /path/to/opencode (1.14.50)
```

## Voice / Speech Configuration

### Config File

Edit `~/.paseo/config.json`:
```json
{
  "version": 1,
  "features": {
    "dictation": {
      "stt": { "provider": "local", "model": "parakeet-tdt-0.6b-v3-int8", "language": "en" }
    },
    "voiceMode": {
      "llm": { "provider": "claude", "model": "haiku" },
      "stt": { "provider": "local", "model": "parakeet-tdt-0.6b-v3-int8", "language": "en" },
      "tts": { "provider": "local", "model": "kokoro-en-v0_19", "speakerId": 0 }
    }
  },
  "daemon": {
    "listen": "127.0.0.1:6767",
    "mcp": { "injectIntoAgents": false },
    "autoArchiveAfterMerge": false,
    "cors": { "allowedOrigins": ["https://app.paseo.sh"] },
    "relay": { "enabled": true }
  },
  "app": { "baseUrl": "https://app.paseo.sh" },
  "agents": {
    "providers": {
      "copilot": { "enabled": false },
      "opencode": { "enabled": false },
      "codex": { "enabled": false }
    }
  }
}
```

### Model Auto-Download

Models download **automatically** on daemon startup. The download is async — the daemon starts serving immediately and downloads in background.

Available models:
- `parakeet-tdt-0.6b-v3-int8` — STT (speech-to-text), ~650MB
- `kokoro-en-v0_19` — TTS (text-to-speech), ~30MB
- `silero-vad` — Voice Activity Detection, bundled

Storage path: `~/.paseo/models/local-speech/`

To verify a model completed:
```bash
ls ~/.paseo/models/local-speech/
# Should see: kokoro-en-v0_19  sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8  silero-vad
```

### Verifying speech services

Check the daemon log for successful initialization:
```bash
grep "initialized\|completed" ~/.paseo/daemon.log | grep speech
# → Sherpa offline recognizer initialized
# → Sherpa offline TTS initialized
# → Speech provider reconciliation completed
```

All 4 services should show as `local`:
```
effectiveProviders: dictationStt=local, voiceStt=local, voiceTts=local, voiceTurnDetection=local
```

## Daemon Management

### Start
```bash
nohup paseo daemon start --port 6767 --foreground > ~/.paseo/daemon.log 2>&1 &
```

### Stop
```bash
paseo daemon stop
```

### Status
```bash
paseo status
```

### Restart (for config changes)
Config is read at daemon startup. Changes to `~/.paseo/config.json` require a restart:
```bash
paseo daemon stop && sleep 2 && paseo daemon start --port 6767
```

### Logs
```bash
tail -f ~/.paseo/daemon.log
```

## Web UI

Open `https://app.paseo.sh` in a browser. The web app connects to your local daemon automatically if running on the same machine.

For remote access via QR code/pairing: the daemon connects to `wss://relay.paseo.sh:443` which enables the mobile app and remote desktop clients.

## Caveats & Pitfalls

### 1. Voice features require audio hardware
`app.paseo.sh` and the desktop app show **"requested device not found"** if the machine lacks a microphone/speaker. This is a browser WebRTC limitation on headless servers. Voice mode (dictation, voice STT, voice TTS) only works on machines with actual audio hardware (laptops, phones).

### 2. AppImage overrides CLI binary
If you install both the Paseo desktop AppImage and the npm CLI, `~/.local/bin/paseo` may symlink to the AppImage. The AppImage cannot run CLI commands like `daemon start`. Fix:
```bash
rm ~/.local/bin/paseo
# Now `which paseo` should resolve to the npm CLI binary
```

### 3. Model download can be slow
STT models are ~650MB. First daemon startup will show STT/TTS as "unavailable" until downloads complete. This is normal — check `~/.paseo/models/local-speech/.downloads/` for progress. The daemon continues working for non-voice features during download.

### 4. Model version matters
The config specifies model ID `parakeet-tdt-0.6b-v3-int8`. If the wrong version is specified (e.g. v2), the daemon will download the missing one automatically. But old downloaded versions accumulate in `~/.paseo/models/local-speech/` — clean up manually.

### 5. Config change requires restart
The daemon reads `~/.paseo/config.json` only at startup. Edited config while running? Stop and restart.

### 6. Agents disabled via config must restart
Disabling providers (`"opencode": {"enabled": false}`) takes effect after daemon restart. The daemon detects installed CLIs on startup.

### 7. 500+ npm dependencies
`npm install -g @getpaseo/cli` is slow (~2 min) and pulls in heavy packages like `@anthropic-ai/claude-agent-sdk`, `@agentclientprotocol/sdk`, sherpa-onnx (speech models). Expected for an agent orchestration platform.

### 8. Web UI serves WebSocket, not HTTP
The daemon listens on `:6767` for WebSocket connections. It does NOT serve an HTTP web UI. The web UI is at `https://app.paseo.sh` — it connects to your daemon via WebSocket.

### 9. GPU requirements for speech models
The sherpa-onnx STT model may need GPU acceleration for real-time performance. The daemon shows `VAAPI version too old` on machines without GPU support — speech works but may be slower.

### 10. MCP server registration
`sc paseo self mcp` registers the Paseo MCP server in `~/.supercli/mcp.json`. The MCP server runs as a subprocess of the daemon and is accessible at `localhost:6767/mcp/agents`.

### 11. Voice Mode vs Dictation Mode — Critical Difference
Paseo has two different voice features:

| Mode | STT (you→text) | TTS (agent→speech) | Speak tool |
|------|---------------|-------------------|------------|
| **Dictation** | ✅ Speech→text input | ❌ No audio output | ❌ Not needed |
| **Voice Mode** | ✅ Speech→text input | ✅ Agent speaks back | ✅ Required |

**Dictation mode** only transcribes your speech to text. The agent responds as text (no audio). This is useful for hands-free text input but the agent never speaks.

**Voice mode** is full-duplex: you speak → STT transcribes → agent receives spoken input with instruction to use the "speak" tool → agent calls speak tool → TTS synthesizes response → audio played to you.

In the desktop/web UI, the microphone icon toggles dictation, while the voice mode toggle (often labeled "Voice" or a separate icon) enables full voice mode. If you only see text responses, make sure you've activated **voice mode** specifically, not just dictation.

### 12. Speak Tool Requires Agent Created AFTER Voice Mode Activation
The "speak" MCP tool that allows the agent to output speech is ONLY registered when:
1. Voice mode is enabled via `set_voice_mode { enabled: true }`
2. AND a new agent is created after that point

If you toggle voice mode ON but continue chatting with an already-running agent, that agent's MCP server was initialized without `enableVoiceTools: true` and the speak tool is NOT available. The agent will respond with text because it has no way to speak.

**Workflow to get agent speaking:**
1. Open the desktop app
2. Turn voice mode ON first (not dictation)
3. **Create a new agent / start a new conversation** (don't reuse an existing one)
4. Speak — the new agent should have the speak tool

The daemon log confirms voice mode is enabled with:
```
set_voice_mode enabling voice for agent → agent enable complete → Voice mode enabled for existing agent
```

But if no `audio_output` messages appear in the session metrics, the speak tool was never registered for that agent.

### 13. No Config or CLI Flag for Auto-Enabling Voice Mode
There is no config flag in `~/.paseo/config.json` to auto-enable voice mode at daemon startup. Voice mode must be activated per-session from the app UI. The `set_voice_mode` message is sent via WebSocket — there's no equivalent CLI command.

The relevant source code in `session.ts`:
```typescript
// voice mode must be explicitly enabled per-session
case "set_voice_mode":
    return this.handleSetVoiceMode(msg.enabled, msg.agentId, msg.requestId);
```

### 14. Agent Must Support MCP Tool Calling
The speak tool is an MCP tool registered by the Paseo daemon's agent MCP server. The agent (Claude Code, Codex, OpenCode) must support calling MCP tools. Some smaller models (like Claude Haiku) may not reliably invoke the speak tool even when instructed by the system prompt.

The voice mode system prompt explicitly tells the agent:
```
"Always use the speak tool for all user-facing communication."
```

But if the model doesn't follow tool-use instructions consistently, it will fall back to text responses. For the best voice experience, use a larger model (Claude Sonnet, GPT-4o, etc.) via `voiceMode.llm.model`.

### 15. Proven Working Voice Mode Config
This config is confirmed to make the agent speak back properly:

```json
{
  "features": {
    "voiceMode": {
      "llm": {
        "provider": "opencode",
        "model": "opencode-go/deepseek-v4-flash"
      },
      "stt": {
        "provider": "local",
        "model": "parakeet-tdt-0.6b-v3-int8",
        "language": "en"
      },
      "tts": {
        "provider": "local",
        "model": "kokoro-en-v0_19",
        "speakerId": 0
      }
    }
  },
  "providers": {
    "local": {
      "modelsDir": "/root/.paseo/models/local-speech"
    }
  }
}
```

Key differences from broken config:
- `voiceMode.llm.provider` set to `opencode` (not `claude`)
- `voiceMode.llm.model` set to `opencode-go/deepseek-v4-flash` (MCP-aware model)  
- `providers.local.modelsDir` explicitly points to the speech models directory

Claude's Haiku model does not reliably call the speak tool. OpenCode with deepseek-v4-flash does.

## Tips

- Start daemon first, then run agents
- Use `--detach` to run agents in background (foreground waits for completion)
- Use `--provider codex/gpt-5.4` to specify both provider and model in one flag
- Combine with 7 Paseo skills for multi-agent workflows (handoff, loop, committee, advisor, epic)
- On a headless server, disable voice features in config to avoid startup warnings
- For remote daemon access: `paseo --host workstation.local:6767 run "task"`
