---
name: attw
description: Use this skill when the user wants to verify that an npm package's TypeScript types resolve correctly for consumers, using attw (Are the Types Wrong).
---

# attw Plugin

attw ("Are the Types Wrong") tests whether the TypeScript types shipped in an npm
package actually resolve under every module-resolution strategy (node10, node16
CJS/ESM, bundler). Catches masquerading files, missing `.d.ts`, wrong `types`
conditions — before users report them.

## Commands

### Checking
- `attw check pack` — Pack the local package and check its types
- `attw check npm <pkg>` — Check a published npm package
- `attw check tarball <file.tgz>` — Check a `.tgz` tarball
- `attw _ _` — Passthrough to attw CLI

## Usage Examples

- "Check if my package's types resolve correctly"
- "Does lodash's types work under node16 ESM?"
- "Verify the built tarball has correct types"
- "Add an attw check to my publish workflow"

## Installation

```bash
npm install -g @arethetypeswrong/cli
# or: npx @arethetypeswrong/cli
```

## Examples

```bash
# Standard pre-publish check
attw --pack .

# Inspect a published package
attw --from-npm react@19

# Machine-readable output
attw --pack . --format json

# Only check specific entrypoints
attw --pack . --entrypoints ./index.d.ts
```

## Key Features

- Tests every resolution mode: node10, node16 CJS, node16 ESM, bundler
- Detects "masquerading" files (ESM syntax in .js under type:commonjs, etc.)
- `--format table|json|flipped` output
- Pairs with publint for complete pre-publish verification
