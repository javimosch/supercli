---
name: pandoc-crossref
description: pandoc-crossref — pandoc filter for automatic figure, table, equation, and code block cross-referencing in Markdown documents. Generates numbered references with customizable prefixes, format tags (fig:, tbl:, eq:, lst:), and hyperlinked cross-references for scholarly writing.
---

# pandoc-crossref Plugin

pandoc-crossref — pandoc filter for automatic figure, table, equation, and code block cross-referencing in Markdown documents. Generates numbered references with customizable prefixes, format tags (fig:, tbl:, eq:, lst:), and hyperlinked cross-references for scholarly writing.

## Installation

```bash
brew install pandoc-crossref
Verify: pandoc-crossref --version
```

## Commands

### `sc pandoc-crossref self version`

Print pandoc-crossref version

## Passthrough

```bash
sc pandoc-crossref _ _ <args...>
```

## SuperCLI

```bash
sc pandoc-crossref _ _ --help
sc plugins learn pandoc-crossref
```
