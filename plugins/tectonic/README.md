# tectonic Plugin for SuperCLI

[tectonic](https://github.com/tectonic-typesetting/tectonic) — Tectonic is a modernized TeX/LaTeX engine powered by XeTeX.

## Installation

```bash
curl --proto '=https' -fsSL https://drop-sh.fullyjustified.net | sh
mkdir -p ~/.local/bin && mv tectonic ~/.local/bin/tectonic

# Install supercli plugin
supercli plugins install ./plugins/tectonic
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli tectonic self version` | Show tectonic version |
| `supercli tectonic document build` | Compile .tex to PDF |
| `supercli tectonic project watch` | Watch-build a V2 project |
| `supercli tectonic <any>` | Passthrough to tectonic CLI |

## Usage

```bash
tectonic main.tex
```

## Notes

V2 mode: `tectonic -X new`, `-X build`, `-X watch` work on Tectonic.toml projects. Classic mode compiles a .tex file directly.
