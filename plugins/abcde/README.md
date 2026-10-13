# abcde Plugin for SuperCLI

[abcde](https://abcde.einval.com/) — abcde rips audio CDs end-to-end: reads the disc with cdparanoia, fetches track metadata from CDDB/MusicBrainz, encodes to FLAC/MP3/Ogg Vorbis/Opus/AAC/WAV, tags and names files, and cleans up - all driven by flags or a ~/.

## Installation

```bash
sudo apt-get install -y abcde cdparanoia flac lame vorbis-tools
Verify: abcde -v

# Install supercli plugin
supercli plugins install ./plugins/abcde
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli abcde self version` | Show abcde version |
| `supercli abcde cd rip` | Rip audio CD (all flags pass through) |
| `supercli abcde <any>` | Passthrough to abcde CLI |

## Usage

```bash
abcde -o flac,mp3  # rip to both formats, tagged from MusicBrainz
```

## Notes

Actions: `-a read,encode,tag,move,clean`. Output types via `-o flac,mp3,ogg`. Persistent config lives in ~/.abcde.conf.
