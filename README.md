# RECEIPTS — WebRush God Mode

A frontend-only data-story experience for **Your Life, In Receipts 🧾**.

## What changed
This version was reconstructed around the challenge's core requirement:
**Raw Data → Information → Insights → Connections → Story**

### Experience
- Editorial / premium landing page
- Story Engine with three narrative chapters
- Constellation Engine using a ±24h temporal window
- Searchable and filterable receipt explorer
- Interactive receipt detail modal
- Pattern Lab: artist recurrence, 24-hour rhythm, household spending and weekday pulse
- Responsive desktop/tablet/mobile layout
- Smooth motion, micro-interactions, scroll progress and visual hierarchy
- Frontend-only; no backend or secret keys

## Data
The included `data.js` is derived from the three supplied datasets:
- Spotify listening history
- Daily Household Transactions
- Augmented India transaction dataset

The frontend ships a compact representative evidence set plus computed aggregate patterns, keeping the deployment fast.

## Run
Open `index.html` directly, or use VS Code Live Server.

## Deploy
GitHub Pages:
Settings → Pages → Deploy from branch → `main` → `/root`.

Netlify/Vercel can also deploy the folder as a static site.

## Submission checklist
- [ ] Public GitHub repository
- [ ] Live URL works in incognito
- [ ] Test search + filters
- [ ] Test constellation nodes
- [ ] Test mobile
- [ ] Keep README
