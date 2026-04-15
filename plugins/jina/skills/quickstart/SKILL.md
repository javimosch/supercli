---
name: jina.quickstart
description: Agent workflow for using Jina AI CLI commands for search, reading web content, embeddings, and reranking.
tags: jina,search,embeddings,rerank,reader,ai,web-search,scraping
---

# jina Quickstart

Use this when AI agents need to search the web, read web pages, generate embeddings, or rerank results using Jina AI APIs.

## 1) Install plugin and dependency

```bash
supercli plugins learn jina
pip install jina-cli
jina --version
supercli plugins install ./plugins/jina --json
```

## 2) Validate CLI wiring

```bash
jina --version
supercli jina self version
supercli plugins doctor jina --json
```

## 3) Core command patterns

### Self commands

```bash
supercli jina self version
```

### Search

```bash
supercli jina search run "artificial intelligence trends" --limit 10
```

### Reader

```bash
supercli jina reader read https://example.com --format text
supercli jina reader read https://example.com --format markdown
```

### Embeddings

```bash
supercli jina embed run "Text to embed" --model jina-embeddings-v3
```

### Rerank

```bash
supercli jina rerank run "query" '["doc1", "doc2", "doc3"]' --model jina-reranker-v2-base-multilingual
```

## 4) Piping support

jina CLI supports Unix-style pipes for chaining operations:

```bash
cat urls.txt | jina reader
curl -s https://example.com | jina embed
```

## 5) Common workflows

### Web content extraction pipeline

1. Search for relevant pages: `supercli jina search run "AI news"`
2. Read content from top results: `supercli jina reader read <url>`
3. Generate embeddings for analysis: `supercli jina embed run <content>`

### Search results reranking

1. Get initial search results
2. Rerank with query: `supercli jina rerank run "exact query" '<json-array-of-results>'`

## 6) Safety levels

| Command | Level | Description |
|---------|-------|-------------|
| `self version` | safe | Read-only version check |
| `search run` | safe | Read-only web search |
| `reader read` | safe | Read-only content extraction |
| `embed run` | safe | Read-only embedding generation |
| `rerank run` | safe | Read-only reranking |

All jina commands are safe — they only read and process data.
