# htmlq Quickstart

htmlq queries HTML using CSS selectors (like jq for HTML).

## Installation

```bash
cargo install htmlq
```

## Basic Usage

```bash
cat page.html | htmlq 'div.content'
curl https://example.com | htmlq 'a.link' -a href
```

## Resources

- [GitHub](https://github.com/mgdm/htmlq)
