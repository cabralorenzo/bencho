import { useEffect, useRef } from "react";

/* ══ Footer field ═════════════════════════════════════════
   The field of ink dots along the foot of bencho.dev: a wave
   of halftone dots, full at the bottom and thinning upward,
   that the pointer drags a wake of characters through, and a
   press sends a ring out across. The same field-then-ramp idea
   as the ASCII wake block, stretched to the width of the page.

   ── WHY IT IS TWO LAYERS ────────────────────────────────
   The field is as wide as the window, so on a 2560px screen it
   is some eight thousand cells. Drawn the plain way — every dot,
   every frame, a rounded hexagon each in one long path — a frame
   cost more than the screen gives it, and the whole page stuttered
   while the pointer was over the footer. Narrow the window and it
   went away, because the work shrank with the width.

   But a cold dot never changes: its size comes from the wave
   alone. So the cold field is drawn once, on a canvas of its own,
   when the size or the theme changes. A frame then only puts that
   layer back where the last frame wrote, and draws the warm cells
   as characters on top. The work follows the wake, not the width
   of the screen, and an idle footer costs nothing at all. */

/* lightest to densest; the first is always a blank */
const RAMP = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];
/* the face is the system's own monospace — nothing downloaded */
const MONO = `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace`;
/* below this much heat a cell is the field: a dot */
const COLD = 0.04;
/* thinner than this and the wave leaves the cell empty */
const BARE = 0.06;
/* how long a press's ring takes to spread and fade, s */
const RING_S = 2.2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* the wave: full at the foot, thinning upward along a slow swell,
   with a little grain so the edge is not a ruled line */
function wave(x: number, y: number, h: number) {
  const crest = h * (0.5 + 0.2 * Math.sin(x * 0.0058 + 0.4) + 0.12 * Math.sin(x * 0.0141 + 1.3) + 0.06 * Math.sin(x * 0.033 + 0.7));
  const v = clamp(0.5 + (y - crest) / (h * 0.5), 0, 1);
  return v ** 1.4 * (0.8 + 0.2 * Math.sin(x * 0.045 + y * 0.06));
}

/* the dot: a hexagon with its corners rounded off */
const HEX = Array.from({ length: 6 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 3;
  return [Math.cos(a) * 1.08, Math.sin(a) * 1.08];
});
const ROUND = 0.32;
function dot(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  for (let i = 0; i < 6; i++) {
    const [px, py] = HEX[(i + 5) % 6], [cx, cy] = HEX[i], [nx, ny] = HEX[(i + 1) % 6];
    const ax = x + (cx + (px - cx) * ROUND) * r, ay = y + (cy + (py - cy) * ROUND) * r;
    if (i === 0) g.moveTo(ax, ay); else g.lineTo(ax, ay);
    g.quadraticCurveTo(x + cx * r, y + cy * r, x + (cx + (nx - cx) * ROUND) * r, y + (cy + (ny - cy) * ROUND) * r);
  }
  g.closePath();
}

export function FooterField({
  /* how big a character is, px */
  size = 16,
  /* how far the wake reaches from the hand, px */
  reach = 44,
  /* seconds for the wake to cool */
  trail = 1.2,
}: {
  size?: number;
  reach?: number;
  trail?: number;
} = {}) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const knobs = useRef({ reach, trail });
  knobs.current = { reach, trail };

  useEffect(() => {
    const el = box.current;
    const c = cv.current;
    const g = c?.getContext("2d");
    if (!el || !c || !g) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cw = size * 0.62;
    const ch = size * 0.82;

    /* the cold field, drawn once per size and theme */
    const field = document.createElement("canvas");
    const fg = field.getContext("2d")!;
    let w = 0, h = 0, ratio = 1, cols = 0, rows = 0, ox = 0, oy = 0, ink = "";
    /* how full the wave is at each cell, and the wake on top of it */
    let mask = new Float32Array(0);
    let heat = new Float32Array(0);
    /* this frame's warm cells and the glyph each one shows */
    let warm = new Int32Array(0);
    let glyph = new Uint8Array(0);
    /* what the last frame drew over the field, css px: x0 y0 x1 y1 */
    let drawn: number[] | null = null;
    /* the hand: where it is, where it was last stamped, how present */
    let hx = -999, hy = -999, lx = NaN, ly = NaN, near = 0, inside = false;
    let rings: { x: number; y: number; t: number }[] = [];
    let deal = 0, tick = 0, raf = 0;

    /* the cold dots onto their own layer, and the picture reset to it */
    const layer = () => {
      ink = getComputedStyle(c).color;
      fg.setTransform(1, 0, 0, 1, 0, 0);
      fg.clearRect(0, 0, field.width, field.height);
      fg.setTransform(ratio, 0, 0, ratio, 0, 0);
      fg.fillStyle = ink;
      fg.beginPath();
      const r = Math.min(cw, ch) * 0.46;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const m = mask[j * cols + i];
          if (m < BARE) continue;
          dot(fg, ox + (i + 0.5 + (j & 1) * 0.5) * cw, oy + (j + 0.5) * ch, Math.max(0.6, r * Math.sqrt(m)));
        }
      }
      fg.fill();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, c.width, c.height);
      g.drawImage(field, 0, 0);
      drawn = null;
    };

    /* the grid for the box's size, cut to the wave */
    const build = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      ratio = Math.min(2, window.devicePixelRatio || 1);
      /* the strip left bare at the foot, for whatever sits over it */
      const bare = parseFloat(getComputedStyle(el).getPropertyValue("--clear")) || 0;
      c.width = field.width = Math.round(w * ratio);
      c.height = field.height = Math.round(h * ratio);
      cols = Math.ceil(w / cw) + 1;
      rows = Math.ceil(h / ch) + 1;
      /* the grid sits on the bottom edge, whatever is left over at the top */
      ox = -cw / 2;
      oy = h - rows * ch + ch / 2;
      mask = new Float32Array(cols * rows);
      heat = new Float32Array(cols * rows);
      warm = new Int32Array(cols * rows);
      glyph = new Uint8Array(cols * rows);
      /* a narrow page stretches the swell so it still reads as one */
      const stretch = Math.max(1, 1000 / Math.max(1, w));
      for (let j = 0; j < rows; j++) {
        const y = oy + (j + 0.5) * ch;
        for (let i = 0; i < cols; i++) {
          const x = ox + (i + 0.5 + (j & 1) * 0.5) * cw;
          mask[j * cols + i] = y > h - bare ? 0 : wave(x * stretch, y, h);
        }
      }
      layer();
    };

    const paint = () => {
      if (!cols) return;
      const top = RAMP.length - 1;
      const R2 = knobs.current.reach ** 2;
      const handy = near > 0.002;
      const swells = rings.map((r) => {
        const p = r.t / RING_S;
        const e = 1 - (1 - p) ** 3;
        return { x: r.x, y: r.y, R: 8 + e * 320, amp: 0.6 * (1 - p) * (1 - p) * Math.min(1, p * 6) };
      });
      /* find the warm cells; a cold one is already on the layer */
      let n = 0, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let j = 0; j < rows; j++) {
        const y = oy + (j + 0.5) * ch;
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const m = mask[k];
          if (m < BARE) continue;
          let f = heat[k];
          if (f === 0 && !handy && !swells.length) continue;
          const x = ox + (i + 0.5 + (j & 1) * 0.5) * cw;
          if (handy) {
            const q = ((x - hx) ** 2 + (y - hy) ** 2) / R2;
            if (q < 1) f = Math.max(f, 0.95 * near * (1 - q) * (1 - q));
          }
          for (const s of swells) {
            const dx = x - s.x, dy = y - s.y;
            /* a wide band, so the ring is a soft swell rather than a line */
            const d = (Math.sqrt(dx * dx + dy * dy) - s.R) / 24;
            if (d > -2.5 && d < 2.5) f += s.amp * Math.exp(-d * d);
          }
          f *= 0.55 + 0.45 * m;
          if (f <= COLD) continue;
          /* the warm part shimmers between neighbouring glyphs */
          const u = Math.min(1, f) * top + 0.5 + (hash(k, deal) - 0.5) * 1.6 * Math.min(1, f * 2);
          const v = clamp(Math.floor(u), 1, top);
          /* the lightest step is the dot itself, already drawn */
          if (v === 1) continue;
          warm[n] = k;
          glyph[n++] = v;
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
      /* a glyph never reaches further than a cell past its own */
      const now = n ? [x0 - cw, y0 - ch, x1 + cw, y1 + ch] : null;
      /* the field back wherever the last frame or this one writes */
      const dirty = drawn && now
        ? [Math.min(drawn[0], now[0]), Math.min(drawn[1], now[1]), Math.max(drawn[2], now[2]), Math.max(drawn[3], now[3])]
        : drawn ?? now;
      drawn = now;
      if (dirty) {
        const sx = clamp(Math.floor(dirty[0] * ratio), 0, c.width);
        const sy = clamp(Math.floor(dirty[1] * ratio), 0, c.height);
        const sw = clamp(Math.ceil(dirty[2] * ratio), 0, c.width) - sx;
        const sh = clamp(Math.ceil(dirty[3] * ratio), 0, c.height) - sy;
        if (sw > 0 && sh > 0) {
          g.setTransform(1, 0, 0, 1, 0, 0);
          g.clearRect(sx, sy, sw, sh);
          g.drawImage(field, sx, sy, sw, sh, sx, sy, sw, sh);
        }
      }
      if (!n) return;
      g.setTransform(ratio, 0, 0, ratio, 0, 0);
      /* a warm cell's dot comes out first; it fits inside its cell, so
         the neighbours keep theirs */
      for (let e = 0; e < n; e++) {
        const k = warm[e], j = (k / cols) | 0, i = k - j * cols;
        g.clearRect(ox + (i + (j & 1) * 0.5) * cw, oy + j * ch, cw, ch);
      }
      g.fillStyle = ink;
      g.font = `500 ${size}px ${MONO}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      for (let e = 0; e < n; e++) {
        const k = warm[e], j = (k / cols) | 0, i = k - j * cols;
        g.fillText(RAMP[glyph[e]], ox + (i + 0.5 + (j & 1) * 0.5) * cw, oy + (j + 0.5) * ch);
      }
    };

    /* the loop runs only while the wake is warm or the hand is moving */
    const run = () => {
      if (raf || calm) return;
      let prev = performance.now();
      const step = (t: number) => {
        const dt = clamp((t - prev) / 1000, 0, 0.05);
        prev = t;
        /* the same fraction off every cell, so a trail of T seconds
           is down to a twentieth after T */
        const keep = Math.exp((-dt * 3) / Math.max(0.1, knobs.current.trail));
        let hot = 0;
        for (let k = 0; k < heat.length; k++) {
          const v = heat[k] * keep;
          heat[k] = v < 0.003 ? 0 : v;
          if (v > hot) hot = v;
        }
        rings = rings.filter((r) => (r.t += dt) < RING_S);
        near += ((inside ? 1 : 0) - near) * (1 - 0.004 ** dt);
        tick += dt;
        if (tick > 0.07) { tick = 0; deal++; }
        paint();
        const done = hot === 0 && !rings.length && Math.abs((inside ? 1 : 0) - near) < 0.004;
        raf = done ? 0 : requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    /* heat dropped on the grid in a soft round at a point */
    const stamp = (x: number, y: number) => {
      const rad = knobs.current.reach, R2 = rad * rad;
      const c0 = Math.max(0, Math.floor((x - ox - rad) / cw)), c1 = Math.min(cols - 1, Math.ceil((x - ox + rad) / cw));
      const r0 = Math.max(0, Math.floor((y - oy - rad) / ch)), r1 = Math.min(rows - 1, Math.ceil((y - oy + rad) / ch));
      for (let j = r0; j <= r1; j++) {
        const dy = oy + (j + 0.5) * ch - y;
        for (let i = c0; i <= c1; i++) {
          const dx = ox + (i + 0.5) * cw - x;
          const q = (dx * dx + dy * dy) / R2;
          if (q >= 1) continue;
          const k = j * cols + i;
          heat[k] = Math.min(1, heat[k] + 0.5 * (1 - q) * (1 - q));
        }
      }
    };

    const where = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    /* the hand stamps along the whole line since its last event, a
       stamp every third of the reach, so a flick is one stroke */
    const move = (e: PointerEvent) => {
      const { x, y } = where(e);
      if (Number.isNaN(lx)) { lx = x; ly = y; }
      const steps = Math.max(1, Math.ceil(Math.hypot(x - lx, y - ly) / (knobs.current.reach / 3)));
      for (let s = 1; s <= steps; s++) stamp(lx + (x - lx) * (s / steps), ly + (y - ly) * (s / steps));
      lx = x; ly = y; hx = x; hy = y;
      inside = true;
      run();
    };
    const leave = () => { inside = false; lx = NaN; run(); };
    const press = (e: PointerEvent) => { rings.push({ ...where(e), t: 0 }); run(); };

    build();
    /* a resize rebuilds the grid; the first call, on observe, is the size we have */
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === w && el.clientHeight === h && Math.min(2, window.devicePixelRatio || 1) === ratio) return;
      build();
      paint();
    });
    ro.observe(el);
    /* a theme flip changes the ink, so the layer is drawn again */
    const repaint = () => { layer(); paint(); };
    const mo = new MutationObserver(repaint);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const scheme = matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", repaint);
    if (!calm) {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("pointerdown", press);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      scheme.removeEventListener("change", repaint);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", press);
    };
  }, [size]);

  return (
    <div className="ff" ref={box} aria-hidden="true">
      <canvas ref={cv} className="ff-canvas" />
    </div>
  );
}

/* a stable 0..1 per cell per deal, so the shimmer is noise that
   holds for a few frames rather than flicker every frame */
function hash(k: number, n: number) {
  let h = (k * 374761393 + n * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
