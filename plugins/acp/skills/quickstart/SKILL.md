---
name: acp
description: Use this skill when the user wants to interact with AI coding agents via the Agent Communication Protocol (ACP), list available ACP servers, start a coding agent, or inspect the ACP registry.
---

# acp Plugin

Agent Communication Protocol (ACP) CLI — standardizes communication between editors and AI coding agents. 35+ registered agents.

## Commands

### Registry
- `acp registry list` — List all 35+ ACP agents from registry (JSON)
- `acp registry info` — Get info about a specific ACP agent (requires piping curl output to jq)

### Servers (Launch ACP Agents)
- `acp server claude` — Start Claude Agent ACP (npx @agentclientprotocol/claude-agent-acp)
- `acp server gemini` — Start Gemini CLI ACP (npx @google/gemini-cli --acp)
- `acp server copilot` — Start GitHub Copilot ACP (npx @github/copilot --acp)
- `acp server cursor` — Start Cursor ACP (binary: cursor-agent acp)
- `acp server opencode` — Start OpenCode ACP (binary: opencode acp)
- `acp server codex` — Start Codex CLI ACP (npx @zed-industries/codex-acp)
- `acp server cline` — Start Cline ACP (npx cline --acp)
- `acp server kilo` — Start Kilo ACP (npx @kilocode/cli acp)
- `acp server goose` — Start Goose ACP (binary: goose acp)
- `acp server qwen` — Start Qwen Code ACP (npx @qwen-code/qwen-code --acp)
- `acp server mistral` — Start Mistral Vibe ACP (binary: vibe-acp)
- `acp server kimi` — Start Kimi CLI ACP (binary: kimi acp)
- `acp server deepagents` — Start DeepAgents ACP (npx deepagents-acp)
- `acp server dimcode` — Start DimCode ACP (npx dimcode acp)
- `acp server auggie` — Start Auggie CLI ACP (npx @augmentcode/auggie --acp)
- `acp server dirac` — Start Dirac ACP (npx dirac-cli --acp)
- `acp server junie` — Start Junie ACP (binary: junie --acp=true)
- `acp server nova` — Start Nova ACP (npx @compass-ai/nova acp)
- `acp server factory` — Start Factory Droid ACP (npx droid exec --output-format acp-daemon)
- `acp server qoder` — Start Qoder CLI ACP (npx @qoder-ai/qodercli --acp)
- `acp server agoragentic` — Start Agoragentic ACP (npx agoragentic-mcp --acp)
- `acp server glm` — Start GLM Agent ACP (npx glm-acp-agent)
- `acp server autohand` — Start Autohand Code ACP (npx @autohandai/autohand-acp)
- `acp server codebuddy` — Start Codebuddy Code ACP (npx @tencent-ai/codebuddy-code --acp)
- `acp server pi` — Start pi ACP (npx pi-acp)
- `acp server fast` — Start fast-agent ACP (uvx fast-agent-acp -x)
- `acp server minion` — Start Minion Code ACP (uvx minion-code acp)
- `acp server start` — Start any ACP agent by npx package name

## Usage Examples
- "List all ACP coding agents"
- "Start Claude Code ACP agent"
- "Launch Gemini CLI via ACP"
- "Start Cline as an ACP server"
- "Find info about an ACP agent in the registry"

## Installation

```bash
# npx is included with Node.js
# Install Node.js from nodejs.org
```

## Registry Access

```bash
# List all ACP agents
acp registry list

# Get info about an agent (pipe through jq)
acp registry list | jq '.agents[] | select(.id=="claude-acp")'

# Pretty-print all agent names
acp registry list | jq '.agents[].name'
```

## Launching ACP Servers

Start a Claude ACP server (requires ANTHROPIC_API_KEY):

```bash
acp server claude
```

Start Gemini CLI ACP (requires GEMINI_API_KEY):

```bash
acp server gemini
```

Start any ACP server via npx:

```bash
acp server start @agentclientprotocol/claude-agent-acp
```

## All 35 Registered ACP Agents

| ID | Name | Type |
|----|------|------|
| claude-acp | Claude Agent | npx |
| gemini | Gemini CLI | npx |
| github-copilot-cli | GitHub Copilot | npx |
| cursor | Cursor | binary |
| opencode | OpenCode | binary |
| codex-acp | Codex CLI | npx/binary |
| cline | Cline | npx |
| kilo | Kilo | npx/binary |
| goose | goose | binary |
| qwen-code | Qwen Code | npx |
| mistral-vibe | Mistral Vibe | binary |
| kimi | Kimi CLI | binary |
| deepagents | DeepAgents | npx |
| dimcode | DimCode | npx |
| auggie | Auggie CLI | npx |
| dirac | Dirac | npx |
| junie | Junie | binary |
| nova | Nova | npx |
| factory-droid | Factory Droid | npx |
| qoder | Qoder CLI | npx |
| agoragentic-acp | Agoragentic | npx |
| glm-acp-agent | GLM Agent | npx |
| autohand | Autohand Code | npx |
| codebuddy-code | Codebuddy Code | npx |
| pi-acp | pi ACP | npx |
| fast-agent | fast-agent | uvx |
| minion-code | Minion Code | uvx |
| amp-acp | Amp | binary |
| corust-agent | Corust Agent | binary |
| crow-cli | crow-cli | binary |
| poolside | Poolside | binary |
| sigit | siGit Code | npx/binary |
| stakpak | Stakpak | binary |
| vtcode | VT Code | binary |
| cortex-code | Cortex Code | binary |

## Notes
- ACP agents communicate over stdio via JSON-RPC
- Most agents require API keys (set as env vars)
- npx agents auto-install on first run
- Binary agents need manual download from their releases page
- The ACP registry is at cdn.agentclientprotocol.com

## Tested ACP Agents (18/35 handshake OK)

### Full prompt response (tested via OpenRouter free models)
| Agent | Handshake | Prompt Response | Notes |
|-------|-----------|----------------|-------|
| opencode | ✅ | ✅ "Hello" via mimo-v2-flash | Full ACP lifecycle works |
| claude-acp | ✅ | ✅ "Hello! How can I help?" via mimo | 18k tokens |
| qoder | ✅ | ✅ "Hello! How can I help?" via mimo | Works with model override |
| dirac | ✅ | ✅ "Hello! I'm Dirac, ready to help" | Uses own model, no key needed |
| agoragentic | ✅ | ✅ Tool bridge (tools/list, tools/call) | Not a chat agent |
| auggie | ✅ | ✅ Workspace index prompt | Needs workspace config |

### Handshake OK, prompt auth-gated
| Agent | Handshake | Needs |
|-------|-----------|-------|
| cline | ✅ | ANTHROPIC_API_KEY |
| goose | ✅ | GOOGLE_API_KEY / ANTHROPIC_API_KEY |
| kimi | ✅ | KIMI_API_KEY |
| dimcode | ✅ | OPENAI_API_KEY |
| glm-acp-agent | ✅ | Z_AI_API_KEY |
| deepagents | ✅ | API key |
| pi-acp | ✅ | API key |
| nova | ✅ | API key |
| fast-agent | ✅ | API key |
| qwen-code | ✅ | API key |
| autohand | ✅ | API key |
| codebuddy-code | ✅ | API key |

### Free model support via OpenRouter
Configure opencode with `xiaomi/mimo-v2-flash` or `openrouter/free` via `--model` flag:

```bash
acp-cli session:create opencode --model xiaomi/mimo-v2-flash --prompt "Hello"
acp-cli session:create claude-acp --model xiaomi/mimo-v2-flash --prompt "Hello"
```

## Adding OpenRouter for Free Model Access

Some ACP agents support overriding the LLM model via the ACP `session/set_config_option` protocol method. To use free models via OpenRouter:

### 1. Get an OpenRouter API key
Get a key from https://openrouter.ai/keys (free tier available with rate limits).

### 2. Add provider to opencode config
Edit `~/.config/opencode/opencode.json` and add under the `"provider"` key:

```json
"openrouter": {
  "npm": "@ai-sdk/openai-compatible",
  "name": "OpenRouter.ai (free models)",
  "options": {
    "baseURL": "https://openrouter.ai/api/v1",
    "apiKey": "sk-or-v1-YOUR_KEY_HERE"
  },
  "models": {
    "free": { "name": "openrouter/free" },
    "mimo-v2-flash": { "name": "xiaomi/mimo-v2-flash" },
    "gemini-flash": { "name": "google/gemini-2.0-flash-exp" }
  }
}
```

### 3. Use with acp-cli
```bash
# Override model via ACP protocol
acp-cli session:create opencode --model xiaomi/mimo-v2-flash --prompt "Say hi"

# Works with agents that support config overrides
acp-cli session:create claude-acp --model xiaomi/mimo-v2-flash --prompt "Hello"
```

### How it works
The `--model` flag sends `session/set_config_option` with `{configId: "model", value: "provider/model-name", type: true}` after session creation. The agent then routes prompts through that provider's model.

### Which agents support model override
- **opencode** ✅ (tested: `xiaomi/mimo-v2-flash` → responded "Hello" with 15k tokens)
- **claude-acp** ✅ (tested: `xiaomi/mimo-v2-flash` → responded with greeting, 18k tokens)
- **qoder** ✅ (tested: `xiaomi/mimo-v2-flash` → responded with greeting)
- **dirac** ⚡ Works out of the box with its own model (no override needed)
- Others: depends on whether the agent implements `session/set_config_option`


