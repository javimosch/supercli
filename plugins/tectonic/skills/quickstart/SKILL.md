---
name: tectonic
description: Use this skill when the user wants to compile LaTeX/TeX documents to PDF without installing TeX Live - single-pass builds with auto-fetched packages.
---

# tectonic Plugin

Tectonic is a self-contained TeX engine: it fetches missing packages on demand, runs smart single-pass rebuilds, and outputs PDF. Ideal for CI or machines without a TeX distribution.

## Commands

### Building
- `tectonic document build` — Compile to PDF: sc tectonic document build main.tex
- `tectonic project watch` — Rebuild on change (V2 projects): sc tectonic project watch

### General
- `tectonic self version` — Print tectonic version
- `tectonic _ _` — Passthrough to tectonic CLI

## Usage Examples
- "Compile this .tex file to PDF"
- "Set up a watch-build for my LaTeX report"
- "Build this paper without installing TeX Live"

## Installation

```bash
cargo install tectonic  # or the drop-sh.fullyjustified.net installer
```

## Examples

```bash
tectonic main.tex
tectonic --keep-logs --print main.tex
tectonic -X build   # V2 project mode
```

## Key Features
- No TeX Live install needed
- On-demand package download
- Smart rebuilds (skips bibtex/makeindex when unneeded)
- V2 project mode (-X)
