# subliminal Plugin for SuperCLI

[subliminal](https://github.com/Diaoul/subliminal) — Subliminal downloads subtitles for movies and episodes from multiple providers (OpenSubtitles, Podnapisi, TVsubtitles, Addic7ed.

## Installation

```bash
pipx install subliminal
Verify: subliminal --version

# Install supercli plugin
supercli plugins install ./plugins/subliminal
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli subliminal self version` | Show subliminal version |
| `supercli subliminal subtitles download` | Download best-match subtitles for video(s) |
| `supercli subliminal <any>` | Passthrough to subliminal CLI |

## Usage

```bash
subliminal download -l en -p opensubtitlescom movie.mkv
```

## Notes

Languages are `-l` (repeatable). Age filter `-a 30d` limits to recent releases. Provider credentials go through `-p name=user:pass`.
