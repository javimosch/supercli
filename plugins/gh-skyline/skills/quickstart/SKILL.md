---
name: gh-skyline
description: Use this skill when the user wants to generate a 3D model of their GitHub contribution graph, create STL files from GitHub history, or visualize contributions in 3D.
---

# gh-skyline Plugin

Generate a 3D model of your GitHub contribution graph. Create STL files from GitHub contribution history for 3D printing and visualization.

## Commands

### Contribution Model
- `gh-skyline contribution generate` — Generate 3D model from GitHub contributions

### Utility
- `gh-skyline _ _` — Passthrough to gh skyline CLI

## Usage Examples
- "Generate contribution skyline"
- "Create 3D model from GitHub"
- "STL from contributions"
- "Visualize GitHub history"

## Installation

```bash
gh extension install github/gh-skyline
```

Requires GitHub CLI (gh) to be installed and authenticated.

## Examples

```bash
# Generate skyline for current user
git-skyline contribution generate

# Generate for specific user
git-skyline contribution generate octocat

# Generate for specific year
git-skyline contribution generate octocat --year 2023

# Save to file
git-skyline contribution generate octocat --output skyline.stl

# Any gh skyline command with passthrough
git-skyline _ _
git-skyline _ _ octocat --year 2024
```

## Key Features
- **3D** - 3D model generation
- **STL** - STL file output
- **Contributions** - GitHub contributions
- **Years** - Multi-year support
- **Users** - Any GitHub user
- **Printing** - 3D printing ready
- **Visualization** - Data visualization
- **History** - Contribution history
- **Graph** - Contribution graph
- **GitHub** - GitHub integration

## Notes
- Requires gh CLI authenticated
- Generates STL for 3D printing
- Great for visualization
- Supports any public user
