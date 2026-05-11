# gopassui-adm Plugin

Administrative commands for managing the gopassui remote deployment on dk1 (92.113.145.178).

## Commands

### Password Management

#### Change Password
```bash
supercli gopassui-adm password change <new-password>
```

Change the gopassui basic authentication password on dk1.

**Example:**
```bash
supercli gopassui-adm password change my-secure-password
```

#### Generate Random Password
```bash
supercli gopassui-adm password generate
```

Generate a random 16-character password and set it for gopassui authentication.

**Example:**
```bash
supercli gopassui-adm password generate
# Output: Password changed to: N9Y3yP4Mls7o3uMo
```

#### Show Current Password
```bash
supercli gopassui-adm password show
```

Display the current gopassui authentication password.

**Example:**
```bash
supercli gopassui-adm password show
# Output: BASIC_AUTH_PASS=N9Y3yP4Mls7o3uMo
```

### Service Management

#### Restart Service
```bash
supercli gopassui-adm service restart
```

Restart the gopassui service on dk1.

#### Check Service Status
```bash
supercli gopassui-adm service status
```

Check the status of the gopassui service on dk1.

## Requirements

- SSH access to dk1 (92.113.145.178) with sudo privileges
- gopassui service must be installed as a systemd service on dk1

## Security Notes

- Passwords are changed by modifying the systemd service file directly
- The plugin uses SSH to execute commands on dk1
- Ensure your SSH keys are properly secured
- Consider rotating passwords regularly
