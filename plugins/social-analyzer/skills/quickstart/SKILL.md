# Social Analyzer Quickstart

Find a person's profile across 1000+ social media websites.

## Installation

```bash
npm install -g social-analyzer
```

## Basic Usage

```bash
# Analyze a username across all platforms
social-analyzer --username johndoe

# List all supported websites
social-analyzer --websites

# Save results to file
social-analyzer --username johndoe --output results.json
```

## Options

```bash
# Filter by specific sites
social-analyzer --username johndoe --filter "twitter,github,linkedin"

# Extract metadata from profiles
social-analyzer --username johndoe --metadata

# Verbose output
social-analyzer --username johndoe --verbose
```

## Output

Results include:
- Profile URLs
- Profile existence status
- Extracted metadata (if available)
- Response time

## Use Cases

- OSINT investigations
- Username availability checking
- Digital footprint analysis
- Security research

## Note

This tool performs passive reconnaissance by checking public profile pages. It does not attempt to log in or bypass any security measures.
