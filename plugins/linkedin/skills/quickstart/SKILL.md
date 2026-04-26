---
name: linkedin
description: Use this skill when the user wants to publish text posts to LinkedIn via REST API or browser automation.
---

# LinkedIn Plugin

LinkedIn publishing plugin — OAuth 2.0 login and text post creation via LinkedIn REST API.

## Commands

### Operations
- `linkedin auth url` — Generate LinkedIn OAuth authorization URL
- `linkedin auth exchange` — Exchange OAuth authorization code for access token
- `linkedin person urn` — Fetch LinkedIn person URN from OpenID userinfo endpoint
- `linkedin post create` — Publish a text post to LinkedIn organization page
- `linkedin post browser` — Publish a text post to LinkedIn via browser automation

## Usage Examples
- "linkedin auth url --client-id YOUR_CLIENT_ID"
- "linkedin post create --access-token YOUR_TOKEN --text 'Hello world'"
- "linkedin post browser --text 'Hello world' --cookies-file cookies.json"

## Installation

```bash
npm install node
```

## Examples

```bash
node --version
```

## Key Features
- linkedin
- social-media
- publishing
- oauth
- api
