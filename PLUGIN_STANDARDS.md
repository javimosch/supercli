# SuperCLI Plugin Standards

## Overview
This document defines quality standards for plugins in the SuperCLI collection. These standards ensure consistency, discoverability, and usability across 5,000+ plugins.

## Description Quality

### Requirements
- **Minimum length:** 30 characters
- **Maximum length:** 150 characters (for searchability)
- **Format:** `[Tool Name] — [one sentence purpose/key feature]`

### Examples ✓ Good
```
"git-cliff — automated changelog generator from git history"
"ripgrep-all — search documents with ripgrep backend"
"Zoxide — smart directory jumper with frecency tracking"
"Nushell — structured shell language for modern development"
"Tokio — async runtime for Rust applications"
```

### Examples ✗ Bad
```
"git-cliff"                          # Too short
"git-cliff utility"                  # Generic
"git-cliff CLI tool for git"         # Too verbose
"automated changelog generator"      # Missing tool name
```

### Guidelines
1. Start with the tool name (exact match to plugin name)
2. Use em-dash (—) as separator
3. Describe primary purpose or key feature
4. Be specific (avoid "CLI tool" or "utility")
5. Avoid marketing language
6. Keep scannable (one sentence max)

## Tags

### Requirements
- **Minimum:** 3 tags
- **Maximum:** 8 tags (avoid noise)
- **Controlled vocabulary:** Use `TAG_VOCABULARY.md`

### Tag Categories
- **Languages:** python, rust, go, javascript, bash, etc.
- **DevOps:** docker, kubernetes, devops, ci-cd, deployment
- **Data:** database, sql, analytics, machine-learning
- **Web:** web, api, http, rest, frontend, backend
- **Development:** testing, build, development, compiler
- **System:** system, linux, unix, process, kernel
- **Productivity:** productivity, task, note, project-management
- **Security:** security, crypto, auth, encryption
- **Utilities:** utilities, cli, terminal, shell

### Example Tags
```json
{
  "ripgrep-all": ["search", "rust", "cli", "file-search"],
  "tokio": ["rust", "async", "concurrency", "development"],
  "terraform": ["devops", "iac", "cloud", "infrastructure"],
  "zoxide": ["shell", "utilities", "productivity", "navigation"]
}
```

## Source URLs

### Requirements
- **Required:** Specific GitHub repository URL
- **Format:** `https://github.com/[owner]/[repo]`
- **Verified:** URL must be accessible and canonical
- **Examples:**
  ```
  https://github.com/orhun/git-cliff
  https://github.com/nushell/nushell
  https://github.com/ajeetdsouza/zoxide
  https://github.com/rustwasm/wasm-pack
  ```

### Anti-patterns ✗
```
https://github.com                  # Too generic
https://github.com/[plugin-name]    # Missing owner
```

## Install Instructions

### Requirements
- Minimum 2 methods recommended
- Include at least one package manager or official installation method
- Include supercli installation command

### Standard Methods
1. **Package managers:**
   ```bash
   brew install ripgrep-all
   cargo install ripgrep-all
   npm install -g ripgrep-all
   ```

2. **Official site:**
   ```
   Download from: https://github.com/phiresky/ripgrep-all/releases
   ```

3. **SuperCLI:**
   ```bash
   supercli plugins install ./plugins/ripgrep-all
   ```

## Quality Checklist

Before submitting a new plugin, ensure:

- [ ] **Name:** Matches official tool name
- [ ] **Description:** 30-150 characters, clear purpose
- [ ] **Tags:** 3-8 tags from controlled vocabulary
- [ ] **Source URL:** Specific GitHub repo, verified accessible
- [ ] **Install Steps:** 2+ methods, accurate and current
- [ ] **No duplicates:** Check existing plugins first

## Validation

### Automated Checks
- Description length: 30-150 characters
- Tags count: 3-8 tags
- Tags validity: Must exist in TAG_VOCABULARY.md
- Source URL: Must be specific GitHub repo
- No duplicates: Checked against all existing plugins

### Manual Review
- Description clarity and accuracy
- Tag relevance to plugin
- Install instructions accuracy
- Overall fit with SuperCLI collection

## Phase Completion

**Phase 1 (Metadata):** ✓ Complete
- All plugins have proper source URLs

**Phase 2 (Descriptions):** ✓ Complete
- Short descriptions enhanced
- Avg description: 72 characters (target: 80+)
- ~807 remaining short descriptions (<30 chars)

**Phase 3 (Automation):** → In Progress
- CI/CD pipeline for quality enforcement
- Community contribution guidelines
- Automated validation on pull requests
