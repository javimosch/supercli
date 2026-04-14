# fast-agent Skill

Use the fast-agent plugin when you need flexible LLM interaction for coding agents, evaluation workflows, or development tasks with MCP support.

## Quick Start

### 1. Check Installation
```bash
dcli fast-agent self version
```

### 2. Run a Task
```bash
dcli fast-agent agent run --task "Your task prompt here"
```

### 3. Run Evaluation
```bash
dcli fast-agent eval run --suite your-suite-name
```

### 4. Start Server
```bash
dcli fast-agent server serve --port 8080 --host localhost
```

## Agent Notes

- fast-agent supports MCP (Model Context Protocol) for extended capabilities
- Use `eval` for running evaluation suites on tasks
- The `serve` command starts a server for API-style interactions
- Configure models and agents via environment variables or config files
