# 🗺️ Portfolio Dev Log

A living document tracking every decision, learning, and milestone across the portfolio build journey.

---

## How to Use This Log

- **Decisions** — why we built it this way, not just what we built
- **Learnings** — gotchas, discoveries, things that surprised us
- **Milestones** — shipped features and deployments
- **Next Steps** — what's queued up

Entries in reverse chronological order (newest first per section).

---

## 📅 May 2026 — Phase 1: Initial Build & Deploy

### Milestone
- Portfolio scaffolded from scratch: React + TypeScript + Vite + React Router
- Deployed to Vercel via CLI (`vercel` → auto-detect Vite)
- Pushed to GitHub: github.com/Darryll2022/portfolio

### What was built
- **World Map** — KH-style homepage with floating animated orbs per project world
- **Character Screen** — Darryll's stat panel, animated XP bars, abilities list, quest summary
- **Quest Pages** — scroll-revealed story chapters written in first person (Darryll's voice)
- **Hidden Midgar Page** — accessible via `/?world=darkness`, FF7 green mako theme
  - `UNLOCKED = false` — sealed until dark mode ships
  - When dark mode arrives: flip to `true` and drop in CI/CD architecture content
- **Stars canvas** — floating star particles with flicker + drift animation
- **`vercel.json`** — rewrites all routes to `index.html` so React Router works on refresh

### Design decisions
- **Kingdom Hearts palette** — deep midnight navy (#04061a), royal blue (#0d1f6b), gold (#f0c040), star white (#e8eeff). Cinzel font for headings (elegance + fantasy).
- **No UI framework** — pure inline styles + CSS variables. Keeps bundle tiny (181KB), zero dependencies beyond React + Router.
- **Story-first quest pages** — visitor reads Darryll's journey building each project, not just a feature list. Emotional engagement over spec sheets.
- **World = Project metaphor** — each project is a world to enter, not a card to skim. Viewer agency via the World Map.
- **Hidden world pattern** — `/?world=darkness` easter egg keeps the FF7 CI/CD doc invisible until dark mode ships. No nav link — must be discovered or shared.

### Learnings
- **React Router + Vercel** — SPAs need a catch-all rewrite rule or every deep link 404s. Fixed with `vercel.json` rewrites.
- **`useSearchParams` for easter egg** — cleaner than a separate route. `?world=darkness` stays on `/` so it feels hidden.
- **Cinzel font** — Google Fonts, needs `preconnect` in `index.html` or it blocks render visibly.
- **IntersectionObserver for stat bars** — animates only when scrolled into view. No library needed.

### Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Familiar, typed, fast |
| Bundler | Vite 5 | Instant HMR, tiny config |
| Routing | React Router v6 | File-based feel without Next.js overhead |
| Fonts | Google Fonts (Cinzel + Inter) | Zero install, KH aesthetic |
| Hosting | Vercel | Git-connected, auto-deploys on push |

---

## 🗓️ Upcoming — Phase 2

- [ ] Deploy to custom domain (when ready)
- [ ] Add real photo to character card (replace 🧑‍💻 placeholder)
- [ ] Update character class from 'Builder' to final title
- [ ] Add Fighting Game live demo link once rebuilt in TypeScript
- [ ] Add more project worlds (podcast-generator, future projects)
- [ ] Dark mode — FF7 theme → unlocks Midgar world
- [ ] Add contact/collaboration section

---

## 🌑 Midgar Unlock Checklist (FF7 CI/CD doc)

When dark mode ships:
1. Flip `UNLOCKED = false` → `true` in `src/pages/MidgarPage.tsx`
2. Write CI/CD architecture content (pipelines, GitHub Actions, deploy flow)
3. Style it with the FF7 dark theme (green mako `#50c850` on near-black)
4. Add a subtle hint on the World Map for dark mode users only

---
