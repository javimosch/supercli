---
name: acp-cli
description: Use this skill when the user wants to interact with ACP coding agents from the terminal — list agents, create sessions, send prompts, stream completions, or consume Claude/Gemini/Cursor/Copilot via the Agent Communication Protocol.
---

# acp-cli Plugin

Consume ACP coding agents directly from the CLI. The Agent Communication Protocol (ACP) connects editors to AI coding agents via JSON-RPC over stdio.

## Commands

### Registry
- `acp-cli registry list` — List all 35+ ACP agents from the official registry
- `acp-cli registry info` — Show details for a specific ACP agent

### Sessions
- `acp-cli session create` — Create a new session with an ACP agent and optionally send a prompt
- `acp-cli server start` — Launch an ACP server and perform initialize handshake

### Help
- `acp-cli _ help` — Show acp-cli help

## Usage Examples
- "List all available ACP coding agents"
- "Show details about claude-acp agent"
- "Start a Gemini CLI ACP session and ask a question"
- "Create an ACP session with Claude Agent"
- "What ACP agents are registered for coding?"

## Installation

Requires Node.js (for the bundled acp-cli.js script). No npm install needed — the script is self-contained.

## Quick Start

```bash
# List all ACP agents
acp-cli registry list

# Show info about a specific agent
acp-cli registry info claude-acp

# Create a session with Gemini CLI and send a prompt
acp-cli session create @google/gemini-cli --prompt "Write a hello world in Rust"

# Create a session with Claude Agent
ANTHROPIC_API_KEY=sk-... acp-cli session:create @agentclientprotocol/claude-agent-acp --prompt "Explain monads"

# Launch a server and inspect the initialize handshake
acp-cli server:start @google/gemini-cli
```

## ACP Agent References

| Agent ID | npx/Binary | Env Key Required |
|----------|-----------|-----------------|
| claude-acp | @agentclientprotocol/claude-agent-acp | ANTHROPIC_API_KEY |
| gemini | @google/gemini-cli | GEMINI_API_KEY |
| copilot | @github/copilot | GITHUB_TOKEN |
| cline | cline | ANTHROPIC_API_KEY |
| kilo | @kilocode/cli | — |
| codex | @zed-industries/codex-acp | CODEX_API_KEY |
| qwen | @qwen-code/qwen-code | — |
| deepagents | deepagents-acp | — |
| dimcode | dimcode | — |
| auggie | @augmentcode/auggie | — |
| dirac | dirac-cli | — |
| nova | @compass-ai/nova | — |
| glm | glm-acp-agent | — |
| autohand | @autohandai/autohand-acp | — |

## How It Works

ACP uses JSON-RPC 2.0 over stdio:
1. Client spawns the agent process
2. Sends `initialize` request with capabilities
3. Agent responds with protocol version + agent info
4. Client sends `sessions/new` to create a session
5. Client sends `sessions/prompt` with the prompt
6. Agent streams responses via `session/update` notifications
7. Session closes when done

## Notes
- ACP agents are launched as subprocesses — no server daemon needed
- Each agent requires its own API key (set as environment variable)
- The session create command uses `npx` to auto-install agent packages
- Binary-only agents (Cursor, Goose, Junie, etc.) need manual installation
