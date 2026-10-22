// Screen-record the Gosok Berhadiah merchant widget (https://github.com/faqihbw/gosok-berhadiah)
// walking through its use cases, into a 1920x1080 MP4.
//
// Unlike scripts/render.mjs this drives the real app in real time. The demo shell is
// reduced to the phone, a use-case panel, title cards and a touch indicator are injected
// as DOM overlays, frames come from the CDP screencast, and every tap/reveal is logged to
// cues.json so soundtrack.py can place sound effects on them.
//
// Usage: node gosok-berhadiah-demo/record.mjs [demoUrl] [out.mp4]
//   demoUrl defaults to http://localhost:8000/demo/ (serve a clone of the repo
//   with `python3 -m http.server 8000`).
// Needs ffmpeg with libx264 on PATH, or set FFMPEG=/path/to/ffmpeg.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const BASE = process.argv[2] || 'http://localhost:8000/demo/';
const OUT = process.argv[3] || path.join(HERE, 'gosok-berhadiah-demo.mp4');
const FPS = 30;
const ffmpegBin = process.env.FFMPEG || 'ffmpeg';
const FRAMES = path.join(HERE, '.frames');
const SILENT = path.join(HERE, '.video.mp4');
const AUDIO = path.join(HERE, 'soundtrack.wav');

// 1280x720 CSS px at DPR 1.5 = 1920x1080 device px. The phone screen is ~356 CSS px
// wide, so the widget renders its real mobile layout.
const VW = 1280, VH = 720, DPR = 1.5;

const USE_CASES = [
  ['Scratch to win cash', 'Bought an EDC? Enter the phone number, scratch the card, win commission paid every Friday.'],
  ['Android = double chance', 'The higher-margin Android EDC earns 2 scratch cards per order.'],
  ['Grand-prize draw ticket', 'Some cards win a GOSOK-XXXXX code, drawn live on Instagram for phones and tablets.'],
  ['Every prize in one place', 'Repeat buyers see their totals and full scratch history.'],
  ['Clear order status', 'Cards appear once ops confirm the order. Until then, the merchant knows why.'],
];

fs.rmSync(FRAMES, { recursive: true, force: true });
fs.mkdirSync(FRAMES, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: DPR });
// Seeded Math.random in every frame, so prizes are the same on every take.
await ctx.addInitScript(() => {
  let s = 20260620;
  Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
});
const page = await ctx.newPage();
await page.goto(BASE);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);

// ── Stage: phone on the left, use-case panel on the right ─────────────────
await page.evaluate((USE_CASES) => {
  const css = `
  html, body { overflow: hidden !important; }
  #rec-stage { position: fixed; inset: 0; z-index: 5; background: radial-gradient(700px 560px at 28% 50%, #fff3cc, #F6F4EC 70%); }
  .phone { position: fixed !important; left: 150px; top: 14px; width: 380px !important; height: 692px !important; z-index: 10; margin: 0 !important; }
  #rec-touch { position: fixed; left: 0; top: 0; width: 32px; height: 32px; margin: -16px 0 0 -16px; border-radius: 50%; z-index: 2147483647;
    pointer-events: none; background: rgba(255,255,255,.55); border: 2.5px solid rgba(27,63,139,.75); box-shadow: 0 3px 10px rgba(0,0,0,.25);
    transform: translate(900px, 800px); transition: scale .12s; }
  #rec-touch.down { scale: .78; background: rgba(255,193,7,.75); }
  .rec-ripple { position: fixed; width: 48px; height: 48px; margin: -24px 0 0 -24px; border-radius: 50%; z-index: 2147483646; pointer-events: none;
    border: 3px solid #FFC107; animation: rec-ripple .55s ease-out forwards; }
  @keyframes rec-ripple { from { transform: scale(.3); opacity: 1; } to { transform: scale(1.5); opacity: 0; } }
  #rec-panel { position: fixed; left: 610px; top: 0; bottom: 0; width: 590px; z-index: 20; pointer-events: none;
    display: flex; flex-direction: column; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; color: #2C2C2A; }
  #rec-panel .k { font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #854F0B; }
  #rec-panel h2 { margin: 4px 0 22px; font-size: 34px; font-weight: 800; letter-spacing: -.8px; color: #122c63; }
  #rec-panel h2 span { color: #c69100; }
  .uc { display: flex; gap: 16px; align-items: flex-start; padding: 12px 16px; margin-bottom: 8px; border-radius: 16px;
    border: 1.5px solid transparent; opacity: .42; transition: opacity .4s, background .4s, border-color .4s, transform .4s; }
  .uc .n { flex: none; width: 38px; height: 38px; border-radius: 11px; background: #E2E0D7; color: #6B6A64;
    display: grid; place-items: center; font-weight: 800; font-size: 18px; transition: background .4s, color .4s; }
  .uc .t { font-weight: 800; font-size: 20px; line-height: 38px; color: #122c63; }
  .uc .d { max-height: 0; overflow: hidden; font-size: 15.5px; line-height: 1.45; color: #5b5a54; transition: max-height .45s; }
  .uc.done { opacity: .7; }
  .uc.done .n { background: #E1F5EE; color: #0F6E56; }
  .uc.on { opacity: 1; background: #fff; border-color: #FAC775; box-shadow: 0 10px 30px rgba(27,63,139,.12); transform: translateX(-6px); }
  .uc.on .n { background: #1B3F8B; color: #FFC107; }
  .uc.on .d { max-height: 70px; }
  .rec-card { position: fixed; inset: 0; z-index: 2147483640; display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; color: #fff; pointer-events: none; font-family: 'Plus Jakarta Sans', sans-serif;
    background: radial-gradient(900px 560px at 50% 35%, #1B3F8B, #0c1f49); transition: opacity .7s; }
  .rec-card.off { opacity: 0; }
  .rec-card .k { font-size: 13px; letter-spacing: 5px; text-transform: uppercase; opacity: .7; }
  .rec-card h1 { margin: 10px 0 8px; font-size: 64px; font-weight: 800; letter-spacing: -2px; }
  .rec-card h1 span { color: #FFC107; }
  .rec-card p { margin: 0; font-size: 21px; opacity: .92; }
  .rec-card .stats { display: flex; gap: 12px; margin-top: 30px; }
  .rec-card .stats div { padding: 10px 16px; border-radius: 14px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); font-size: 14px; }
  .rec-card .stats b { display: block; font-size: 22px; color: #FFC107; }
  .rec-card .links { margin-top: 28px; font: 600 18px/1.7 'JetBrains Mono', monospace; }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const add = (html) => { const d = document.createElement('div'); d.innerHTML = html; document.body.appendChild(d.firstElementChild); };
  add('<div id="rec-stage"></div>');
  add('<div id="rec-touch"></div>');
  add(`<div id="rec-panel"><div class="k">Merchant scratch widget · use cases</div><h2>Gosok <span>Berhadiah</span></h2>` +
    USE_CASES.map(([t, d], i) => `<div class="uc" id="uc${i + 1}"><div class="n">${i + 1}</div><div><div class="t">${t}</div><div class="d">${d}</div></div></div>`).join('') +
    '</div>');
  add(`<div class="rec-card" id="rec-title"><div class="k">BukuAgen EDC · Portfolio demo</div>
    <h1>Gosok <span>Berhadiah</span></h1>
    <p>Buy an EDC, scratch a digital card, win cash commission or a grand prize.</p></div>`);
}, USE_CASES);

const cues = [];
let t0 = null;
const cue = (type) => cues.push({ type, t: +(Date.now() / 1000 - t0).toFixed(3) });
const wait = (ms) => page.waitForTimeout(ms);

const setTouch = (x, y, ms) => page.evaluate(([x, y, ms]) => {
  const c = document.getElementById('rec-touch');
  c.style.transition = ms ? `transform ${ms}ms cubic-bezier(.45,0,.25,1), scale .12s` : 'scale .12s';
  c.style.transform = `translate(${x}px, ${y}px)`;
}, [x, y, ms]);
const press = (on) => page.evaluate((on) => document.getElementById('rec-touch').classList.toggle('down', on), on);
async function moveTo(x, y, ms = 600) {
  await setTouch(x, y, ms);
  await page.mouse.move(x, y, { steps: 6 });
  await wait(ms);
}
async function center(loc) {
  await loc.waitFor({ state: 'visible' });
  const b = await loc.boundingBox();
  return [b.x + b.width / 2, b.y + b.height / 2];
}
async function tap(loc, { ms = 600, after = 350 } = {}) {
  const [x, y] = await center(loc);
  await moveTo(x, y, ms);
  await page.evaluate(([x, y]) => {
    const r = document.createElement('div'); r.className = 'rec-ripple';
    r.style.left = x + 'px'; r.style.top = y + 'px';
    document.body.appendChild(r); setTimeout(() => r.remove(), 700);
  }, [x, y]);
  cue('click');
  await press(true); await page.mouse.down(); await wait(90); await page.mouse.up(); await press(false);
  await wait(after);
}
async function useCase(n) {
  await page.evaluate((n) => document.querySelectorAll('.uc').forEach((el, i) => {
    el.classList.toggle('on', i + 1 === n);
    el.classList.toggle('done', i + 1 < n);
  }), n);
  cue('caption');
  await wait(500);
}
async function card(id, html, ms) {
  await page.evaluate(([id, html]) => {
    const o = document.createElement('div'); o.className = 'rec-card off'; o.id = id; o.innerHTML = html;
    document.body.appendChild(o);
    requestAnimationFrame(() => requestAnimationFrame(() => o.classList.remove('off')));
  }, [id, html]);
  cue('whoosh');
  await wait(ms);
}

// ── Merchant widget actions ───────────────────────────────────────────────
const mf = page.frameLocator('#merchantFrame');
async function lookup(phone) {
  await mf.locator('body').evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await tap(mf.locator('#ga-uid-input'), { after: 150 });
  await mf.locator('#ga-uid-input').fill('');
  await mf.locator('#ga-uid-input').pressSequentially(phone, { delay: 65 });
  await wait(250);
  await tap(mf.locator('#ga-check-btn'), { after: 200 });
  await mf.locator('#ga-body').filter({ hasNotText: /^\s*$/ }).waitFor();
  await wait(1000);
}
async function scratch(tile) {
  await tap(tile, { after: 0 });
  await mf.locator('#ga-scratch-loading').waitFor({ state: 'hidden' });
  await wait(1100);
  const cb = await mf.locator('#ga-scratch-canvas').boundingBox();
  const revealed = () => mf.locator('#ga-scratch-canvas.revealed').count();
  await moveTo(cb.x + 22, cb.y + 26, 450);
  await press(true);
  await page.mouse.down();
  cue('scratch');
  for (let row = 0; row < 16 && !(await revealed()); row++) {
    const y = cb.y + 26 + row * 24;
    const [xa, xb] = row % 2 ? [cb.x + cb.width - 22, cb.x + 22] : [cb.x + 22, cb.x + cb.width - 22];
    for (let i = 1; i <= 9; i++) {
      const x = xa + (xb - xa) * i / 9, yy = y + 12 * i / 9 + Math.sin(i) * 4;
      await page.mouse.move(x, yy);
      await setTouch(x, yy, 0);
      await wait(12);
    }
  }
  await page.mouse.up();
  await press(false);
  cue('reveal');
  await moveTo(cb.x + cb.width + 70, cb.y + cb.height, 700);
}
async function closePopup() {
  await tap(mf.locator('#ga-celeb-close'), { after: 1300 });
}
const scratchTile = () => mf.locator('[data-action="scratch"]').first();

// ── Screencast capture ────────────────────────────────────────────────────
const cdp = await ctx.newCDPSession(page);
const frames = [];
const writes = [];
cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
  cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  const file = path.join(FRAMES, String(frames.length).padStart(6, '0') + '.jpg');
  frames.push({ file, t: metadata.timestamp });
  writes.push(fs.promises.writeFile(file, Buffer.from(data, 'base64')));
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: VW * DPR, maxHeight: VH * DPR, everyNthFrame: 1 });
t0 = Date.now() / 1000;

// ── Title ─────────────────────────────────────────────────────────────────
cue('title');
await wait(3600);
await page.evaluate(() => document.getElementById('rec-title').classList.add('off'));
cue('whoosh');
await wait(900);

// ── 1 · Cash commission ───────────────────────────────────────────────────
await useCase(1);
await lookup('08120000041');
await wait(700);
await scratch(scratchTile());
await wait(3200);
await closePopup();

// ── 2 · Android = double chance ───────────────────────────────────────────
await useCase(2);
await lookup('08120000042');
await wait(1200);
await scratch(scratchTile());
await wait(2600);
await closePopup();
await wait(600);

// ── 3 · Grand-prize draw ticket ───────────────────────────────────────────
await useCase(3);
await lookup('8000000007');
await scratch(scratchTile());
await wait(3800);
await closePopup();

// ── 4 · Prize history ─────────────────────────────────────────────────────
await useCase(4);
await lookup('08120000003');
await wait(2800);

// ── 5 · Order still being verified ────────────────────────────────────────
await useCase(5);
await lookup('08120000044');
await wait(3000);

// ── Outro ─────────────────────────────────────────────────────────────────
await card('rec-outro', `<div class="k">Try the live demo</div><h1>Gosok <span>Berhadiah</span></h1>
  <p>Scratch &amp; win campaign platform for 10,000 EDC merchants</p>
  <div class="stats"><div><b>Rp 200M</b>budget, enforced by code</div><div><b>14,000</b>scratch cards</div>
    <div><b>17</b>grand prizes</div><div><b>0</b>servers: Sheets + Apps Script</div></div>
  <div class="links">faqihbw.github.io/gosok-berhadiah/demo</div>`, 5200);
const tEnd = Date.now() / 1000;

await cdp.send('Page.stopScreencast');
await Promise.all(writes);
await browser.close();

// ── Assemble a constant-FPS video from the timestamped frames ─────────────
const start = Math.max(t0, frames[0].t);
const lines = [];
for (let i = 0; i < frames.length; i++) {
  const next = i + 1 < frames.length ? frames[i + 1].t : tEnd;
  if (next <= start) continue;
  lines.push(`file '${frames[i].file}'`, `duration ${(next - Math.max(frames[i].t, start)).toFixed(4)}`);
}
lines.push(`file '${frames.at(-1).file}'`);
const list = path.join(FRAMES, 'list.txt');
fs.writeFileSync(list, lines.join('\n'));
const shift = start - t0;
fs.writeFileSync(path.join(HERE, 'cues.json'), JSON.stringify({
  duration: +(tEnd - start).toFixed(3),
  cues: cues.map((c) => ({ ...c, t: +(c.t - shift).toFixed(3) })),
}, null, 1));

const run = (args) => new Promise((res, rej) => spawn(ffmpegBin, args, { stdio: 'inherit' })
  .on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));
await run(['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
  '-vf', `fps=${FPS},scale=1920:1080:flags=lanczos,format=yuv420p`,
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', SILENT]);
console.log(`Recorded ${frames.length} frames over ${(tEnd - start).toFixed(1)}s`);

// ── Soundtrack on the logged cues, then mux ───────────────────────────────
await new Promise((res, rej) => spawn('python3', [path.join(HERE, 'soundtrack.py'), path.join(HERE, 'cues.json'), AUDIO], { stdio: 'inherit' })
  .on('close', (c) => (c === 0 ? res() : rej(new Error('soundtrack.py exited ' + c)))));
await run(['-y', '-loglevel', 'error', '-i', SILENT, '-i', AUDIO, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
  '-shortest', '-movflags', '+faststart', OUT]);
fs.rmSync(FRAMES, { recursive: true, force: true });
fs.rmSync(SILENT, { force: true });
console.log(`Wrote ${OUT}`);
