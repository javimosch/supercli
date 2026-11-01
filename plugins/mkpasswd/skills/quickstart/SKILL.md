---
name: mkpasswd
description: mkpasswd — generate password hashes using various crypt algorithms (MD5, SHA-256, SHA-512, bcrypt, yescrypt). Creates /etc/shadow-compatible password entries for user provisioning, automated setup scripts, and container/user initialization.
---

# mkpasswd Plugin

mkpasswd — generate password hashes using various crypt algorithms (MD5, SHA-256, SHA-512, bcrypt, yescrypt). Creates /etc/shadow-compatible password entries for user provisioning, automated setup scripts, and container/user initialization.

## Installation

```bash
brew install mkpasswd
Verify: mkpasswd --version
```

## Commands

### `sc mkpasswd self version`

Print mkpasswd version

## Passthrough

```bash
sc mkpasswd _ _ <args...>
```

## SuperCLI

```bash
sc mkpasswd _ _ --help
sc plugins learn mkpasswd
```
