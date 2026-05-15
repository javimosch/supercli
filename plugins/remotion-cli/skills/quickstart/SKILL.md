---
name: remotion-cli
description: Use this skill when the user wants to render videos, audio, or still images programmatically with React using Remotion from the terminal.
---

# Remotion CLI

Render videos, audio, and still images programmatically with React using terminal commands.

## Commands

- `remotion-cli compositions list` — List available compositions
- `remotion-cli render video` — Render a composition to video
- `remotion-cli _ _` — Passthrough to npx remotion

## Installation

```bash
npm install remotion
# in your project directory
```

## Usage Examples

- "List available compositions in my project"
- "Render a video composition"
- "Start the Remotion Studio preview"
- "Create a bundle for rendering"

## Key Commands

```bash
# List compositions
npx remotion compositions

# Render a video
npx remotion render MyComposition out/video.mp4

# Studio preview UI
npx remotion studio

# Create a bundle
npx remotion bundle
```

## Key Features
- **Programmatic Video** - React-based video creation
- **Still/Video/Audio** - Multiple output formats
- **Studio Preview** - Visual composition editor
- **Scriptable** - CI/CD friendly
- **Composition IDs** - Discoverable outputs
