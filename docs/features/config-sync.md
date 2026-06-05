# Configuration Synchronization

supercli leverages a caching strategy that allows the CLI executable to run blazingly fast while decoupling read operations from needing immediate backend validation.

## Key Features

- **Offline Command Trees**: Upon a synchronization phase, supercli pulls down the entire state of the backend configuration (commands, actions, MCP servers, OpenAPI specs) into a rapid-access local flat file cache (`.supercli_cache.json`).
- **Speed Sub-Millisecond Dispatch**: Bypassing HTTP verification checks manually against the server saves precious tokens and network latency. The `help`, `inspect`, and `skills` routing operations become instant.
- **Independent Execution**: You do not strictly need a running server to perform offline tool execution or registry manipulation (such as adding internal MCP tools natively to the cache).

## Usage

```bash
# Sync entire backend state locally
supercli sync

# Inspect local cache statistics (commands stored, cache TTL, mcp servers)
supercli config show

# Start executing against local registry (network calls defer to MCP providers instead of backend)
supercli ai text summarize "Offline CLI Mode"
```
