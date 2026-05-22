# agent-search Quickstart

agent-search is a multi-provider web search CLI for AI agents. Use this skill when you need to:

- Search the web from the terminal with multiple providers
- Get structured JSON output for AI agent processing
- Extract content from URLs (markdown, rendered pages)
- Perform specialized searches (academic, news, social, patents)
- Use semantic exit codes for agent decision-making
- Parallel fan-out across multiple search providers

## Installation

```bash
cargo install agent-search
search --version
```

Also available via Homebrew: `brew tap 199-biotechnologies/tap && brew install search-cli`

## Configuration

### Set API Keys

```bash
# Set keys interactively
search config set keys.brave YOUR_BRAVE_KEY
search config set keys.serper YOUR_SERPER_KEY
search config set keys.exa YOUR_EXA_KEY

# Or use environment variables
export SEARCH_KEYS_BRAVE=YOUR_KEY
export SEARCH_KEYS_SERPER=YOUR_KEY
export SEARCH_KEYS_EXA=YOUR_KEY
```

### View Configuration

```bash
search config show
search config check  # Health check all providers
```

## Basic Search

### Auto Mode (Recommended)

```bash
# Auto-detects intent and picks best providers
search "quantum computing advances"
search "who is the CEO of Anthropic"
search "CRISPR research papers"
```

### General Web Search

```bash
# Broad web search across multiple providers
search "machine learning frameworks" -m general
```

### JSON Output

```bash
# Auto-JSON when piped
search "query" --json | jq '.results[].url'

# Force JSON output
search "query" -m general --json
```

## Search Modes

### News

```bash
# Breaking news and current events
search "AI regulation" -m news
```

### Academic

```bash
# Research papers and studies
search "transformer architectures" -m academic
```

### People

```bash
# LinkedIn profiles and bios
search "Sam Altman" -m people
```

### Deep

```bash
# Maximum coverage across all providers
search "climate change solutions" -m deep
```

### Scholar

```bash
# Google Scholar
search "BRCA1 gene" -m scholar
```

### Patents

```bash
# Patent search
search "quantum computing patents" -m patents
```

### Images

```bash
# Image search
search "solar panel installation" -m images
```

### Places

```bash
# Local businesses and maps
search "coffee shops near me" -m places
```

### Social

```bash
# X/Twitter search via Grok
search "AI agents" --x
```

### Extract/Scrape

```bash
# Extract full text from URL
search "https://example.com/article" -m extract

# Scrape rendered page
search "https://example.com" -m scrape
```

### Similar

```bash
# Find similar pages
search "https://example.com" -m similar
```

## Provider Selection

### Single Provider

```bash
search "rust programming" -p brave
search "machine learning" -p exa
```

### Multiple Providers

```bash
search "query" -p brave,serper,exa
```

### Provider Options

- **brave** - Independent 35B-page index + LLM Context API
- **serper** - Raw Google SERP + Scholar, Patents, Places
- **exa** - Neural/semantic search, category filters
- **jina** - Fast URL-to-markdown, 500 RPM free tier
- **firecrawl** - JavaScript rendering, structured extraction
- **tavily** - General + deep search, research-focused
- **serpapi** - 80+ engines: Google, Bing, YouTube, Baidu
- **perplexity** - AI-powered answers with citations
- **browserless** - Cloud browser for Cloudflare/JS-heavy pages
- **stealth** - Built-in anti-bot scraper
- **xAI** - X/Twitter search via Grok AI

## Advanced Usage

### Control Results Count

```bash
search "query" -c 20  # 20 results
```

### Suppress Diagnostics

```bash
search "query" 2>/dev/null
```

### Agent-First Features

```bash
# Discover capabilities programmatically
search agent-info

# Structured JSON with metadata
search "query" --json
# Output includes: status, query, mode, results, metadata (elapsed_ms, result_count, providers_queried)
```

### Semantic Exit Codes

| Code | Meaning | Agent Action |
|------|---------|--------------|
| 0 | Success | Process results |
| 1 | Runtime error | Retry might help |
| 2 | Config error | Fix configuration |
| 3 | Auth missing | Set API key |
| 4 | Rate limited | Back off and retry |

## URL Extraction

```bash
# Extract article content as markdown
search "https://example.com/article" -m extract

# Fallback chain: Stealth -> Jina -> Firecrawl -> Browserless
```

## Configuration File

Config file location:
- Linux: `~/.config/search/config.toml`
- macOS: `~/Library/Application Support/search/config.toml`

```bash
# Set values
search config set keys.brave YOUR_KEY
search config set timeout 30
```

## Environment Variables

Prefix with `SEARCH_KEYS_`:

```bash
export SEARCH_KEYS_BRAVE=your-key
export SEARCH_KEYS_SERPER=your-key
export SEARCH_KEYS_EXA=your-key
export SEARCH_KEYS_JINA=your-key
export SEARCH_KEYS_FIRECRAWL=your-key
export SEARCH_KEYS_TAVILY=your-key
export SEARCH_KEYS_SERPAPI=your-key
export SEARCH_KEYS_PERPLEXITY=your-key
export SEARCH_KEYS_BROWSERLESS=your-key
export SEARCH_KEYS_XAI=your-key
```

## Tips

- Use auto mode for best results (intent detection)
- JSON output is automatic when piped to another program
- Parallel fan-out across providers completes in under 2 seconds
- URL normalization removes duplicates across providers
- Designed for AI agents with structured output and semantic codes
- Binary size ~6 MB, startup ~2 ms, memory ~5 MB
- No Python, no Node, no Docker required
