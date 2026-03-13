# Skill Documents (SKILL.md)

SUPERCLI includes a SKILL.md teaching/catalog system for local LLMs and agents.

Terminology:
- **Capability**: executable command endpoint (commands, MCP tool bindings, OpenAPI-backed operations, workflows).
- **Skill document**: instruction artifact returned by `supercli skills ...` commands.

## Key Features

- **Bootstrapping Skill Docs (`teach`)**: Emits a meta-skill document (Markdown compatible with Anthropic/OpenAI instructions) describing SuperCLI and available namespaces/resources.
- **Capability Doc Extraction (`get <cmd>`)**: Pulls one command capability and formats it as a self-contained agent instruction document.
- **Embedded DAG Planning**: Optionally injects execution plan information (`--show-dag`) into the generated skill document to teach dry-run-first workflows.

## Usage

```bash
# List all available capabilities briefly as an index
supercli skills list --json

# Extract the global knowledge required to teach an agent how SUPERCLI works
supercli skills teach

# Generate a hyper-specific instruction for an AI agent on how to call a command
supercli skills get oapi.todos.list

# Same as above, but instruct the AI on execution planning
supercli skills get oapi.todos.list --show-dag
```
