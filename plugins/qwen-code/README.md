# qwen-code Plugin for SuperCLI

[qwen-code](https://github.com/QwenLM/qwen-code) is Alibaba's agentic coding
CLI — a Gemini CLI fork adapted for Qwen3-Coder. It agentically reads, edits,
and runs code in your repo, supports MCP tool servers, and has a headless
`-p` mode for scripting.

## Installation

```bash
# Install qwen binary (Node 18+)
npm install -g @qwen-code/qwen-code

# Install supercli plugin
supercli plugins install ./plugins/qwen-code
```

Auth: run `qwen` once for Qwen OAuth (free tier) **or** export
`OPENAI_API_KEY` + `OPENAI_BASE_URL` + `OPENAI_MODEL` for any
OpenAI-compatible endpoint (including local vllm/llama.cpp).

## Commands

| Command | Description |
|---------|-------------|
| `supercli qwen-code self version` | Show qwen-code version |
| `supercli qwen-code agent ask "<prompt>"` | Headless one-shot agent run |
| `supercli qwen-code agent chat` | Interactive TUI agent |
| `supercli qwen-code mcp manage` | Manage MCP servers |
| `supercli qwen-code <any>` | Passthrough to qwen CLI |

## Usage

```bash
# Headless: ask the agent to do one task and exit
supercli qwen-code agent ask "Summarize the architecture of this repo"

# Fully unattended (auto-approve all tools — use with care)
supercli qwen-code _ _ -p "add a LICENSE file" --yolo

# Manage MCP tool servers
supercli qwen-code mcp manage list

# Interactive mode
supercli qwen-code agent chat
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
