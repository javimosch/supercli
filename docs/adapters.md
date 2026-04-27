# Custom Adapters

Custom adapters are JavaScript modules that extend supercli's execution capabilities. They can be created and managed entirely through the server UI, with integrated code editing, package management, and sandboxed execution.

## Overview

Custom adapters allow you to define custom execution logic for commands. Unlike built-in adapters (http, openapi, mcp, shell, process), custom adapters are user-defined JavaScript functions that can:

- Execute arbitrary JavaScript code in a sandboxed environment
- Install and use NPM packages
- Run in either server context (on the server) or CLI context (synced to local CLI)
- Configure timeout, memory limits, and network access
- Be tested directly from the UI

## Execution Contexts

Custom adapters support two execution contexts:

### Server Context
- Adapter code runs on the supercli server
- Executes via vm2 sandbox
- When CLI delegates to server, the adapter runs server-side
- Ideal for adapters that need server resources or centralized execution

### CLI Context
- Adapter code syncs to local CLI via `sc sync`
- Executes locally on the CLI machine using vm2 sandbox
- Stored in `.supercli/adapters/` directory
- Ideal for adapters that need local machine access (e.g., local databases, filesystem)

## Creating an Adapter

1. Navigate to `/adapters` in the server UI
2. Click "+ New Adapter"
3. Fill in the adapter details:
   - **Name**: Unique identifier (used as adapter name in commands)
   - **Description**: Human-readable description
   - **Execution Context**: "server" or "cli"
   - **Timeout**: Maximum execution time in milliseconds (default: 30000)
   - **Memory Limit**: Maximum memory in MB (default: 128)
   - **Network Access**: Allow NPM packages to make network requests (default: false)
4. Write your adapter code in the CodeMirror editor
5. Click "Save Adapter"

## Adapter Code Structure

Custom adapters must export an `execute` function:

```javascript
/**
 * @name my-adapter
 * @description My custom adapter
 * @context server
 */

async function execute(cmd, flags, context) {
  // cmd: Command object with namespace, resource, action, adapter, adapterConfig
  // flags: Command arguments/flags passed at runtime
  // context: Execution context (config, server, etc.)
  
  // Your custom logic here
  const result = {
    success: true,
    data: { /* your output */ }
  }
  
  return result
}

module.exports = { execute }
```

## Using Custom Adapters

Once created, custom adapters appear in the adapter dropdown when creating/editing commands:

1. Navigate to `/commands` in the server UI
2. Create or edit a command
3. Select your custom adapter from the "Custom" section of the adapter dropdown
4. Configure adapterConfig as needed by your adapter
5. Save the command

The command will now use your custom adapter for execution.

## Package Management

Custom adapters can depend on NPM packages:

1. Navigate to `/adapters/{name}/packages` for your adapter
2. Add packages by name (e.g., `axios`, `lodash`)
3. Click "Add Package" to install
4. Packages are installed in a node_modules directory for that adapter
5. Use packages in your adapter code via standard `require()`

```javascript
const axios = require('axios')

async function execute(cmd, flags, context) {
  const response = await axios.get('https://api.example.com/data')
  return { data: response.data }
}

module.exports = { execute }
```

### Package Operations

- **Add**: Install a new NPM package
- **Remove**: Uninstall a package
- **Prune**: Remove unused dependencies

## Testing Adapters

Server-context adapters can be tested directly from the UI:

1. Navigate to `/adapters`
2. Click "Test" on your adapter
3. Provide test flags (JSON object)
4. Click "Run Test"
5. View execution result, duration, and any errors

## CLI Sync

CLI-context adapters are synced to the local CLI via `sc sync`:

```bash
export SUPERCLI_SERVER=http://localhost:3000
sc sync
```

During sync:
- CLI-context adapters are fetched from the server
- Adapter source code is written to `.supercli/adapters/{name}.js`
- Metadata header is added to the file (timeout, memory, network settings)
- Sync result shows total, synced, and failed counts

## Security

Custom adapters run in a vm2 sandbox with:

- **Timeout**: Prevents infinite loops (configurable per adapter)
- **Memory limits**: Prevents memory exhaustion (configurable per adapter)
- **Network control**: Optional network access for NPM packages
- **Console sandboxing**: Console output is suppressed in sandbox

## API Endpoints

The server exposes the following API endpoints for custom adapters:

- `GET /api/adapters` - List all adapters
- `POST /api/adapters` - Create new adapter
- `GET /api/adapters/:name` - Get adapter metadata
- `GET /api/adapters/:name/source` - Get adapter source code
- `PUT /api/adapters/:name` - Update adapter
- `DELETE /api/adapters/:name` - Delete adapter
- `POST /api/adapters/:name/test` - Test adapter execution
- `POST /api/adapters/:name/packages` - Add package
- `DELETE /api/adapters/:name/packages/:package` - Remove package
- `POST /api/adapters/execute` - Execute adapter (for CLI delegation)
