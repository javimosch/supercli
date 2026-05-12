---
name: minipostiz-linkedin-setup
description: Full LinkedIn OAuth setup for minipostiz-cli — creates app, gets access token + personUrn, stores credentials
type: setup
---

# minipostiz-cli — LinkedIn Setup

End-to-end guide to get a working LinkedIn access token and store it in minipostiz-cli.
Covers app creation, product activation, OAuth flow, and credential storage.

## What you need

| Credential | Source |
|------------|--------|
| `accessToken` | OAuth 2.0 flow (60-day TTL) |
| `personUrn` | auto-resolved from token via `/v2/userinfo` if `openid` scope included |

---

## Step 1 — LinkedIn Developer App

1. Go to https://www.linkedin.com/developers/apps → **Create app**
2. Fill in app name, company page, logo → submit
3. In the app → **Products** tab → request both:
   - **Share on LinkedIn** → grants `w_member_social` (posting)
   - **Sign In with LinkedIn using OpenID Connect** → grants `openid profile email` (personUrn resolution)
4. In **Auth** tab → add redirect URI: `http://localhost:3001`
5. Note your **Client ID** and **Client Secret**

> Both products are usually auto-approved for developer apps within seconds.

---

## Step 2 — Run the OAuth server

Create and run `/tmp/linkedin-oauth-minipostiz.js`:

```javascript
#!/usr/bin/env node
const http = require('http');
const url = require('url');
const crypto = require('crypto');

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3001';
const SCOPE = 'w_member_social openid profile email';
const STATE = crypto.randomBytes(16).toString('hex');

const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
  new URLSearchParams({ response_type: 'code', client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI, state: STATE, scope: SCOPE }).toString();

console.log('\n=== LinkedIn OAuth for minipostiz-cli ===');
console.log('\nOpen this URL in your browser:\n');
console.log(authUrl);
console.log('\nWaiting for callback on http://localhost:3001 ...\n');

const server = http.createServer(async (req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (pathname !== '/') { res.writeHead(404); res.end(); return; }

  const { code, state, error } = query;
  if (error) { console.error('Auth error:', error); res.end(`<h1>Error: ${error}</h1>`); server.close(); return; }
  if (state !== STATE) { console.error('State mismatch'); res.end('<h1>State mismatch</h1>'); server.close(); return; }

  // Exchange code for token
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code,
      redirect_uri: REDIRECT_URI, client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString()
  });
  const token = await tokenRes.json();

  if (!token.access_token) {
    console.error('Token exchange failed:', JSON.stringify(token));
    res.end('<h1>Token exchange failed — check terminal</h1>');
    server.close(); return;
  }

  console.log('\n✓ Access token obtained');
  console.log('Access Token:', token.access_token);
  console.log('Expires in:', token.expires_in, 'seconds (~60 days)');

  // Resolve personUrn via userinfo
  const uiRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });
  const ui = await uiRes.json();
  const personUrn = ui.sub ? `urn:li:person:${ui.sub}` : null;

  if (personUrn) {
    console.log('Person URN:', personUrn);
    console.log('Name:', ui.name);
  }

  // Write results to tmp files
  const fs = require('fs');
  fs.writeFileSync('/tmp/linkedin-access-token.txt', token.access_token);
  if (personUrn) fs.writeFileSync('/tmp/linkedin-person-urn.txt', personUrn);

  console.log('\n=== minipostiz-cli auth command ===');
  console.log(`minipostiz auth --platform linkedin --accessToken "${token.access_token}" --personUrn "${personUrn || 'RESOLVE_MANUALLY'}"`);
  console.log('\n=== or via supercli ===');
  console.log(`sc minipostiz auth set-linkedin --accessToken "${token.access_token}"${personUrn ? ` --personUrn "${personUrn}"` : ''}`);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<h1>✓ LinkedIn auth complete</h1>
    <p><b>Name:</b> ${ui.name || 'N/A'}</p>
    <p><b>Person URN:</b> ${personUrn || 'not resolved'}</p>
    <p>Check your terminal for the minipostiz-cli command. You can close this tab.</p>`);
  server.close();
});

server.listen(3001);
process.on('SIGINT', () => { server.close(); process.exit(0); });
```

**Run it:**
```bash
node /tmp/linkedin-oauth-minipostiz.js
```

---

## Step 3 — Store credentials in minipostiz-cli

The script prints the exact command. Run it:

```bash
# Direct binary
minipostiz auth --platform linkedin \
  --accessToken "$(cat /tmp/linkedin-access-token.txt)" \
  --personUrn "$(cat /tmp/linkedin-person-urn.txt)"

# Or via supercli
sc minipostiz auth set-linkedin \
  --accessToken "$(cat /tmp/linkedin-access-token.txt)"
# (personUrn auto-resolved at post time if openid scope was included)
```

---

## Step 4 — Verify and test

```bash
# Verify credentials are valid
minipostiz auth verify --platform linkedin

# Fire a test post
minipostiz publish --platform linkedin --message "LinkedIn API test via minipostiz-cli"

# Check history
minipostiz history --platform linkedin --limit 5
```

---

## Step 5 — Cleanup

```bash
rm /tmp/linkedin-oauth-minipostiz.js /tmp/linkedin-access-token.txt /tmp/linkedin-person-urn.txt
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `invalid_scope` | App missing required product | Add "Share on LinkedIn" + "Sign In with OpenID" in Products tab |
| `redirect_uri_mismatch` | URI not registered | Add `http://localhost:3001` in Auth tab → OAuth 2.0 settings |
| `403 ugcPosts.CREATE` | Token missing `w_member_social` | Re-run OAuth — scope must include `w_member_social` |
| `Token Type: undefined` | Exchange response parsing bug | Use the Node.js script above — captures full response |
| personUrn not resolved | Token has no `openid` scope | Re-run with `openid profile email` included in scope |

## Token lifetime

- Expires in **60 days** (5,184,000 seconds)
- No refresh token in standard OAuth — re-run the flow before expiry
- Re-run: `node /tmp/linkedin-oauth-minipostiz.js` → paste new token via `minipostiz auth --platform linkedin ...`
