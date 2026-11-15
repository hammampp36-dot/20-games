# HAMMA ARCADE — Game Modules Specification

This directory houses the game engines and individual launch environments for the **HAMMA ARCADE** platform.

## Architecture Overview (Phase 1 to Phase 2)

Each game in HAMMA ARCADE is indexed by a unique slug in `js/games-data.js` and can be launched either via:
1. **Interactive Glassmorphic Modal Launcher** directly from the homepage.
2. **Dedicated Standalone Route**: `games/placeholder.html?id=<game-slug>`.

## The 20 Official Mini-Games

| # | Game Title | Category | Slug | Control Scheme | Difficulty |
|---|------------|----------|------|----------------|------------|
| 1 | **Snake Game** | Arcade | `snake-game` | Arrow Keys / Swipe | Easy |
| 2 | **Tetris** | Arcade | `tetris` | Arrows + Space (Hard Drop) | Medium |
| 3 | **Flappy Bird** | Arcade | `flappy-bird` | Spacebar / Tap | Hard |
| 4 | **2048** | Puzzle | `2048` | Arrow Keys / Swipe | Medium |
| 5 | **Memory Card** | Puzzle | `memory-card` | Mouse Click / Touch | Easy |
| 6 | **Tic Tac Toe** | Brain Games | `tic-tac-toe` | Mouse Click | Easy |
| 7 | **Rock Paper Scissors** | Brain Games | `rock-paper-scissors` | Click / Keys 1-2-3 | Easy |
| 8 | **Whack-a-Mole** | Action | `whack-a-mole` | Mouse Click / Tap | Medium |
| 9 | **Space Shooter** | Action | `space-shooter` | WASD + Spacebar | Hard |
| 10 | **Brick Breaker** | Arcade | `brick-breaker` | Mouse Paddle / Arrow Keys | Medium |
| 11 | **Jumping Game** | Action | `jumping-game` | Left / Right Arrows | Medium |
| 12 | **Endless Runner** | Action | `endless-runner` | Arrow Keys (Jump/Slide) | Hard |
| 13 | **Car Racing** | Racing | `car-racing` | Arrow Keys / Steer | Medium |
| 14 | **Minesweeper** | Puzzle | `minesweeper` | Left Click (Open) / Right Click (Flag) | Hard |
| 15 | **Sudoku** | Puzzle | `sudoku` | Numpad / Cell Select | Hard |
| 16 | **Hangman** | Brain Games | `hangman` | Virtual Keyboard / Physical Keys | Easy |
| 17 | **Word Guess** | Brain Games | `word-guess` | Keyboard 5-Letter Typing | Medium |
| 18 | **Math Challenge** | Brain Games | `math-challenge` | Number Keys / Fast Click | Medium |
| 19 | **Piano Tiles** | Arcade | `piano-tiles` | Keys A-S-D-F / Touch | Hard |
| 20 | **Pixel Adventure** | Action | `pixel-adventure` | Arrows + Z (Jump) + X (Attack) | Medium |

## Status: Interactive Gameplay Active!

Semua 20 mini-game kini **sepenuhnya interaktif dan dapat dimainkan langsung di browser** tanpa placeholder alert:
- **Di Halaman Utama (`index.html`)**: Klik tombol "Play In Modal" pada modal pratinjau game mana pun untuk langsung bermain seketika.
- **Di Arena Khusus (`games/placeholder.html?id=<game-id>`)**: Pengalaman layar penuh bergaya arcade cabinet, lengkap dengan D-Pad dan tombol aksi virtual khusus perangkat seluler/touchscreen serta kontrol keyboard desktop.
- **Penyimpanan Skor (Best Record)**: Skor tertinggi otomatis disimpan di browser (`localStorage`).
- **Efek Suara Sintetis (Web Audio API)**: Suara retro chiptune 8-bit tanpa ketergantungan file audio eksternal.

