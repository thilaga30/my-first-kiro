# Project: Foods of Tamil Nadu

## Goals
A premium React + Vite food-discovery SPA showcasing traditional Tamil Nadu cuisine. Built for Kiro University 2026. No backend — all data is local.

## Tech Stack
- React 18 + Vite (JavaScript, not TypeScript)
- Vitest + fast-check for unit and property-based testing
- Plain CSS (no CSS-in-JS, no Tailwind)
- No Redux, Zustand, or global state libraries

## Conventions
- One component per file, PascalCase filenames
- camelCase for hooks, utils, data fields
- All source under `src/`: `components/`, `hooks/`, `utils/`, `data/`
- Food dataset lives only in `src/data/foods.js` — never inline in components
- Only `useFavourites` touches `localStorage`
- No secrets, tokens, node_modules, or build output in git

## Commands
```
npm install        # install dependencies
npm run dev        # dev server
npm run build      # production build
npm test -- --run  # run all tests once
npm run preview    # preview production build
```
