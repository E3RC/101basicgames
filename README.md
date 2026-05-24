# 101 BASIC Computer Games

A digital archive of the classic 1973 book *101 BASIC Computer Games* by David H. Ahl. All 106 playable games reimplemented as browser-based terminal-style games.

**Live site:** https://e3rc.github.io/101basicgames/

## Source

The original source PDF was obtained from Brandeis University's digital collections:
- https://opencode.ieee.org/research-tools-and-data/public-domain-basic-games/
- Internet Archive: https://archive.org/details/basiccomputergames00ahld

The PDF (`source/original/101basiccomputergames.pdf`, ~25 MB) is excluded from git but kept locally for reference. Extracted text lives in `source/extracted/` (also gitignored).

## Project Structure

```
├── docs/                    # Website root (GitHub Pages serves from here)
│   ├── index.html           # Main HTML shell
│   ├── css/main.css         # Complete design system (dark/light themes)
│   ├── data/games.json      # Master game inventory (108 entries)
│   └── js/
│       ├── app.js           # Main controller, routing, game loading
│       ├── data.js          # Game data loader
│       ├── router.js        # Hash-based SPA router
│       ├── views.js         # Page renderers (home, catalog, about, etc.)
│       ├── theme.js         # Dark/light theme toggle
│       ├── game-engine.js   # Terminal emulator (print/input API)
│       ├── games-manifest.js# Dynamic script loader for individual games
│       ├── utils/           # Shared game utilities
│       │   ├── rng.js       # Seeded random number generator
│       │   ├── dice.js      # Dice rolling helpers
│       │   ├── deck.js      # Card deck simulation
│       │   ├── grid.js      # Grid/board utilities
│       │   └── ai.js        # Simple AI decision helpers
│       └── games/           # 106 individual game implementations (.js)
├── data/                    # Game metadata and CSV/JSON sources
├── source/                  # Original source PDF (gitignored)
├── scripts/                 # Build/analysis scripts
└── .gitignore
```

## Games

106 playable games across 15 categories:

| Category | Count | Examples |
|----------|-------|---------|
| Action | 8 | Bomber, Gunner, Target, Space War |
| Art | 5 | Banner, Diamond, Poetry, 3D Plot |
| Board | 11 | Checkers, Gomoko, Hexapawn, Qubic, Tic-Tac-Toe |
| Card | 6 | Acey-Ducey, Bingo, Blackjack, Poker, War |
| Dice | 7 | Craps, Roulette, Yahtzee, Bug |
| Educational | 10 | Chemist, Kinema, Math Dice, Synonym, Train |
| Guessing | 12 | Bagels, Bulls & Cows, Hurkle, Mugwump |
| Learning | 1 | Animal |
| Puzzle | 7 | Cube, Fip-Fop, Hi-Q, Reverse, Tower |
| Simulation | 12 | Bounce, Hammurabi, Hello, Lunar Lander, Stock |
| Sports | 8 | Baseball, Basketball, Bowling, Football, Golf, Hockey |
| Strategy | 14 | Battle, Civil War, Nim, Salvo, 23 Matches |
| Utility | 3 | Buzzword, Calendar, Change |
| Word | 2 | Hangman, Word |

Plus 2 no-code art entries (BUNNY, SNOOPY) listed for completeness.

## How to Run Locally

```bash
cd docs
# Any static file server works:
npx serve .
python -m http.server 8080
```

## Architecture

- Pure HTML/CSS/JS — no build tools, no frameworks, no dependencies
- Hash-based routing (`#/`) for static-server compatibility
- Terminal-style UI via `GameEngine` class (`print()`/`input()` with `async/await`)
- Games load dynamically via `games-manifest.js` (no 106 `<script>` tags)
- Dark/light theme persisted in `localStorage`
- Each game is a standalone IIFE registered into `window.GameImplementations[slug]`

## Tech Stack

- Vanilla JavaScript (ES5 compatible)
- CSS custom properties for theming
- Google Fonts: Share Tech Mono, Space Mono
- Zero runtime dependencies

## Attribution

All game titles, descriptions, and original BASIC source code are the intellectual property of their original authors as published in the book *101 BASIC Computer Games* by David H. Ahl (1973, republished as *BASIC Computer Games* 1978, ISBN 0-89480-052-3).

This is an educational, non-commercial fan project — a tribute to a landmark book that helped spark the home computer revolution.
