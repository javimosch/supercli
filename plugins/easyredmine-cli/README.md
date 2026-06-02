# easyredmine-cli

Redmine API client for EasyRedmine (Simpliciti). Read issues, post comments, edit descriptions.

## Usage

```bash
# Show issue
sc easyredmine issue show 61809
sc easyredmine issue show 61809 --json

# Post comment
sc easyredmine issue comment 61809 --text "Looks good to me"

# Edit description
sc easyredmine issue edit 61809 --description "<p>New description</p>"
```

## Configuration

API token stored in `~/.config/easyredmine-cli/config.json`:

```json
{
  "base_url": "https://easyredmine.simpliciti.fr",
  "api_key": "your-api-key"
}
```

Run `easyredmine-cli config set` to configure interactively.

## Build

```bash
cd ~/ai/easyredmine-cli
go build -ldflags="-s -w" -o easyredmine-cli main.go
```
