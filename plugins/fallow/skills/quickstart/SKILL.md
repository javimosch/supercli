---
name: fallow
description: Use this skill when the user wants to analyze a TypeScript/JavaScript codebase for dead code, duplication, complexity hotspots, or run quality gates for PRs.
---

# Fallow Plugin

Codebase analyzer for TypeScript and JavaScript. Finds unused code, circular dependencies, code duplication, and complexity hotspots. Rust-native, sub-second.

## Commands

### All Analyses
- `fallow` — Run dead-code, dupes, and health analyses

### Dead Code
- `fallow deadcode scan` — Find unused files, exports, dependencies, types

### Duplication
- `fallow dupes scan` — Find copy-pasted code blocks

### Complexity
- `fallow health analyze` — Analyze complexity hotspots

### Audit (PR Quality Gate)
- `fallow audit check` — Quality gate for AI-generated code and PRs

### Auto-fix
- `fallow fix apply` — Auto-remove dead exports and deps

## Usage Examples

Run all analyses:
```
fallow
```

Dead code detection:
```
fallow dead-code
fallow dead-code --unused-exports
fallow dead-code --circular-deps
fallow dead-code --boundary-violations
fallow dead-code --changed-since main
```

Duplication scan:
```
fallow dupes
fallow dupes --mode semantic
fallow dupes --trace src/utils.ts:42
```

Health/check complexity:
```
fallow health --score
fallow health --top 20
fallow health --hotspots
```

Audit PR:
```
fallow audit
fallow audit --base main
fallow audit --format json
```

Auto-fix preview:
```
fallow fix --dry-run
```

## Installation

```bash
cargo install fallow-cli
```

Or via npm:
```bash
npm install -g fallow
npx fallow
```

## Key Features
- Sub-second analysis (Rust-native)
- Zero config needed
- 90 framework plugins (Next.js, Vite, Jest, etc.)
- Dead code: unused files, exports, deps, circular deps
- Duplication detection across entire codebase
- Complexity analysis with refactoring targets
- PR quality gate with pass/warn/fail verdict
- Multiple output formats (JSON, SARIF, markdown)
- CI/CD integration (GitHub Actions, GitLab CI)