Your principles are **very solid** and actually align almost perfectly with what an **AI-native CLI runtime** like DCLI should be. The interesting part is that because DCLI is **config-driven**, you can enforce many of these principles **at the platform level**, not per command.

That is the real power: **tool authors cannot accidentally break agent-friendliness**.

Below is how I would **translate your philosophy into concrete DCLI architecture rules**.

---

# 1. Make “Agent Mode” the Default

Instead of:

```
human mode default
--json for agents
```

Flip the model.

```
machine mode default
--human for pretty output
```

So execution:

```bash
dcli referential users fetch --id 42
```

returns:

```json
{
  "version": "1.0",
  "command": "referential.users.fetch",
  "data": {
    "id": 42,
    "name": "Alice"
  }
}
```

Human-friendly view:

```bash
dcli referential users fetch --id 42 --human
```

Output:

```
User
ID: 42
Name: Alice
```

This aligns DCLI with **agent-first tooling**.

---

# 2. Make Output Schemas Part of the Command Spec

Your DB command schema should include **output schema**.

Example command:

```json
{
  "namespace": "referential",
  "resource": "users",
  "action": "fetch",

  "adapter": "openapi",

  "args": [
    {"name":"id","type":"string","required":true}
  ],

  "output": {
    "version": "1.0",
    "schema": {
      "type": "object",
      "properties": {
        "id": {"type":"string"},
        "name": {"type":"string"},
        "email": {"type":"string"}
      }
    }
  }
}
```

Benefits:

Agents can query:

```bash
dcli schema referential users fetch
```

Response:

```json
{
  "input_schema": {...},
  "output_schema": {...}
}
```

This is **extremely powerful for tool planning**.

---

# 3. Enforce Semantic Exit Codes Globally

DCLI runtime should **normalize exit codes**.

Adapters return structured errors:

```json
{
  "type": "resource_not_found",
  "message": "User 42 not found"
}
```

The runtime maps:

```
resource_not_found → exit 92
validation_error → exit 82
timeout → exit 105
internal_error → exit 110
```

So adapters never decide exit codes.

The **platform does**.

---

# 4. Built-in Structured Error Format

All failures return the same envelope.

Example:

```json
{
  "error": {
    "code": 92,
    "type": "resource_not_found",
    "message": "User not found",
    "recoverable": false,
    "suggestions": [
      "Run: dcli referential users list"
    ]
  }
}
```

stderr:

```
resource_not_found: User not found
```

Agents parse JSON.

Humans read stderr.

---

# 5. DCLI Should Provide Tool Introspection

Add built-in commands:

### list commands

```bash
dcli commands --json
```

### inspect command

```bash
dcli inspect referential users fetch
```

Example:

```json
{
  "command": "referential.users.fetch",
  "description": "Fetch user",
  "args": [
    {"name":"id","type":"string","required":true}
  ],
  "output_schema": {...},
  "adapter": "openapi"
}
```

Agents can explore the system.

---

# 6. Add a Native Tool API

DCLI server should expose:

```
GET /api/tools
POST /api/tools/execute
```

This instantly makes DCLI compatible with:

* OpenAI API tools
* Model Context Protocol
* LangChain

So the **CLI and agent tools share the same backend**.

---

# 7. Deterministic Command Output Envelope

Every command returns the same envelope.

```json
{
  "version": "1.0",
  "command": "referential.users.fetch",
  "duration_ms": 42,
  "data": {...}
}
```

Benefits:

Agents always know where data lives.

---

# 8. Streaming Mode for Long Operations

Support **JSON Lines streaming**.

Example:

```bash
dcli infra deploy service --stream
```

stdout:

```
{"event":"start"}
{"event":"build_complete"}
{"event":"deploy_started"}
{"event":"deploy_complete"}
{"event":"result","data":{...}}
```

stderr:

```
Deploying service...
```

Agents can process events.

---

# 9. Command Capability Discovery

Add a discovery endpoint:

```bash
dcli capabilities
```

Example:

```json
{
  "commands": 120,
  "namespaces": ["referential","infra","ai"],
  "output_formats": ["json","human"],
  "protocols": ["cli","http","mcp"]
}
```

Useful for agents.

---

# 10. Automatic Agent-Friendly Behavior

DCLI runtime automatically:

### disables colors

If:

```
stdout not TTY
```

### disables interactive prompts

If:

```
CI=true
```

### enables JSON

If:

```
stdout not TTY
```

This avoids needing many flags.

---

# 11. Pipe-Friendly Design

Commands should accept stdin.

Example:

```bash
echo '{"id":42}' | dcli referential users fetch
```

DCLI maps stdin to args.

This makes pipelines extremely powerful.

---

# 12. Built-in Command Composition

Example:

```bash
dcli referential users list --json \
 | jq '.data[].id' \
 | xargs -I {} dcli referential users fetch --id {}
```

Because output is deterministic, pipelines work perfectly.

---

# 13. Token Optimization Trick (Important)

Agents pay for tokens.

So DCLI should support:

```
--compact
```

Example output:

```json
{"v":"1","c":"referential.users.fetch","d":{"id":42,"n":"Alice"}}
```

Fields compressed.

This reduces token usage drastically.

---

# 14. Self-Describing CLI

Agents can run:

```bash
dcli help --json
```

Example:

```json
{
  "version":"1.0",
  "namespaces":[
    {
      "name":"referential",
      "resources":[
        {
          "name":"users",
          "actions":["fetch","list","create"]
        }
      ]
    }
  ]
}
```

Agents can explore the CLI automatically.

---

# 15. The Big Result

If you implement these ideas, DCLI becomes something very rare:

A CLI that is simultaneously:

```
human friendly
automation friendly
AI agent friendly
```

Few CLIs achieve this.

Most tools only target **one of these audiences**.

---

✅ **Key insight for your architecture**

Because DCLI is **config-driven**, these principles can be:

```
enforced automatically
```

Meaning every command added to the platform becomes **agent-safe by default**.

---

If you want, I can also show you **one extremely powerful feature that would make DCLI probably the best AI-native CLI architecture:**

**"Command Plans" — where an LLM can request a plan and the CLI returns a safe execution graph before running anything.**
