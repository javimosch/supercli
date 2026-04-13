---
name: cline-non-interactive
description: Use the supercli cline harness for unattended, JSON-streamed Cline execution.
tags: cline,agents,automation,streaming
---

# Cline Non-Interactive

Use this skill when you want to delegate a task to the local Cline CLI through SuperCLI in a way that is safe for agents and easy to parse.

## Preferred Commands

Use the wrapped commands first:

```bash
supercli cline task run --prompt "<task>" --cwd <path> --timeout 30 --json
supercli cline task plan --prompt "<task>" --cwd <path> --timeout 30 --json
```

- `cline task run` uses Cline act mode with `-a -y --json`
- `cline task plan` uses Cline plan mode with `-p -y --json`
- both commands emit streamed JSON event envelopes before a final completion envelope

## When To Use Which

- use `cline task run` when you want Cline to execute the task autonomously
- use `cline task plan` when you want a plan-first answer or want to inspect the intended approach before acting
- use passthrough only if you need a Cline flag or subcommand that the wrapped commands do not expose yet

## Output Contract

When `--json` is used on the SuperCLI command, output is newline-delimited:

1. zero or more streamed event envelopes:

```json
{"version":"1.0","command":"cline.task.run","stream":true,"data":{"type":"say","say":"task","text":"..."}}
```

2. one final summary envelope:

```json
{"version":"1.0","command":"cline.task.run","duration_ms":1234,"data":{"streamed":true,"stream":"jsonl","event_count":4,"last_event":{"type":"say","say":"completion_result","text":"..."}}}
```

## Safety Defaults

- always pass `--cwd` so Cline operates in the intended workspace
- prefer `--timeout` for unattended runs
- avoid secrets in prompts because they can appear in logs or downstream tool output
- use a clean branch or a clearly scoped task when running autonomous edit flows

## Examples

```bash
supercli cline task run --prompt "List files with more LOC in cwd" --cwd . --timeout 30 --json
supercli cline task plan --prompt "Plan how to split SearchForm.vue below 500 LOC" --cwd . --json
supercli cline cli version --json
```
