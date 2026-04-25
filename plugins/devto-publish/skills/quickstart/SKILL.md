---
name: devto-publish
description: Use this skill when you need to publish articles to Dev.to via their API, format markdown content for Dev.to, or manage blog posts programmatically.
---

# Dev.to Publish Plugin

Publish articles to Dev.to (https://dev.to) via their REST API. Requires a Dev.to API key for authentication.

## Setup

1. Get your Dev.to API key:
   - Go to https://dev.to/settings/account
   - Scroll to "API Keys"
   - Click "Generate new API key"
   - Copy the key

2. Install the plugin:
   ```bash
   sc plugins install ./plugins/devto-publish --on-conflict replace --json
   ```

## Publishing Articles

### Basic Publish

```bash
sc devto article publish --api-key "your-api-key" --title "My Article Title" --body-markdown "# Content here" --tags "javascript,nodejs"
```

### Publish with Draft Mode

Save as draft instead of publishing immediately:

```bash
sc devto article publish --api-key "your-api-key" --title "Draft Article" --body-markdown "# Content" --published false --tags "webdev"
```

### Publish from File

Publish an existing markdown file:

```bash
sc devto article publish --api-key "your-api-key" --title "Article from File" --body-markdown "$(cat my-article.md)" --tags "tutorial"
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | string | Yes | Dev.to API key from https://dev.to/settings/account |
| `title` | string | Yes | Article title |
| `body_markdown` | string | Yes | Article content in Markdown format |
| `published` | boolean | No | `true` to publish immediately, `false` to save as draft (default: `true`) |
| `tags` | string | No | Comma-separated tags (max 4) for categorization |

## Response

The command returns the published article object including:
- `id`: Article ID
- `url`: Published article URL (e.g., `https://dev.to/username/article-slug`)
- `slug`: URL-friendly identifier
- `published_timestamp`: When it was published
- `reading_time_minutes`: Estimated reading time

## Agent Usage Pattern

When writing an article for a user:

1. **Draft the content** in Markdown format
2. **Choose appropriate tags** (max 4) relevant to the content
3. **Publish** using the command:
   ```bash
   sc devto article publish --api-key "your-api-key" --title "Article Title" --body-markdown "<markdown content>" --tags "tag1,tag2,tag3,tag4"
   ```
4. **Verify** by checking the returned URL

## Best Practices

- **Tag selection**: Use relevant, popular tags to increase visibility
- **Title quality**: Make titles descriptive and engaging
- **Markdown formatting**: Use proper Markdown syntax for code blocks, links, images
- **Content length**: Dev.to recommends articles between 3-15 minutes reading time
- **Preview**: Use `--published false` to save as draft first, then publish after review

## Example: Publishing Technical Article

```bash
sc devto article publish \
  --api-key "your-api-key" \
  --title "How to Build a REST API with Node.js" \
  --body-markdown '# Introduction\n\nThis article shows how to build a REST API...\n\n```javascript\nconst express = require("express");\nconst app = express();\n```\n\n## Conclusion\n\n...' \
  --tags "javascript,nodejs,api,webdev"
```

## Critical Caveats and Pitfalls

### API Key Security
- **NEVER commit API keys to git** - they grant full access to your Dev.to account
- Treat API keys as secrets - rotate if compromised
- Store in environment variables or secret management systems
- Do not share in public repositories or issue comments

### Common Publishing Pitfalls

**1. Markdown escaping issues**
- When passing markdown via command line, escape special characters properly
- Use single quotes for shell: `--body-markdown '# Title\n\nContent'`
- For complex markdown, write to a file first: `--body-markdown "$(cat article.md)"`

**2. Tag format errors**
- Tags must be comma-separated string, not array: `--tags "javascript,nodejs"`
- Dev.to rejects arrays or space-separated tags
- Maximum 4 tags - excess tags are ignored or cause errors

**3. Title duplication**
- Dev.to prevents duplicate titles within 5 minutes
- If you get this error, wait 5 minutes or modify the title slightly
- Add unique qualifiers: "How to Build X (2026 Edition)"

**4. Content length limits**
- Dev.to doesn't enforce strict character limits, but very long articles (>15 min read time) may have poor engagement
- Consider splitting very long content into series
- Use code blocks judiciously - they count toward reading time

**5. Image handling**
- Dev.to supports image uploads via web interface
- External image links work but may break over time
- For production articles, upload images through Dev.to dashboard first

**6. Code block formatting**
- Use triple backticks with language: ````javascript` or ````python`
- Ensure proper indentation in code blocks
- Dev.to's markdown parser is strict about code block syntax

**7. Draft vs Published confusion**
- Default is `--published true` - article goes live immediately
- Use `--published false` for drafts to preview before publishing
- Drafts are visible only to you in dashboard

**8. Rate limiting**
- Dev.to may rate limit rapid successive publishes
- If you get 429 errors, wait 60 seconds before retrying
- Space out bulk publishes by at least 30 seconds

**9. Character encoding**
- Ensure UTF-8 encoding for special characters
- Non-ASCII characters may display incorrectly if not properly encoded
- Test special characters in draft mode first

**10. URL and link validation**
- Test all links before publishing
- Broken links hurt article credibility
- Use descriptive anchor text, not "click here"

## Troubleshooting

**Error: "unauthorized" or 401**
- Ensure the API key is correct and passed via `--api-key` flag
- Get a new key from https://dev.to/settings/account
- Verify no extra spaces in API key

**Error: "Tag list exceed the maximum of 4 tags"**
- Dev.to limits to 4 tags per article
- Use comma-separated string: `--tags "tag1,tag2,tag3,tag4"`

**Error: "Title has already been used in the last five minutes"**
- Dev.to prevents duplicate titles within 5 minutes
- Wait 5 minutes or modify title slightly

**Error: 429 Too Many Requests**
- Rate limit exceeded - wait 60 seconds before retrying
- Space out publishes to avoid hitting limits

**Error: 400 Bad Request**
- Check JSON formatting in body_markdown
- Ensure no unescaped quotes in markdown
- Validate tag format (comma-separated string)

## Dev.to API Limits

- 4 tags maximum per article
- Title must be unique within 5 minutes
- Rate limits may apply for rapid publishing
- API key grants full access to your Dev.to account
- No hard character limit, but very long articles discouraged

## Related Commands

- View your articles: Visit https://dev.to/dashboard
- Edit published articles: Use Dev.to web interface
- Delete articles: Use Dev.to web interface
