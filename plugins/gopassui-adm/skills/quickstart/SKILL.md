# gopassui-adm Quickstart

Administrative commands for managing gopassui deployment on dk1.

## Quick Commands

### Change UI Password
```bash
supercli gopassui-adm password change <new-password>
```

### Generate Random Password
```bash
supercli gopassui-adm password generate
```

### Show Current Password
```bash
supercli gopassui-adm password show
```

### Restart Service
```bash
supercli gopassui-adm service restart
```

### Check Service Status
```bash
supercli gopassui-adm service status
```

## Use Cases

- **Change password**: When you need to update the UI authentication password
- **Generate password**: When you want a random secure password
- **Show password**: When you've forgotten the current password
- **Restart service**: When the service needs to be restarted after config changes
- **Check status**: When troubleshooting service issues

## Architecture

The plugin uses SSH to execute commands on dk1 (92.113.145.178):
- Modifies `/etc/systemd/system/gopassui.service`
- Reloads systemd daemon
- Restarts gopassui service
- Requires sudo privileges on dk1
