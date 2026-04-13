---
name: jsalt.quickstart
description: Agent workflow for learning JSALT and building .jsa apps with executable validation and AST checks.
tags: jsalt,jsa,frontend,ast,validation,agents
---

# jsalt Quickstart

Use this when you need to generate or edit JSALT (`.jsa`) apps with reliable syntax validation.

## 1) Install plugin and dependency

```bash
supercli plugins learn jsalt
npm install -g jsalt
supercli plugins install ./plugins/jsalt --json
```

## 2) Validate CLI wiring

```bash
supercli jsalt cli help
supercli plugins doctor jsalt --json
```

## 3) Core JSALT syntax checklist

- `let key = value` for reactive state.
- `const x = computed(() => expr)` for derived state.
- `fn name = "handler code"` for reusable handlers.
- `watch key = "handler code"` for side effects.
- `on mount = "..."` and `on destroy = "..."` for lifecycle.
- Element shape: `div#id.class { css: value } @click = "..." = "content"`.

## 4) Useful directives for agent-generated UI

- `if = "${expr}"` conditional render.
- `show = "${expr}"` visibility toggle.
- `each = "${array}"` loops (`item`, `idx` available).
- `bind = "stateKey"` two-way form binding.
- `:attr = "..."` dynamic attributes.
- `html = "..."` raw HTML when needed.
- `transition = "fade"` enter transition classes.

## 5) Validate and inspect AST during generation

```bash
supercli jsalt ast validate --path app.jsa
supercli jsalt ast json --path app.jsa
supercli jsalt ast tree --path app.jsa
```

## 6) Full passthrough for advanced runs

```bash
supercli jsalt app.jsa --json
supercli jsalt examples --tree
```

## 7) Minimal example patterns

Counter:

```jsa
let count = 0
const doubled = computed(() => count * 2)
fn inc = "setState('count', getState('count') + 1)"

div
  h1 = "Count: ${count}"
  p = "Doubled: ${doubled}"
  button @click = "inc()" = "+"
```

Todo list loop:

```jsa
let items = []
let text = ""
fn add = "if(!getState('text')) return; setState('items', [...getState('items'), getState('text')]); setState('text', '')"

div
  input bind = "text"
  button @click = "add()" = "Add"
  ul
    li each = "${items}" = "${idx + 1}. ${item}"
```

## 8) Agent workflow recommendation

1. Draft `.jsa` using the syntax checklist.
2. Run `ast validate` after each meaningful edit.
3. Run `ast json` when tooling needs structural introspection.
4. Prefer simple handlers and immutable updates for predictable diffs.
