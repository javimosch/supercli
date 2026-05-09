---
name: msmtp
description: Use this skill when the user wants to send an email via any SMTP server, send notifications via email, or deliver mail programmatically.
---

# msmtp Plugin

SMTP client for sending email via any SMTP server. Works with Gmail, Outlook, and any SMTP provider.

## Prerequisites

Requires SMTP configuration in `~/.msmtprc`:

```text
defaults
  auth on
  tls on
  tls_trust_file /etc/ssl/cert.pem

account default
  host smtp.gmail.com
  port 587
  from your@gmail.com
  user your@gmail.com
  password APP_PASSWORD

chmod 600 ~/.msmtprc
```

## Commands

### Send
- `msmtp message send -f from@x.com to@x.com` — Send email (body from stdin)
- `msmtp message send -f from@x.com -t` — Extract recipients from headers

### Server Info
- `msmtp server info` — Print SMTP server information
- `msmtp server info --host smtp.example.com --port 587 --tls starttls` — Check any server

### Config
- `msmtp config check` — Print effective configuration

### Full Access
- `msmtp _ _` — Passthrough for any msmtp command

## Usage Examples
- "Send an email notification to admin@example.com"
- "Send a status report email"
- "Check if my SMTP server is configured correctly"
- "Send an email with subject 'Deploy complete' and body 'All services running'"

## Installation

```bash
brew install msmtp
```

Then configure `~/.msmtprc` (see prerequisites above).

## Key Features
- **Any SMTP provider**: Works with Gmail, Outlook, Postfix, SendGrid, any SMTP server
- **Sendmail compatible**: Drop-in replacement for `/usr/sbin/sendmail`
- **Multiple accounts**: Configure multiple SMTP accounts and switch with `-a`
- **Secure**: TLS/SSL support, password from gpg/keychain
- **Zero platform dependency**: Pure SMTP — works with any email provider
