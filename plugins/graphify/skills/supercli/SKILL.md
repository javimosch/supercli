---
name: graphify-supercli
description: Use this skill when working with graphify through supercli to understand supercli-specific workarounds and best practices.
---

# Graphify Supercli Integration

## Supercli-Specific Workarounds

Graphify commands work through supercli, but multi-word arguments require explicit flags instead of positional args.

### Multi-word Arguments

Use explicit `--flag` style arguments for strings with spaces:

```bash
# Does NOT work (positional args split on spaces):
sc graphify graph query "how does auth work"

# Works (explicit flags):
sc graphify graph query --question "how does auth work"
```

### Passthrough with Complex Commands

For complex commands through the passthrough (`_._`), use `--` separator:

```bash
# Template:
sc graphify _ _ -- <command> --flag "value with spaces"

# Example:
sc graphify _ _ -- query --question "what is this project about"
```

### When Positional Args Work

Single-word arguments work fine:
- `sc graphify graph update .` (single path)
- `sc graphify graph explain resolveCwd` (single node name)
- `sc graphify graph path execute resolveCwd` (two single-word node names)

## Quick Reference

| Task | Supercli Command |
|------|------------------|
| Show help | `sc graphify self help` |
| Update graph (code only) | `sc graphify graph update .` |
| Query graph | `sc graphify graph query --question "<question>"` |
| Explain node | `sc graphify graph explain --node <name>` |
| Find path between nodes | `sc graphify graph path --node1 A --node2 B` |
| Add content (paper/video) | `sc graphify content add --url <url>` |
| Watch for changes | `sc graphify graph watch .` |
| Install AI assistant skill | `sc graphify platform install` |
| Install git hooks | `sc graphify git hook-install` |
| Check hook status | `sc graphify git hook-status` |

## Reading the Graph Report

After building a graph, read `graphify-out/GRAPH_REPORT.md` for:

- **God nodes**: Most connected functions/classes (core abstractions)
- **Surprising connections**: Cross-file relationships discovered by LLM
- **Community structure**: Code grouped by functional relationship
- **Token stats**: Reduction ratio vs reading raw files

## Workflow for Understanding a Codebase

1. **Build the graph** (requires AI assistant with graphify skill installed):
   ```
   /graphify .
   ```

2. **Update via supercli** (no AI needed, code-only):
   ```
   sc graphify graph update .
   ```

3. **Query via supercli**:
   ```
   sc graphify graph query --question "how does the plugin system work"
   sc graphify graph query --question "what is the main entry point"
   sc graphify graph query --question "what connects X to Y"
   ```

4. **Explore specific nodes**:
   ```
   sc graphify graph explain resolveCwd
   sc graphify graph path resolveCwd execute
   ```

## Best Practices

- Use `graph update` for code changes (fast, no LLM)
- Use `/graphify` in AI assistant for initial build (includes semantic extraction)
- Query with specific questions, not generic ones
- Check GRAPH_REPORT.md god nodes first for project overview
- Install git hooks once: `sc graphify git hook-install`
