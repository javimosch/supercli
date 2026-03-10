# AI Skills Support

SUPERCLI natively integrates a teaching mechanism to empower local LLMs/agents with context about the application's CLI interface.

## Key Features

- **Bootstrapping Skills (`teach`)**: Emits a meta-skill document (in Markdown format compatible with Anthropic/OpenAI instructions) detailing the core architectural design of SUPERCLI and dynamically listing the namespaces and resources available.
- **Micro-Skills Extraction (`get <cmd>`)**: Automatically pulls a specific SUPERCLI command's capabilities and formats it into a self-contained AI-actionable tool instruction (e.g., Markdown schema).
- **Embedded DAG Planning**: Optionally injects execution plan information (`--show-dag`) into a skill's document to teach agents how to handle dry-runs for risky operations before execution.

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

# Get the baked plugin discovery/install skill
supercli skills get plugins.registry.usage --format skill.md

# Get the baked plugin creation skill
supercli skills get plugins.harness.create --format skill.md
```
