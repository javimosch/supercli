# LinkedIn Plugin

Publish text posts to LinkedIn via the REST API.

## Prerequisites

- A LinkedIn developer app with OAuth 2.0 credentials
- `w_member_social` scope enabled on the app
- A registered redirect URI matching `http://localhost:3000/callback` (or a custom port)

## Install

```bash
supercli plugins install ./plugins/linkedin --on-conflict replace --json
```

## Auth (one-shot)

The OAuth flow is split into two non-blocking commands so it works in agents and automation.

### Step 1 — Generate authorization URL

```bash
supercli linkedin auth url --client-id YOUR_ID --json
```

This prints the `authorization_url`. Open it in your browser, authorize the app, and copy the `code` query parameter from the browser's address bar after the redirect.

### Step 2 — Exchange code for token

```bash
supercli linkedin auth exchange \
  --code COPIED_CODE \
  --client-id YOUR_ID \
  --client-secret YOUR_SECRET \
  --json
```

This prints the `access_token`.

## Post

Publish a text post:

```bash
supercli linkedin post create --access-token YOUR_TOKEN --text "Hello from supercli!" --json
```

Posts are public and support up to 3000 characters.

## Notes

- The plugin uses LinkedIn API version `202304`.
- Access tokens are not persisted by the plugin; store them securely.
- For image or rich-media posts, use the upstream LinkedIn API directly.
