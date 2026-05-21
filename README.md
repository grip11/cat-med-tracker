# 🐱 Cat Med Tracker

A clean, minimal medication tracker for your cat. Built with React + Vite. All data is stored locally in the browser (localStorage) — no backend needed.

## Features

- 🐱 Cat profile with name, breed, age, weight
- 💊 Add & manage medications with dosage, frequency, notes, and dates
- ✅ One-tap dose logging with optional notes and custom timestamp
- 📊 Status indicators: On track / Due soon / Overdue
- 📋 Full dose history grouped by day
- 💾 Persists across sessions via localStorage

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2 — GitHub integration
1. Push this repo to GitHub
2. Go to vercel.com → Add New Project
3. Import your GitHub repo
4. Vercel auto-detects Vite — click Deploy

Every future `git push` to `main` will trigger an automatic redeploy.

## Tech stack

- React 18
- Vite 5
- Zero dependencies beyond React
- localStorage for persistence
