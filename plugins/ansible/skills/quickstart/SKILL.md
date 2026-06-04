---
name: ansible
description: IT automation tool for configuration management, application deployment, and task automation
---
# Ansible Plugin

Automate IT infrastructure with Ansible.

## Usage

- `ansible self version` — Print ansible version
- `ansible inventory list [-i <inventory>]` — List hosts in inventory
- `ansible playbook run <playbook> [-i <inventory>] [--check] [--diff]` — Run a playbook
- `ansible galaxy install <name>` — Install a Galaxy role/collection
- `ansible galaxy search <query>` — Search Galaxy for roles/collections
- `ansible vault encrypt <file>` — Encrypt a file with Vault
- `ansible vault decrypt <file>` — Decrypt a file with Vault
- `ansible _ _ <args>` — Passthrough any ansible command

## Examples

```bash
# Check all hosts are reachable
ansible all -m ping -i inventory.ini

# Run a playbook in check mode
ansible-playbook site.yml --check -i inventory.ini

# Install a role from Galaxy
ansible-galaxy install geerlingguy.nginx
```
