HUMAN:
Write down spec for CLI + WebUI for configuration

Tech stack: NodeJS, MongoDB, EJS, TailwindCDN,DaisyUICDN, Vue3CDN (No deps) (modular) (< 500 LOC per file)

AI:
## 1. Overview

**DCLI** is a **cloud-defined dynamic CLI** whose commands are generated from a central configuration.
Configuration is managed through a **Web UI** and stored in **MongoDB**.

The CLI runtime loads command definitions from the cloud, caches them locally, and executes commands through adapters such as:

* OpenAPI
* MCP servers
* HTTP
* Custom integrations

---

# 2. System Architecture

```
          +-------------------+
          |     Web UI        |
          | Vue + EJS + TW    |
          +---------+---------+
                    |
                    |
            REST / RPC API
                    |
                    v
          +-------------------+
          |   NodeJS Backend  |
          | config service    |
          +---------+---------+
                    |
                    v
               MongoDB
                    |
                    |
           CLI fetches config
                    |
                    v
          +-------------------+
          |      DCLI         |
          | local runtime     |
          +-------------------+
```

---

# 3. Core Concepts

## Command

A command is defined as:

```
namespace resource action
```

Example:

```
referential users fetch
```

Execution:

```
dcli referential users fetch --id 42
```

---

## Adapters

Execution backends.

Supported adapters:

```
openapi
mcp
http
shell
custom
```

---

## Namespaces

Logical grouping.

Examples:

```
referential
infra
billing
ai
```

---

# 4. MongoDB Data Model

## commands

```
{
  _id,
  namespace: "referential",
  resource: "users",
  action: "fetch",

  description: "Fetch a user",

  adapter: "openapi",

  adapterConfig: {
      specId: "referential-api",
      operationId: "getUser"
  },

  arguments: [
      {
        name: "id",
        type: "string",
        required: true
      }
  ],

  createdAt,
  updatedAt
}
```

---

## openapi_specs

```
{
  _id,
  name: "referential-api",
  url: "https://api.company.com/openapi.json",
  auth: "oauth"
}
```

---

## mcp_servers

```
{
  _id,
  name: "ai-tools",
  url: "https://mcp.company.com"
}
```

---

## adapters_custom

```
{
  _id,
  name: "deployLambda",
  type: "node",
  file: "integrations/deployLambda.js"
}
```

---

## settings

```
{
  key: "config_version",
  value: "abc123"
}
```

Used for CLI cache invalidation.

---

# 5. CLI Specification

## Binary

```
dcli
```

---

## Command Syntax

```
dcli <namespace> <resource> <action> [args]
```

Example:

```
dcli referential users fetch --id 42
```

---

## Built-in Commands

### help

```
dcli help
```

Lists namespaces.

---

### config refresh

```
dcli config refresh
```

Forces cache refresh.

---

### config show

```
dcli config show
```

Displays current configuration version.

---

# 6. CLI Config Cache

Location:

```
~/.dcli/config.json
```

Example:

```
{
  version: "abc123",
  ttl: 3600,
  fetched_at: 17000000,
  commands: []
}
```

---

## Cache Algorithm

Startup:

```
if cache.exists():
    if ttl expired:
        fetch new config
else:
    fetch config
```

---

# 7. CLI Config Fetch API

### GET

```
GET /api/config
```

Response:

```
{
  version: "abc123",
  ttl: 3600,
  commands: [...]
}
```

---

# 8. CLI Execution Flow

Example command:

```
dcli referential users fetch --id 42
```

Flow:

1 parse CLI arguments

2 load config

3 find command

```
referential.users.fetch
```

4 select adapter

```
openapi
```

5 execute adapter

---

# 9. Adapter Interface

NodeJS module interface:

```
execute(command, args, context)
```

Example:

```
module.exports = async function(command, args, ctx) {
}
```

---

# 10. OpenAPI Adapter

Responsibilities:

* load spec
* map operationId
* build request
* execute HTTP call

Example mapping:

```
operationId: getUser
```

Request:

```
GET /users/{id}
```

---

# 11. MCP Adapter

Execution:

```
POST MCP server tool call
```

Config example:

```
{
  server: "ai-tools",
  tool: "summarize"
}
```

---

# 12. Backend API Specification

## Config

### GET

```
/api/config
```

Returns CLI config.

---

## Commands CRUD

### GET

```
/api/commands
```

---

### POST

```
/api/commands
```

---

### PUT

```
/api/commands/:id
```

---

### DELETE

```
/api/commands/:id
```

---

## OpenAPI specs

```
/api/openapi
```

---

## MCP servers

```
/api/mcp
```

---

# 13. Backend Folder Structure

```
/server

app.js

/routes
commands.js
config.js
openapi.js
mcp.js

/services
configService.js
adapterRegistry.js

/adapters
openapi.js
mcp.js
http.js
shell.js

/views
layout.ejs
commands.ejs
command-edit.ejs
openapi.ejs
mcp.ejs

/public
/js
/css
```

---

# 14. Web UI Specification

Rendered using:

```
EJS + Vue3 CDN
Tailwind CDN
DaisyUI CDN
```

---

# 15. Web UI Pages

## Dashboard

Shows:

* number of commands
* namespaces
* adapters

---

## Commands

List of commands.

Table:

```
namespace
resource
action
adapter
description
```

Actions:

```
edit
delete
```

---

## Command Editor

Fields:

```
namespace
resource
action
description
adapter
adapter config
arguments
```

Arguments editor:

```
name
type
required
```

---

## OpenAPI Specs

List:

```
name
url
auth
```

Button:

```
import spec
```

---

## MCP Servers

List:

```
name
url
```

---

# 16. Vue UI Structure

Single Vue app:

```
window.app = Vue.createApp({})
```

Components:

```
CommandList
CommandEditor
SpecList
MCPList
```

All inline modules.

---

# 17. Example WebUI Page

```
/commands
```

Table:

```
+------------+----------+--------+----------+
| namespace  | resource | action | adapter  |
+------------+----------+--------+----------+
| referential| users    | fetch  | openapi  |
```

Button:

```
Create command
```

---

# 18. Security

Authentication optional for v1.

Possible future:

```
JWT
API tokens
```

---

# 19. Config Versioning

Whenever config changes:

```
settings.config_version++
```

CLI detects version mismatch and refreshes.

---

# 20. File Size Constraints

All files:

```
< 500 LOC
```

Strategy:

* small service modules
* simple routes
* lightweight adapters

---

# 21. Example CLI Usage

```
dcli help
```

```
dcli referential
```

```
dcli referential users
```

```
dcli referential users fetch --id 42
```

---

# 22. MVP Scope

Included:

* dynamic CLI commands
* config cloud sync
* OpenAPI adapter
* MCP adapter
* Web UI config

Excluded:

* RBAC
* workflow engine
* plugin marketplace

---

# 23. Future Extensions

Potential additions:

* workflow commands
* CLI auto-complete
* role-based commands
* CLI auth profiles
* SDK generation
* command analytics

---

If you want, I can also design the **actual Mongo schema + CLI runtime architecture that fits in ~1500 LOC total**, which would make a very clean OSS project.
