# Agent-Friendly Tooling

supercli is designed from the ground up to be frictionless for AI agents to discover, understand, and interact with infrastructure.

## Key Features

- **Machine-Readable Discovery (`--help-json`)**: Emits the entire capability tree of the CLI in a single nested JSON object, allowing agents to ingest all available namespaces, resources, and actions at once.
- **Input/Output Schemas (`--schema`)**: Returns JSON schemas for command arguments and expected outputs, giving agents strict contracts.
- **Token Optimization (`--compact`)**: Compresses verbose JSON payload keys into short aliases (e.g., `namespace` -> `ns`) to save on LLM context windows.
- **Automatic JSON Envelope (`--json`)**: Wraps all output (success or failure) in a deterministic envelope with metadata like duration and execution command.
- **Smart Piped Input**: Automatically detects if data is piped via `stdin` and parses JSON into command arguments seamlessly (perfect for chaining workflows).
- **Separation of Concerns**: Informational logs or human-readable warnings go to `stderr`, while pure data goes to `stdout`, keeping pure JSON piping safe.

## Usage

```bash
# Get all available commands formatted for agents
supercli --help-json

# Inspect argument and return schemas for a specific command
supercli <namespace> <resource> <action> --schema

# Execute a command and get output in compact, token-saving mode
supercli <namespace> <resource> <action> --compact

# Pipe JSON directly into a command
echo '{"id": 123}' | supercli <namespace> <resource> <action> --json
```
