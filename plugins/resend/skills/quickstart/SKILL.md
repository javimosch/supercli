---
name: resend.quickstart
description: Agent workflow to manage emails, domains, API keys, and contacts via Resend CLI.
tags: resend,email,domains,api-keys,contacts,agents,usage
---

# Resend CLI Quickstart

Use this when you need to send emails, manage domains, API keys, or audience contacts.

## 1) Install the plugin

```bash
supercli plugins install ./plugins/resend --json
```

## 2) Setup the dependency

The plugin requires the official `resend-cli` installed globally via npm.

```bash
supercli resend cli setup
```

## 3) Authenticate

You can provide the API key in three ways (ordered by priority):

### A. Environment Variable (Recommended for Agents/CI)
```bash
export RESEND_API_KEY=re_xxx
```

### B. Command Flag
```bash
supercli resend emails send --api-key re_xxx ...
```

### C. Persistent Login
```bash
supercli resend login --key re_xxx
```

## 4) Core Operations

### Emails
```bash
supercli resend emails send \
  --from "you@yourdomain.com" \
  --to "recipient@example.com" \
  --subject "Hello" \
  --text "Body text" \
  --json
```

### Domains
```bash
supercli resend domains list --json
supercli resend domains create --name "example.com" --json
supercli resend domains verify --id "dom_123" --json
```

### API Keys
```bash
supercli resend api-keys list --json
supercli resend api-keys create --name "Production Key" --permission full_access --json
```

### Audience Contacts
```bash
supercli resend contacts list --audience-id "aud_123" --json
supercli resend contacts create --audience-id "aud_123" --email "user@example.com" --json
```

## 5) Diagnostics

```bash
supercli resend auth whoami --json
supercli resend cli doctor --json
```
