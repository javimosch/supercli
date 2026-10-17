---
name: hyperframes
description: Use this skill when the user wants to create, preview, render, or edit HTML-based video compositions using HyperFrames by HeyGen.
---

# HyperFrames — Video Rendering for AI Agents

Open-source video framework by [HeyGen](https://github.com/heygen-com/hyperframes) (18.4k⭐). Write HTML, render video.

## Commands
- `hyperframes <resource> <action>` — Execute hyperframes commands
- `hyperframes self mcp` — Register hyperframes MCP server for agent use (requires npx, installs heavy deps)
- `hyperframes _ _` — Passthrough for hyperframes CLI (heavy deps, use only if already installed)

## Skills Indexed (15)

Auto-discovered via `remote_repo` provider. Search and get:
```bash
sc skills search "animation" --provider hyperframes
sc skills get hyperframes:hyperframes
sc skills get hyperframes:gsap
sc skills get hyperframes:hyperframes-cli
sc skills get hyperframes:hyperframes-media
```

Available: hyperframes, hyperframes-cli, hyperframes-media, hyperframes-registry,
animejs, gsap, css-animations, lottie, three, typegpu, waapi,
tailwind, website-to-hyperframes, remotion-to-hyperframes, contribute-catalog.

## MCP

```bash
sc hyperframes self mcp    # Register MCP server (requires npx + heavy deps)
```

## Passthrough (for users with hyperframes installed)
- `sc hyperframes init <name>` — scaffold project
- `sc hyperframes preview` — preview server
- `sc hyperframes render` — render video

## Important Caveat

The hyperframes CLI has **heavy dependencies** (onnxruntime GPU ~500MB).
The `mcp` command and passthrough work only after the initial `npx hyperframes` download completes.
The 15 skill documents are lightweight and always available via `sc skills get`.

## Tips

- Explore skills with `sc skills search "render" --provider hyperframes`
- Skill content fetched on-demand via raw.githubusercontent.com
- For video creation, prefer agents with MCP access to hyperframes
