---
name: supercli-docs-dev
description: Use this skill when working on supercli documentation — editing docs/index.html, docs/plugins.html, creating scripts that generate doc data (meta-plugins.json), or aligning docs to current implementation. Covers the docs structure, terminology conventions, script patterns, and beads issue workflow.
---

# Supercli Docs Development

Work on supercli documentation including docs/index.html, docs/plugins.html, and associated scripts.

## Docs Structure

```
docs/
├── index.html           # Main documentation page (single-page app)
├── plugins.html         # Plugin directory page
├── server.md            # Server documentation (loaded dynamically)
├── adapters.md          # Adapters documentation (loaded dynamically)
├── meta-plugins.json    # Generated plugin metadata (don't edit manually)
├── features/            # Feature-specific docs
└── ...other .md files
scripts/
└── generate-meta-plugins.js  # Generates meta-plugins.json
```

## Terminology Convention

**IMPORTANT: Use "capability" not "skill"**

The codebase uses "capability" as the primary term:
- Section titles → "Capability Layer Basics", "Capability Sources", "Capability Mesh Vision"
- Content references → "every capability becomes...", "capability discovery layer"
- Sidebar links → update both href AND display text
- Section IDs → change from `id="skill-*"` to `id="capability-*"`

Search keyword attributes can keep "skill" for backwards searchability.

## docs/index.html

Single-page documentation with:
- Sidebar navigation (links to #sections and other doc pages)
- Quick filter input (searches section content + data-keywords)
- Sections with `class="doc-section"` and `data-keywords="..."` attributes
- Consistent dark theme: `bg-slate-950`, `text-slate-300`, `brand-400` accents
- Tailwind + DaisyUI + Space Grotesk/Inter fonts (CDN)

### Common Edits

**Update sidebar:** Edit the `<nav>` inside `<aside id="sidebar">`
**Update mobile nav:** Clone happens automatically via JS from sidebar
**Add section:** Create `<article class="doc-section" id="..." data-keywords="...">`
**Link to another doc page:** `<a href="plugins.html">Plugin Directory</a>`
**Add dynamic .md section:** 
1. Create `docs/<section>.md` file
2. Add empty div in HTML: `<div id="<section>-content" class="prose prose-lg max-w-none text-[#2F3437]"></div>`
3. Add JS loader at bottom of page:
```javascript
async function loadSectionDocs() {
  const res = await fetch('<section>.md');
  const markdown = await res.text();
  const html = marked.parse(markdown);
  document.getElementById('<section>-content').innerHTML = html;
}
loadSectionDocs();
```

## docs/plugins.html

Plugin directory page that:
- Loads `meta-plugins.json` at runtime via fetch
- Displays plugin cards with search + tag filtering
- Shows install command with copy-to-clipboard buttons
- Uses same dark theme as index.html

Each card shows:
- Plugin name
- Description (line-clamped)
- Tags
- `supercli plugins install <name>` command
- Copy buttons (clipboard API with visual feedback)
- `has_learn` badge for plugins with SKILL.md

## scripts/generate-meta-plugins.js

Generates `docs/meta-plugins.json` deterministically:
- Reads `plugins/plugins.json` (legacy entries)
- Scans `plugins/*/meta.json` directories (new convention)
- Deduplicates (meta.json takes precedence over plugins.json)
- Sorts alphabetically by name
- Outputs: `{ generated, count, plugins: [...] }`

**Run:** `node scripts/generate-meta-plugins.js`

**Output format per plugin:**
```json
{
  "name": "beads",
  "description": "...",
  "tags": ["issues", "tracking"],
  "has_learn": true,
  "source": "plugins/beads/plugin.json"  // optional, for legacy
}
```

## Plugin Metadata Convention

New bundled plugins use isolated `meta.json` files:

```
plugins/<name>/
├── plugin.json           # Manifest (commands, checks, passthrough)
├── meta.json             # Registry metadata (description, tags, has_learn)
├── install-guidance.json # Optional install steps
├── skills/quickstart/SKILL.md  # Agent learning doc (if has_learn)
└── README.md            # Human docs
```

**meta.json format:**
```json
{
  "description": "Plugin description for registry discovery",
  "tags": ["tag1", "tag2"],
  "has_learn": true
}
```

## Dark Theme Styling

Consistent across docs pages:

```html
<!-- Tailwind CDN -->
<script src="https://cdn.tailwindcss.com?plugins=typography"></script>

<!-- DaisyUI -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daisyui@4.7.2/dist/full.min.css" />

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

**Color palette:**
- Background: `bg-slate-950` / `#020617`
- Text: `text-slate-300` / `text-slate-400`
- Accents: `brand-400` (`#38BDF8`), `brand-100`, `brand-200`
- Borders: `border-slate-800`

## Beads Issue Workflow

When working on docs, use beads to track:

```bash
# Create issue
br create --title "docs: <description>" --body "<details>"

# Close when done
br close <id>

# Sync changes
br sync --flush-only
git add -f .beads/
git commit -m "message"
```

**Issue body should include:**
- What files to edit
- Verification steps
- Run commands to confirm

## Common Tasks

### Add new section to docs/index.html
1. Add sidebar link in `<aside id="sidebar">`
2. Add `<article class="doc-section" id="...">` with content
3. Update terminology if referencing capabilities/skills

### Regenerate plugin metadata
```bash
node scripts/generate-meta-plugins.js
git add docs/meta-plugins.json
git commit -m "chore: regenerate meta-plugins.json"
```

### Add link to plugin directory from index
1. Add sidebar entry: `<li><a href="plugins.html">...</a></li>`
2. Add Resources entry: `<li><a href="plugins.html">Plugin Directory</a></li>`

## Verification Checklist

After editing docs:
- [ ] No broken links to non-existent files
- [ ] Terminology consistent (capability, not skill)
- [ ] Regenerate meta-plugins.json if plugin list changed
- [ ] Test in browser (check mobile nav, search, filters)
- [ ] Commit with descriptive message
