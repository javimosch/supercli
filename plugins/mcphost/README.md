# mcphost Plugin for SuperCLI

[mcphost](https://github.com/mark3labs/mcphost) is a lightweight Go MCP host —
it connects LLMs to Model Context Protocol tool servers. Point it at Ollama
for a fully local, no-API-key agent, or at OpenAI/Anthropic/Google/any
OpenAI-compatible endpoint.

## Installation

```bash
# Install mcphost binary (Go 1.23+)
go install github.com/mark3labs/mcphost@latest
# or download a release binary from github.com/mark3labs/mcphost/releases

# Install supercli plugin
supercli plugins install ./plugins/mcphost
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli mcphost self version` | Show mcphost version |
| `supercli mcphost agent ask` | One-shot, reads prompt from stdin |
| `supercli mcphost agent script <file>` | YAML multi-step automation |
| `supercli mcphost agent chat` | Interactive MCP-backed chat |
| `supercli mcphost <any>` | Passthrough to mcphost CLI |

## Usage

```bash
# One-shot via stdin — fully local with Ollama
echo "List the files in this directory" | supercli mcphost agent ask --model ollama:qwen2.5

# With a custom MCP config
supercli mcphost agent ask --model openai:gpt-4o --config ./mcp-servers.json

# YAML automation with tool calls between steps
supercli mcphost agent script ./automation.yml

# Interactive
supercli mcphost agent chat --model ollama:qwen2.5
```

Config: `~/.mcp.json` holds MCP server definitions (same shape as Claude
Desktop config). Built-in servers (filesystem, bash, todo, http) need no
extra install.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
