# BrandArx — Motion Graphics Ad Video

A 20-second animated product/agency ad built with **Remotion** (React + TypeScript → real MP4 output).

---

## Quick start

```bash
cd brandarx-video
npm install
npx remotion studio
```

Open **http://localhost:3000** — you'll see both compositions in the left panel:
- `BrandArxLandscape` — 1280×720, 30fps, ~20s
- `BrandArxVertical` — 1080×1920, 30fps, ~20s (same scenes, vertically re-flowed by relative sizing)

---

## Render to MP4

```bash
# Landscape (YouTube / standard)
npm run build
# → out/brandarx-landscape.mp4

# Vertical (Reels / Shorts / TikTok)
npm run build:vertical
# → out/brandarx-vertical.mp4

# Both at once
npm run build:all
```

Or render directly with the Remotion CLI:

```bash
npx remotion render BrandArxLandscape out/brandarx-landscape.mp4 --codec=h264 --crf=18
npx remotion render BrandArxVertical  out/brandarx-vertical.mp4  --codec=h264 --crf=18
```

---

## Project structure

```
src/
├── index.tsx                      # Remotion root — registers compositions
├── tokens.ts                      # Design tokens, scene frame ranges, FPS
├── utils/
│   └── anim.ts                    # Easing, spring, fadeIn/Out, slideUp/X helpers
├── components/
│   ├── AmbientBackground.tsx      # Slow-drifting glow orbs (persistent every frame)
│   └── Atoms.tsx                  # Logo, GlassCard, GradientText, LabelCard, etc.
├── scenes/
│   ├── Scene1Intro.tsx            # 0:00–0:03  Brand intro
│   ├── Scene2WebDev.tsx           # 0:03–0:08  Web Development + wireframe morph
│   ├── Scene3AI.tsx               # 0:08–0:12  AI Automation chat widget
│   ├── Scene4Stats.tsx            # 0:12–0:16  Stats grid + UX/Growth crossfade
│   ├── Scene5Tagline.tsx          # 0:16–0:18  Tagline sting
│   └── Scene6Outro.tsx            # 0:18–0:20  CTA outro
└── compositions/
    └── BrandArxVideo.tsx          # Timeline — layers all scenes with fade transitions
```

---

## Scene timeline

| # | Scene | Frames | Time | Key animation |
|---|-------|--------|------|---------------|
| 1 | Brand intro | 0–90 | 0:00–0:03 | Logo mark scale+spring, wordmark slide, gradient tagline |
| 2 | Web Development | 90–240 | 0:03–0:08 | Browser mockup card slide-up, wireframe before→after morph |
| 3 | AI Automation | 240–360 | 0:08–0:12 | Chat widget slide, typing dots, sequential message bubbles |
| 4 | Stats + UX/Growth | 360–480 | 0:12–0:16 | Staggered stat cards with count-up, crossfading label text |
| 5 | Tagline sting | 480–540 | 0:16–0:18 | Logo mark spring + gradient tagline fade |
| 6 | Outro / CTA | 540–600 | 0:18–0:20 | Logo scale-in, CTA question + "Get Started" pill |

---

## Animation system

All animations live in [`src/utils/anim.ts`](src/utils/anim.ts):

- `springEntrance(frame, fps, startFrame, config)` — Remotion spring, smooth overshoot
- `fadeIn / fadeOut` — linear opacity ramp
- `slideUp / slideX` — spring-driven translate helpers
- `scaleIn` — spring-driven scale helper
- `ramp` — 0→1 progress with pluggable easing (used for count-up)

---

## Customization

- **Colors / brand**: edit [`src/tokens.ts`](src/tokens.ts) — `COLORS`, `GRADIENTS`, `FONT`
- **Scene durations**: edit the `SCENES` object in `tokens.ts` — all scenes and all animations reference these frame numbers
- **Add a scene**: create a new file in `src/scenes/`, add it to `SCENES` in `tokens.ts`, and mount it in `BrandArxVideo.tsx`
- **Output quality**: pass `--crf` (lower = higher quality, larger file) and `--codec` to the render command

---

## Requirements

- Node.js 18+
- Chrome/Chromium is used by Remotion's renderer — it installs automatically via `@remotion/renderer`
