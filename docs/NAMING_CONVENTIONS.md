# SuperCLI Plugin Naming Conventions

This document defines standardized rules for naming SuperCLI plugins. Consistent naming
improves discoverability, prevents conflicts, and ensures a smooth experience across all
10,000+ plugins.

**Scope:** These conventions apply to **new plugins** added to the collection. Existing
plugins are grandfathered in but may be updated at maintainer discretion.

---

## 1. Directory Name Rules

Each plugin lives in `plugins/<name>/`. The directory name **must** match the `name` field
in `plugin.json` exactly.

### Allowed Characters

- **Lowercase letters** (`a-z`)
- **Digits** (`0-9`)
- **Hyphens** (`-`) — the preferred word separator
- **Underscores** (`_`) — only when the tool's canonical name uses underscores
  (e.g., `acpi_available`, `apparmor_parser`)
- **Dots** (`.`) — only when the tool's canonical name includes a dot
  (e.g., `acme.sh`, `amqp-client.cr`)

### Prohibited Characters

- **Spaces** — use hyphens instead
- **Uppercase letters** — except when the tool's official name requires them
  (see §3.1)
- **Special characters** — `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `+`, `=`,
  `{`, `}`, `[`, `]`, `|`, `\`, `:`, `;`, `"`, `'`, `<`, `>`, `,`, `?`, `/`, `~`,
  `` ` ``

### Case Convention

| Scenario | Rule | Example |
|----------|------|---------|
| New plugins | **Lowercase with hyphens** | `my-plugin` |
| Tool uses uppercase officially | Preserve canonical casing | `53AIHub` |
| Tool name is an acronym | Preserve canonical casing | `AWS`, `gRPC` (rare exceptions) |

> **Why lowercase?** macOS uses a case-insensitive filesystem by default, so `Foo` and
> `foo` would collide. Lowercase avoids ambiguity and is portable across all platforms.

### Maximum Length

**50 characters** maximum for new plugins.

The current collection has one outlier at 59 characters
(`Accurate-Cyber-Defense-Network-Penetration-Testing-Tool-CLI`). 50 characters provides
enough room for descriptive names while keeping paths manageable.

---

## 2. Name Alignment

The following three identifiers **must** match (exceptions in §2.1):

| Identifier | Location | Description |
|------------|----------|-------------|
| Directory name | `plugins/<name>/` | Filesystem folder |
| `name` field | `plugin.json` → `name` | Plugin manifest identifier |
| Command namespace | `plugin.json` → `commands[].namespace` | Runtime command prefix |

### 2.1 Exceptions

- **Courses & tutorials** — A tool that is primarily educational content may use a
  descriptive name that differs from its binary name, e.g., `100-exercises-to-learn-rust`
  (binary is `rustc`/`cargo`). The `name` field **must** still match the directory name.
- **Collections** — A plugin bundling multiple tools may use a collective name.
- **Template placeholders** — Unfinished plugins may use `TOOL` as a placeholder, but
  this must be replaced before submission.

### 2.2 Directory ↔ Binary Name

The directory name **should** match the tool's canonical CLI binary name whenever
possible:

| Correct (binary matches name) | Acceptable exception |
|-------------------------------|----------------------|
| `ripgrep-all` (binary: `rga`) | N/A — dir matches project name |
| `7zip` (binary: `7z`) | Project is named "7-Zip", dir uses common name |
| `1password-cli` (binary: `op`) | Project is "1Password CLI", dir matches project |

When choosing between the project name and the binary name, prefer the **project name**
as it is more discoverable and stable across versions. Document the actual binary in
`plugin.json` → `checks[].name`.

---

## 3. Special Characters & Edge Cases

### 3.1 Uppercase from Canonical Names

If a tool's official name uses uppercase, preserve it:

| Official name | Plugin directory | Rationale |
|---------------|------------------|-----------|
| 53AIHub | `53AIHub` | Brand name with intentional casing |
| Accurate-Cyber-Defense-* | `Accurate-Cyber-Defense-Network-Penetration-Testing-Tool-CLI` | Grandfathered (exceeds length limit) |

For new plugins, a lowercase alias is **strongly preferred** even when the official name
uses uppercase. Only preserve uppercase when:
- The tool is widely known by its cased name (e.g., `53AIHub`)
- Lowercasing would cause confusion with another tool

### 3.2 Underscores

Prefer hyphens over underscores for new plugins. Underscores are only acceptable when:

- The tool's canonical name includes underscores (e.g., `acpi_available`)
- The tool's package manager uses underscores (e.g., PyPI packages)
- Converting to hyphens would break the user's mental model

```text
✅ Preferred:  `bore-cli` (dir) / `bore-cli` (name)
✅ Allowed:    `bore_cli` (dir) / `bore-cli` (name)  — dir matches PyPI package
❌ Avoid:      `my_cool_tool` (prefer `my-cool-tool`)
```

### 3.3 Dots

Dots in directory names are acceptable only when the tool's canonical name includes a
dot and removing it would be confusing:

| Acceptable | Rationale |
|------------|-----------|
| `acme.sh` | ACME shell client, commonly known as `acme.sh` |
| `amqp-client.cr` | Crystal language library, `.cr` is standard |

> **Note:** Dots can cause issues with some tooling (shell completion, filesystem
> navigation). Prefer hyphens when no strong convention exists.

### 3.4 Version Suffixes

A version suffix is acceptable when different versions of the same tool have
incompatible behaviors or syntax (e.g., Python 2 vs Python 3):

| Example | Explanation |
|---------|-------------|
| `2to3-2.7` | Python 2.7 version of `2to3` |
| `2to3-3.11` | Python 3.11 version of `2to3` |
| `python3.10` | Python 3.10 runtime |
| `coverage-3.10` | Coverage tool for Python 3.10 |

**Convention:** Use a **hyphen** as the separator: `tool-version`.

| ✅ Correct | ❌ Incorrect |
|-----------|-------------|
| `tool-v2` | `tool@v2` |
| `tool-1.2.3` | `tool_1.2.3` |
| `python3.10` | `python@3.10` |

Version suffixes should be **avoided** when the tool is version-agnostic or when the
latest version is the recommended default.

---

## 4. Reserved Names & Conflicts

### 4.1 Reserved Names

The following names are reserved and must not be used for new plugins:

- `supercli` — the platform itself
- `plugins` — the collection directory
- `catalog` — the plugin catalog file
- `core` — reserved for built-in functionality
- `internal` — reserved for internal tooling
- `template` — reserved for plugin scaffolding

### 4.2 Name Conflicts

If a proposed name conflicts with an existing plugin:

1. **Prefer a more specific name** — add a qualifier:
   - `git` → `git-core` (if `git` is already taken for a different purpose)
   - `aws` → `aws-cli` (if `aws` is already taken)
2. **Use a vendor prefix** — `hashicorp-consul`, `jetbrains-toolbox`
3. **Document the conflict** in `plugin.json` → `description` to help users distinguish.

> **Existing pattern:** Several plugins already use `TOOL` as a placeholder name. These
> are incomplete templates and must be resolved before a plugin is considered ready.

---

## 5. Migration & Backward Compatibility

### 5.1 New Plugins (Forward-Only)

All new plugins **must** follow these conventions. PRs submitted with non-conforming
names will be asked to rename before review.

### 5.2 Existing Plugins (Grandfathered)

The ~10,000 existing plugins are **grandfathered** and will not be renamed or migrated.
Exceptions may be made on a case-by-case basis for:

- Plugins with placeholder names (`TOOL`, empty strings)
- Plugins with names that cause functional conflicts
- Plugins whose names violate platform policies

### 5.3 Renaming a Plugin

If an existing plugin must be renamed:

1. Create the new directory with the correct name
2. Copy and update all files
3. Update `name` and `commands[].namespace` in `plugin.json`
4. Keep the old directory as a **symlink** or **redirect** for one release cycle
5. Announce the change in the release notes

---

## Summary: Quick Checklist

When adding a new plugin, verify:

- [ ] **Directory name:** Lowercase with hyphens (or canonical casing if required)
- [ ] **Length:** ≤ 50 characters
- [ ] **Allowed chars:** Only `[a-z0-9._-]` — no spaces, no special characters
- [ ] **Alignment:** Directory name == `plugin.json` `name` == command namespace
- [ ] **No conflicts:** Not reserved, not duplicating an existing plugin
- [ ] **Binary documented:** Actual CLI binary recorded in `checks[].name`
- [ ] **Version suffix:** Uses hyphen separator if needed
