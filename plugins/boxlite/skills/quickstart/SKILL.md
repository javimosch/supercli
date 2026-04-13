---
name: boxlite.quickstart
description: Experimental BoxLite plugin status, known working flows, and current blockers.
tags: boxlite,sandbox,vm,docker,experimental
---

# BoxLite Quickstart (Experimental)

Use this skill to understand the current state of the BoxLite supercli plugin before running workflows.

## 1) Install and inspect plugin

```bash
supercli plugins learn boxlite
supercli plugins install ./plugins/boxlite
supercli plugins show boxlite
supercli plugins doctor boxlite
```

## 2) What currently works

- Plugin registration, install, and doctor checks.
- Docker runner bootstrap (`dcli-boxlite:1.1.0`) and command dispatch.
- Routed command shape for wrapper and passthrough commands.

## 3) What is currently blocked

- Docker-backed runtime path does not yet complete end-to-end VM execution.
- Native Node binding loading fails for `@javimosch/boxlite` in this flow.
- Latest observed failure chain includes a native symbol error (`krun_free_ctx`) and surfaces as "Cannot find native binding".

## 4) What does not work yet

- Reliable `box create` + `exec run` for real guest command execution.
- Verified Python and JavaScript execution inside BoxLite isolation from supercli plugin commands.

## 5) Current recommendation

- Treat the plugin as experimental until native binding/runtime linking is fixed in Docker mode.
- Do not rely on this plugin yet for production VM execution workflows.
