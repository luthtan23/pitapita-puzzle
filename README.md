# PitaPita Puzzle

A monorepo for the **PitaPita** interactive image puzzle game.

## Structure

```
pitapita-puzzle/
├── pitapita-frontend/   # Next.js 15 puzzle game app
└── pitapita-backend/    # Backend service (coming soon)
```

## Frontend

**PitaPita** is a stunning, interactive image puzzle game built with **Next.js 15 (App Router)** and **TypeScript**. Drag, drop, and solve beautiful picture puzzles with multiple difficulty levels and a premium, responsive design.

### Features

- **Smooth Drag & Drop:** Intuitive gameplay using `@dnd-kit`.
- **Responsive Design:** Optimized for mobile, tablet, and desktop.
- **Multiple Difficulties:** Easy (3×3), Medium (4×4), Hard (5×5), Expert (6×6).
- **Game Stats:** Real-time timer and move counter.
- **Leaderboard:** Tracks your best scores locally.
- **Image Peeking:** Hover/Tap the reference image for a quick solution hint.
- **Premium UI:** Built with Vanilla CSS, glassmorphism, and smooth animations.

### Getting Started

```bash
cd pitapita-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **State Management:** React Hooks
- **Drag & Drop:** @dnd-kit/core
- **Styling:** CSS Modules
- **Fonts:** Outfit & Inter (Google Fonts)

## License

MIT
