---
name: tiktok-safe-area
description: Layout rules that keep text, cards and illustrations inside the TikTok / Reels safe area of a 1080×1920 vertical video. Use whenever creating or editing a vertical (9:16) video, Reel, TikTok or Short in this repo, and before rendering one.
---

# TikTok safe area rules (1080×1920)

TikTok draws its own UI over the video: the "Following / For You" tabs at the top,
the like / comment / share column on the right, and the caption, username, music
and tab bar at the bottom. Anything important must stay out from under them.

## 1. The safe box

The reference spec is drawn at 540×960; every value here is doubled for 1080×1920.

| Edge | Margin | Safe range |
|---|---|---|
| Left | 120 px | x ≥ 120 |
| Right | 240 px (action buttons) | x ≤ 840 |
| Top | 252 px (top tabs) | y ≥ 252 |
| Bottom | 640 px (caption, username, music, tab bar) | y ≤ 1280 |
| Top strip exception | only for y 252–360 | x may extend to 960 |

Safe content area: **720 × 1028**, from (120, 252) to (840, 1280).

Define it once as constants and position everything from them. Never hard-code edge numbers in a scene:

```ts
export const SAFE = {
  left: 120,
  top: 252,
  right: 840,
  bottom: 1280,
  width: 720,
  height: 1028,
  stripRight: 960,
  stripBottom: 360,
};
```

(In this repo: `data-pipeline-analogy/src/brutal/kit.tsx`.)

## 2. Layout rules

1. **Only the background may bleed to the frame edges.** Backgrounds and decorative
   patterns can sit under TikTok's UI. Text, cards, illustrations, captions, counters
   and anything else the viewer must read or see may not.
2. **Position from `SAFE`, never from the frame.** Use `left: SAFE.left` and
   `width: SAFE.width` (or less). Don't use `left: 0`, `right: 0`, `inset: 0` or
   full-width rows for content.
3. **Include shadows, borders and outlines in the size.** A hard shadow of N px makes a
   box N px wider and taller. Size boxes `SAFE.width - N` wide and keep their bottom
   edge at `SAFE.bottom - N`.
4. **Centre inside the safe box, not the frame.** The safe box is off-centre (its middle
   is at x = 480, not 540), so content centred on the frame drifts into the action
   buttons. For a centred layout, wrap it in a container at
   `left: SAFE.left, top: SAFE.top, width: SAFE.width, height: SAFE.height`.
5. **Use the same vertical bands in every scene:**
   - Title: y 260–520 (kicker plus at most 2 lines at ~76 px)
   - Main visual: y 530–1090
   - Caption: bottom edge at y 1270 (at most 2 lines at ~44 px)
6. **Fit text to the width, don't overflow it.** Shorten the copy first, then use
   `whiteSpace: "nowrap"` for short labels and `textWrap: "balance"` for multi-line text.
   Keep text at least 44 px for supporting copy and ~76 px for headlines (rescale
   proportionally for other resolutions). Don't shrink text below these sizes to make
   it fit.
7. **Size illustrations to their panel.** Put each SVG inside a panel that sits within
   `SAFE` and give the SVG `width: 100%; height: 100%` with a matching `viewBox`, so
   nothing it draws can land outside the panel.
8. **Check final positions and motion paths.** Entrance offsets (slide-ins, pop-in
   overshoot) are only temporary. Resting positions, and anything that keeps moving
   (looping objects, counters, bouncing icons), must stay inside the box for the whole
   scene.
9. **Rotation and scale grow the footprint.** A tilted sticker or a scaled-up number
   takes more room than its layout box. Leave ~20 px of slack for those.

## 3. Verify before rendering

Add a debug overlay that shades the unsafe area, behind a composition prop
(`showSafeArea`, default `false`):

```tsx
export const SafeAreaGuide: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920}>
      <path
        d={`M 0 0 H 1080 V 1920 H 0 Z M ${SAFE.left} ${SAFE.top} V ${SAFE.bottom} H ${SAFE.right} V ${SAFE.stripBottom} H ${SAFE.stripRight} V ${SAFE.top} Z`}
        fill="rgba(255,0,80,0.28)"
        fillRule="evenodd"
      />
    </svg>
  </AbsoluteFill>
);
```

Then render one still per scene, at a frame where everything has finished entering,
and look at each one:

```sh
npx remotion still DataPipelineBrutal check.png --frame=400 --props='{"showSafeArea":true}'
```

**Pass:** nothing except background touches the red. Any text, box edge, shadow or
illustration that does means the scene must be fixed before the final render.
Never ship the overlay. The final render uses the default `showSafeArea: false`.
