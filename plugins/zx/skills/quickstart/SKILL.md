---
name: zx
description: Use this skill when the user wants to write shell scripts in JavaScript/TypeScript, run scripts with modern syntax, or automate tasks with Node.js.
---

# zx Plugin

A tool for writing better scripts. Write shell scripts in JavaScript/TypeScript with modern async/await syntax.

## Commands

### Script Execution
- `zx run script` — Run a zx script

### Utility
- `zx _ _` — Passthrough to zx CLI

## Usage Examples
- "Run this zx script"
- "Write a shell script in JavaScript"
- "Automate with zx"
- "Run TypeScript script"

## Installation

```bash
npm install -g zx
```

## Examples

```bash
# Run a script
zx run script.mjs

# Run TypeScript script
zx run script.ts

# Run with Bun
bun zx script.mjs

# Run with Deno
deno run --allow-net script.mjs

# Any zx command with passthrough
zx _ _ script.mjs
zx _ _ --shell script.mjs
```

## Script Examples

```javascript
#!/usr/bin/env zx

// Run commands
await $`ls -la`
await $`git status`

// Capture output
let output = await $`cat file.txt`
console.log(output)

// Chain commands
await $`cat package.json | grep name`

// Environment variables
process.env.FOO = 'bar'
await $`echo $FOO`

// Conditionals
if (await $`test -f file.txt`.exitCode === 0) {
  await $`rm file.txt`
}

// Loops
for (const file of await fs.readdir('.')) {
  console.log(file)
}
```

## Key Features
- **Async/await** - Modern JavaScript async syntax
- **TypeScript support** - Write scripts in TypeScript
- **Multiple runtimes** - Node.js, Bun, Deno, GraalVM
- **Shell integration** - Easy command execution
- **Process control** - Exit codes, signals, timeouts
- **File system** - Built-in fs utilities
- **Cross-platform** - Works on Linux, macOS, Windows
- **ESM/CJS** - Both module systems supported

## Notes
- Shebang: `#!/usr/bin/env zx`
- Use `$` to run shell commands
- Auto-awaits command execution
- Can use any Node.js package
- Great for automation and CI/CD
