---
name: mm
description: Use this skill when the user wants to work with multimodal files (images, video, audio, PDFs, binary formats) — find, inspect, extract content, search, or count files using UNIX-style commands with multimodal powers.
---

# mm Plugin

Fast, multimodal context for agents. Familiar UNIX CLI tools like `find`, `grep`, `cat` — with multimodal powers. Rust core for speed, Python for dev-ex, UNIX philosophy for composability.

`mm` enables agents to work with file types that LLMs can't natively read, including images, video, audio, PDFs, and other binary formats. Indexing is implicit — every command auto-builds a metadata index on first use.

## Commands

### Discovery
- `mm find list --path <dir>` — Find/list files with multimodal metadata (tree, tabular, schema, JSON)
- `mm find list --path <dir> --tree` — Hierarchical tree view with sizes
- `mm find list --path <dir> --kind image` — Filter by kind (image, video, audio, document, code, text)
- `mm wc count --path <dir> --by_kind` — Count files, bytes, lines, tokens by kind
- `mm peek metadata --path <file>` — Raw file metadata (dimensions, EXIF, codec, duration, mime, hash)

### Content extraction
- `mm cat extract --path <file>` — Extract content (PDF text, image captions, video descriptions, audio transcripts)
- `mm cat extract --path <file> --mode accurate` — Full LLM pipeline (requires configured profile)
- `mm cat extract --path <file> --lines 20` — First N lines (head)

### Search
- `mm grep search --pattern <query> --path <dir>` — Text + semantic content search
- `mm grep search --pattern <query> --path <dir> --semantic` — Semantic (vector) search
- `mm sql query --query "SELECT * FROM files WHERE kind='image'"` — SQL on file metadata

### Config
- `mm config show` — Show configuration and diagnostics
- `mm profile list` — List LLM provider profiles
- `mm self version` — Print mm version

### Passthrough
- `mm _ _` — Passthrough to mm CLI with full argument access

## Usage Examples
- "Find all images in ~/Downloads and show their sizes"
- "Extract text from invoice.pdf"
- "Search for 'invoice' across all PDFs in ~/docs"
- "Count files by type in ~/data"
- "Get a caption for photo.jpg using the accurate LLM pipeline"
- "Run SQL queries on file metadata"

## Installation

```bash
pip install mm-ctx
```

Alternative methods:
```bash
# with uv
uv pip install mm-ctx

# run directly without installing
uvx --from mm-ctx mm --help

# macOS / Linux shell installer
curl -LsSf https://vlm-run.github.io/mm/install/install.sh | sh
```

## Examples

### Find files in a directory
```bash
mm find ~/data --tree --depth 2
mm find ~/data --kind image --sort size --reverse --limit 20
mm find ~/data --format json
```

### Extract content from files
```bash
mm cat document.pdf                    # PDF text (fast pipeline)
mm cat photo.jpg -m accurate           # LLM caption + tags + objects
mm cat video.mp4 -m accurate           # Keyframe mosaic → LLM description
mm cat audio.mp3 -m accurate           # Whisper transcript
```

### Search across files
```bash
mm grep "invoice" ~/data/
mm grep "revenue forecast" ~/data/ -s  # semantic search
mm grep "TODO" ~/data/ --kind code
```

### Inspect file metadata
```bash
mm peek photo.jpg                      # image dimensions, EXIF, hash
mm peek video.mp4                      # video resolution, duration, codecs
mm peek doc.pdf --full                 # include author, title, page count
```

### Count files by kind
```bash
mm wc ~/data --by-kind
mm wc ~/data --by-kind --format json
```

### SQL queries on indexed files
```bash
mm sql "SELECT kind, COUNT(*) as n FROM files GROUP BY kind ORDER BY n DESC" --dir ~/data
mm sql --list-tables
```

## Key Features
- UNIX-style commands (find, grep, cat, peek, wc, sql, bench) with multimodal semantics
- Rust core for speed — metadata commands run in ~60ms on 700 files
- Python API with `mm.Context` for building VLM-ready prompts incrementally
- Auto-indexing on first use — no manual setup needed
- Supports images, video, audio, PDFs, DOCX, PPTX, and text files
- Two extraction modes: `fast` (default) and `accurate` (full LLM pipeline)
- Semantic (vector) search across file contents
- SQL queries on file metadata via SQLite
- OpenAI and Gemini message format output
- Optional audio transcription backends: MLX (Apple Silicon), ctranslate2 (GPU), OpenAI-compatible
