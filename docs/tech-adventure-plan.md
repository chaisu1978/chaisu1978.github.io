# Terrence's Tech Adventure — Design & Build Plan

## Status — updated 2026-10-11

- **Phase 1 (plumbing): DONE** — router, `/adventure` route, lazy chunk, teaser
  card, nav link, `404.html` predeploy fix.
- **Phase 2 (core engine): DONE** — ASCII-tilemap level system, run/jump/climb,
  DK-style rolling hazards, uptime meter, score, story cards, end screens.
- **Phase 3 (content): DONE** — all four eras playable end-to-end, buff pickups
  (cert→double jump, coffee→uptime, backup→shield, maintenance window→smash),
  `R` resolvable incidents (`E` to fix), CERTIFIED all-pickup bonus, era palettes.
- **Phase 4 (polish): remaining** — see checklist in §5 and §8.

A Donkey Kong–style side-scrolling platformer that plays through Terrence's tech
career in four eras. Built with Phaser 3 + TypeScript, pixel-art sprites, living
on its own route (`/adventure`) so it never fights the homepage for keyboard,
scroll, or rendering resources.

---

## 1. Decisions

| Question | Decision |
|---|---|
| Gameplay style | DK-style platformer — walk, jump, climb ladders between platforms; hazards roll toward you like barrels |
| Engine | Phaser 3 (arcade physics, scenes, Scale manager). Lazy-loaded chunk (~1 MB) |
| Placement | **Dedicated route `/adventure`** + a lightweight "teaser" card on the homepage between Projects and Contact that links to it |
| Art style | Pixel-art sprites (CC0 packs + custom), era-specific tilesets |
| Levels | **Four eras** — see §3 |

### Why a dedicated route over an embedded section

- Eliminates the arrow-keys/spacebar vs. page-scroll conflict entirely — the game
  owns the window.
- Phaser only downloads and boots when the visitor navigates to `/adventure`;
  the portfolio bundle stays lean.
- Full viewport by default — no expand/fullscreen hacks needed.
- Clean lifecycle: the game mounts on route enter, destroys on route leave.

The teaser section on the homepage is a static styled card (no Phaser import) —
keeps the game discoverable inside the scroll journey.

### GitHub Pages SPA caveat

`github.io/adventure` loaded directly → 404 (no server routing). Fix: copy
`dist/index.html` to `dist/404.html` during `predeploy` — GitHub Pages serves it
for unknown paths and the router takes over. One-liner in `package.json`:

```json
"predeploy": "npm run build && node -e \"fs.copyFileSync('dist/index.html','dist/404.html')\""
```

---

## 2. File layout

```
src/
  pages/
    AdventurePage.tsx        — route host: mounts game, UI chrome (mute, exit, score)
  sections/
    AdventureTeaser.tsx      — homepage card linking to /adventure
  game/
    config.ts                — Phaser config: arcade physics, Scale.RESIZE, pixelArt: true
    scenes/
      BootScene.ts           — asset loading
      MenuScene.ts           — title, controls, difficulty select
      LevelScene.ts          — ONE scene parameterized by a level config (not 4 scenes)
      StoryCardScene.ts      — narrative beat between eras
      EndScene.ts            — victory / game over + "scroll to Connect" CTA
    levels/
      era1.ts era2.ts era3.ts era4.ts   — data: palette, platforms, ladders,
                                          hazards, pickups, story copy
    entities/                — Player, Hazard, Pickup, Ladder zone, Resolveable
public/game/                 — all sprites/tiles/audio (served statically, not bundled)
```

Router: `react-router-dom` v7 is already installed but unused — wire up
`BrowserRouter` in `main.tsx` with `/` → portfolio, `/adventure` → `lazy(AdventurePage)`.

---

## 3. The four eras (level configs)

| # | Era | Setting | Rolling hazards (the "barrels") | Collectibles / goal | Boss set-piece |
|---|---|---|---|---|---|
| 1 | **Dial-Up Days** | Trinidad ISP server room, late '90s | CRT monitors, error dialogs, dropped dial-up connections | VB/ASP/NT Server icons | **Server Room Meltdown** |
| 2 | **London Calling** | Contract work — systems management & support, early 2000s | Ticket queues, on-call pager storms, rain (Tube/grey-sky aesthetic) | Exchange/SMS Server/MCSE cert = level goal | **The Y2K Bug** |
| 3 | **The Long Game** | Courts (later Unicomer) — Systems Analyst, 20 yrs, Caribbean retail | End-of-day batch jobs, POS tickets, printer jams | SQL Server, PowerShell, AD icons | **Christmas Rush Outage** |
| 4 | **Full-Stack Remote** | Home office — logistics/trucking startup, today | Trucks, merge conflicts, failing pipelines, 2 a.m. pages | React, Node, TS, Docker, GH Actions | **Friday 4 PM Prod Deploy** |

Between eras, a `StoryCardScene` — one screen of dated copy
("2000: contract work, London") — cheap to build, turns levels into a narrative.

Collectibles are a real subset of `src/constants/skillsList.ts` (icons already
available via Iconify — export needed ones as PNGs into `public/game/`).

---

## 4. Core mechanics

- **Move / jump / climb ladders** — arcade physics + ladder overlap zones.
- **Resolve vs. avoid** — signature mechanic: resolvable incidents show a wrench
  prompt; `E` nearby resolves them for bonus points. Dodge past = survive, no
  points. Rewards playing like a systems analyst, not just a runner.
- **"Maintenance Window" power-up** — DK's hammer homage: ~8 s of smashing
  oncoming hazards.
- **Uptime meter** — 3 hits = "System Down" (game over). Coffee restores uptime.
- **Score** = incidents resolved + skills collected; high score in `localStorage`.
- **Difficulty toggle** on the menu (Casual / SysAdmin mode).

---

## 5. Art & audio — Phase 4 asset checklist

Current state: all textures are generated placeholders in `BootScene`. Each item
below is a drop-in replacement — no engine changes needed.

**Sprites needed (pixel art, Piskel/Aseprite/CC0):**
- [ ] Player sprite sheet: idle, run (4-6f), jump, climb (2-4f) — 24×32
- [ ] Era outfit variants or palette swaps: '90s tee → London jacket → Courts polo → hoodie
- [ ] Hazard sprites per era: CRT monitor / error dialog (era1), ticket + pager
      (era2), batch job + printer jam (era3), merge conflict + truck (era4)
- [ ] Incident sprite: smoking server / warning ticket (replaces `incident`)
- [ ] Goal sprites per era: server rack → Exchange server → POS/ERP console → deploy button
- [ ] Pickup sprites: cert badge, coffee cup, floppy backup, wrench (have
      placeholders — upgrade to real art)
- [ ] Girder/tile sets per era + parallax background layers:
      Trinidad server room → London skyline/rain → retail warehouse → night office

**Audio needed (CC0 — OpenGameArt/Kenney):**
- [ ] Chiptune loop per era (4 tracks)
- [ ] SFX: jump, collect, hit, resolve, smash, level-complete jingle, game-over sting
- [ ] Mute toggle (persist to localStorage)

**Boss set-pieces (one per era, simple scripted patterns):**
- [ ] Era 1: Server Room Meltdown — hazards rain from above
- [ ] Era 2: The Y2K Bug — spiral error pattern
- [ ] Era 3: Christmas Rush Outage — hazard flood + timer pressure
- [ ] Era 4: Friday 4 PM Prod Deploy — the finale

**UX polish:**
- [x] Goal beacon (▼ over the server) — done
- [x] Level-complete screen between eras — done
- [ ] Difficulty toggle on menu (Casual / SysAdmin)
- [ ] Touch controls (coarse-pointer: on-screen buttons + optional auto-run)
- [ ] prefers-reduced-motion: disable screen shake/camera effects
- [ ] High score in localStorage
- [ ] Victory screen CTA → scroll to Connect section

Tooling: Piskel (free) for sprites; assets land in `public/game/` — served
statically, keeps them out of the JS bundle.

---

## 6. Engineering checklist (the "didn't think of" list)

- [ ] Phaser + all game code behind `React.lazy` — verify chunk split in build output
- [ ] StrictMode double-mount: create game in `useEffect`, `game.destroy(true)` in cleanup
- [ ] Pause on `visibilitychange` and when window blurs
- [ ] Keyboard: `preventDefault` arrows/space while game focused
- [ ] Touch controls: on-screen left/right/jump under `(pointer: coarse)`; auto-run option
- [ ] `prefers-reduced-motion`: disable screen shake / camera effects
- [ ] Mute + high score persisted to `localStorage`
- [ ] `predeploy` copies `index.html` → `404.html` for SPA routing on GitHub Pages
- [ ] End screen funnels to Connect section ("Game Over → let's talk")

---

## 7. Phased build

1. **Plumbing** — `phaser` dep (pin ≥7-day-old version), router + `/adventure`
   route, lazy `AdventurePage`, teaser card, 404.html predeploy fix, Phaser boots
   a "hello" scene.
2. **Core engine** — Era 1 playable: movement, jump, ladders, one rolling hazard,
   collisions, uptime/score, game over/restart, placeholder art.
3. **Content** — all four era configs, resolve mechanic, skill collectibles,
   story cards, level transitions.
4. **Polish** — sprites/animation, audio, Maintenance-Window power-up, boss
   set-pieces, difficulty, touch controls, high scores.

Phase 2 is the playable MVP; everything after is additive.
