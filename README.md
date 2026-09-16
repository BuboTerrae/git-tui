# git-tui

A terminal user interface (TUI) for Git, built with [@opentui/core](https://github.com/open-tui/core).

## Status

**Early development** — Currently only tested on Linux. More features coming soon.

## Features

- View git status (modified, added, deleted files)
- View file diffs in a unified view with syntax highlighting
- Stage/unstage files (planned)
- Commit with message and description
- Push to remote

## Installation

```bash
curl -fssL https://github.com/BuboTerrae/git-tui/blob/main/install.sh | sh
```

## Usage

```bash
cd /path/to/git/repo
git-tui
```

## Controls

- `↑`/`↓` or `j`/`k` — Navigate file list
- `Enter` — Select file to view diff
- Type in commit message/description fields
- Click **Commit** button or press Enter in commit message to commit & push
- `q` — Quit

## Development

```bash
# Install dependencies
bun install

# Run in dev mode
bun run dev

# Type check
bun run typescript

# Lint(Biome)
bun run lint

# Build release binary
bun run release

# Start local build
bun start
```

_`Bun` is required in development since it's a project`dependency`. The app is also bundled with `Bun`'s bundler. However, you can run the scripts with any other package manager, i.e., `npm`, `yarn` etc._

## Requirements

- Bun (for development and building)
- Git
- Linux terminal with true color support

## License

MIT
