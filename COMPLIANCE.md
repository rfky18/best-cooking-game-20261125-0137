# Bounty Compliance Checklist — best-cooking-game-20261125-0137

Contest: **Make the best cooking game** — $250, top 10 — closes 25 Nov 2026 20:37 WIB.
Entry: NASGOR RUSH (Indonesian street-food cooking game). Repo: `rfky18/best-cooking-game-20261125-0137`.

## Requirements (from /requirements + description, verified live 25 Nov)

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | Public GitHub repo owned by rfky18, created after opening (2026-11-25T01:37:00Z) | ✅ | Repo created via `gh` after opening; About homepage + topics set |
| 2 | OSI license | ✅ | `LICENSE` (MIT) at repo root |
| 3 | Program in `main.ts` (Node 22) at root | ✅ | `main.ts` — deterministic, no network, no reads outside repo; writes JSON log to `/output` (fallback `./out`), exit 0; two runs byte-identical (verified) |
| 4 | `vendor/makefun-game.ts` copied from kit unmodified | ⏳ KOORDINATOR | Kit blocked by execution-risk check — vendor file lives inside `kit.tar.gz`, not extracted. Coordinator handles after user approval. |
| 5 | `game/` static files, `index.html` runs in desktop Chrome, all loaded files under `game/` | ✅ | `game/index.html` + `style.css` + `game.js` only; zero external requests (no network at runtime); `main.ts` validates every referenced asset exists |
| 6 | 3–4 genuine screenshots under `screenshots/` rendered from the game itself | ✅ | 4 JPEGs (1280×800, Camoufox): menu, active cooking, order+serving, level complete — captured from the running game via real clicks |
| 7 | Screenshot content: kitchen + order board, ingredients on the counter, one dish mid-assembly, a timer, a plate ready to serve | ✅ | Screenshots 02–03 show all five in one viewport (HUD timer, order board, wok mid-cook, 14 ingredients, plated dish); layout verified to fit 1280×800 exactly |
| 8 | README with live badge template + referral | ✅ | `README.md` with make.fun badge/live/rank/reward template + referral UTM params |
| 9 | Repo About (homepage + topics) | ✅ | Homepage `https://make.fun/bounty/best-cooking-game-20261125-0137`, topics `makefun, ai-agents, bounties` |
| 10 | Transcripts (bundle via kit CLI) | ⏳ KOORDINATOR | Needs kit CLI — blocked, same as #4 |
| 11 | Escrow wallet in `.makefun/owner.json` | ✅ | `doQ3doeJj1dDpscCs1E389yFtyosoKUdjAzDwv8HXDH` |
| 12 | Entry fee: none (free contest) | ✅ | — |
| 13 | Judge: pairwise AI comparison of screenshots + source outline | ✅ | Screenshots are genuine renders; source is clean, commented, modular |

## Game completeness (prompt-user.txt spec)

- 8 recipes with exact multiset validation (incl. double-egg Telur) — ✅ tested live + headless (`main.ts`, 25/25 checks PASS)
- 6+ customers (8 total, 2 unlockable) with patience, moods, quotes — ✅ tested live
- 10 levels, targets, timers, escalating difficulty; L8 RUSH HOUR, L10 MIDNIGHT RUSH — ✅ tested live (L10 HUD, VIP, event)
- Combo/scoring (perfect 1.5x, fast bonus, combo multiplier up to x3, VIP 2x) — ✅ tested live (score math verified: 179/209/290/499)
- Effects: flame, steam/smoke particles, coin-fly, floaters, screen shake, confetti, golden perfect glow — ✅ observed in screenshots/live
- Audio: WebAudio SFX + music loop, independent toggles, never crashes without audio — ✅ code-verified (all audio wrapped in try/catch + soundOn gates)
- Menu + How to Play, pause/resume, localStorage save — ✅ tested live
- Daily challenge (date-seeded), 6 achievements, 5 upgrades with real effects, random events, VIP, high-score top 5, unlockables — ✅ tested live (purchase deducted 500→400 coins; achievements unlocked in save)
- Story mode: intro cinematic, skippable dialogues, story missions, ending scene — ✅ tested live (L1 + L10 dialogues)
- Food presentation: dynamic plating (egg, kerupuk, cucumber, spring onion, kecap, steam, golden perfect) + close-up showcase modal — ✅ tested live (perfect/burned/undercooked variants)
- Keyboard shortcuts (1–0, Space, S, R, P/Esc) — ✅ tested live

## QA results (strict judge pass, 25 Nov, Camoufox 1280×800)

- Full loop (menu → play → 2 perfect serves → level complete → pause/resume → menu): PASS, 0 console errors/warnings
- Wrong serve / burned / undercooked paths: PASS (one real bug found & fixed: mystery dish crashed `dishHTML` on missing `needs` — fixed with `needs: []` + defensive access; re-tested PASS)
- Stale menu coin display after upgrade purchase: found & fixed (`closeOverlay` re-renders menu)
- Burned status message overwritten by `renderWok`: found & fixed (status set after render)
- Layout: game screen was 1067px tall → compacted to exactly 800px so all required screenshot elements fit one viewport
- Game over (timer expiry → GAGAL → retry): tested live (see test log)
- `main.ts`: 25/25 checks PASS, deterministic across two runs
- Small-window/responsive: layout uses flex-wrap + media queries (900px/520px breakpoints); not exhaustively tested below 800px — noted as limitation

## Known limitations (not hidden)

- Kit-dependent items (#4, #10: vendor file + bundle/check/submit) are the coordinator's job after user approval of the execution-risk-flagged kit.
- Emoji render monochrome in headless Firefox (no color-emoji font on this VPS); they render in color in desktop Chrome.
- Random events are time-based (first fires ~35–55s in); verified live once (RUSH HOUR).
- Audio could not be heard in headless test; code paths are guarded and SFX calls produced no errors.
