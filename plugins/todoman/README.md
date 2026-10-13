# todoman Plugin for SuperCLI

[todoman](https://github.com/pimutils/todoman) is a simple, standards-based
CLI todo manager from the pimutils project. It stores tasks as iCalendar
(`.ics`) files and can sync them to any CalDAV server via vdirsyncer. The
binary is `todo`.

## Installation

```bash
# Install todoman (pick one)
pipx install todoman
# or: sudo apt install todoman

# Install supercli plugin
supercli plugins install ./plugins/todoman
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli todoman self version` | Show todoman version |
| `supercli todoman tasks list` | List pending tasks (`--porcelain` for JSON) |
| `supercli todoman tasks new` | Create a task |
| `supercli todoman tasks show` | Show task details |
| `supercli todoman tasks edit` | Edit a task |
| `supercli todoman tasks done` | Mark a task done |
| `supercli todoman tasks delete` | Delete a task |
| `supercli todoman tasks flush` | Delete completed tasks |
| `supercli todoman <any>` | Passthrough to todo CLI |

## Usage

```bash
# Create and list tasks
supercli todoman tasks new -l work -s "Ship the release"
supercli todoman tasks list
supercli todoman tasks list --porcelain   # JSON for scripts

# Manage tasks by id
supercli todoman tasks done 3
supercli todoman tasks flush
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
