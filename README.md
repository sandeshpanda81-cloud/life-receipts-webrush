# LIFE RECEIPTS — WebRush 6-Hour Frontend Hackathon

A frontend-only storytelling experience for the **Your Life, In Receipts 🧾** challenge.

## Concept

**Raw Data → Information → Insights → Connections → Story**

The experience turns three supplied data streams into a narrative:
- Spotify listening history
- Daily household transactions
- India transaction/card activity

Instead of presenting a plain timeline, the UI:
1. surfaces behavioral patterns,
2. creates story chapters,
3. lets the user search/filter receipts,
4. connects nearby receipts across streams with a ±24-hour scene engine,
5. visualizes recurring listening and spending signals.

## Run locally

No build step is required.

Open `index.html` in a browser, or use VS Code Live Server.

## Deploy

### GitHub Pages
1. Create a public GitHub repository.
2. Upload `index.html`, `style.css`, `app.js`, and `data.js`.
3. Go to **Settings → Pages**.
4. Choose **Deploy from a branch** → `main` → `/root`.
5. Save and wait for the Pages URL.

### Netlify
Drag the whole project folder into Netlify's deploy area.

## Important

This is intentionally **frontend-only**. No backend, server, database, or secret API key is used.

## Submission checklist

- [ ] Live URL opens in incognito
- [ ] GitHub repository is public
- [ ] Search works
- [ ] Filters work
- [ ] Connection engine works
- [ ] Mobile layout tested
- [ ] README included
- [ ] No local file paths or secrets
