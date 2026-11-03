import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

/* ══ Slingshot ════════════════════════════════════════════
   An ink ball resting in an elastic socket in the middle of the
   card. Pull it back and let go: it flies on an arc, bounces off the
   card's own sides and top, settles on the floor and comes back to
   the band.

   ── THE BAND IS THE SOCKET, STRETCHED ───────────────────
   The ball sits in a socket, and pulling it out does not draw a
   string: the socket itself stretches into a capsule that hugs both
   circles — the hull of the two, their outer tangents joined by the
   arcs. The arrow in the ball turns to point where it will go. Let
   go and the band snaps back on a spring, past its rest and home.

   ── THE BAND IS A SPRING, THE FLIGHT IS GRAVITY ─────────
   How far the ball is pulled from its rest, capped on a rubber
   curve, sets the speed it leaves with, straight back the other way,
   and it grows faster than the pull: a full stretch throws hardest.
   From there it is gravity, the walls and the floor. */

/* the ball, its socket and the pull all about a fifth larger than
   they were (2026-10-25), so the slingshot reads at a size on the
   wall; the frame keeps its room to fly */
const W = 360;
const H = 260;
const R = 29;
/* the socket the ball sits in */
const SOCKET = 38;
const REST = { x: W / 2, y: H / 2 };
const PULL = 118;
/* the band gives freely up to this share of PULL, then stiffens */
const FREE = 0.6;
/* how many soft clicks the stretch makes over its whole reach */
const NOTCHES = 8;
/* the most the ball trembles at full strain, px */
const SHAKE = 0.7;

/* how far the ball goes for how far the hand goes, both over PULL:
   one for one at first, then a steep rubber curve that only creeps
   toward the end however far you drag */
const give = (u: number) => (u <= FREE ? u : FREE + (1 - FREE) * Math.tanh(((u - FREE) / (1 - FREE)) * 0.7));
/* the strain at the end of the band, 0 until nearly taut, 1 at it */
const strainOf = (m: number) => clamp((m - 0.9) / 0.08, 0, 1);
const K = 13;
const G = 700;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ── dust ──────────────────────────────────────────────────
   A burst of SPARKS off the sling as the ball leaves it, and only
   then — none on the bounces (taken off 2026-10-26). Each is a short
   streak along its own flight, longer the faster it goes, so the
   burst reads as thrown rather than dropped. They fan about 100
   degrees and stop short: the first try, 160 degrees and fast, flew
   too wide and too far. Each slows, sinks a little and fades in half a
   second. In the block's own ink, so it stays monochrome and
   inverts with the fill. A fixed pool of circles, drawn into from
   the same loop as the ball — no element is made or thrown away
   while it flies. Off under reduced motion. */
const POOL = 36;
type Speck = { x: number; y: number; vx: number; vy: number; t: number; life: number; r: number };

export function Slingshot({
  /* how hard the band throws, % */
  power = 100,
  /* how lively a bounce off the walls is, 0..100 */
  bounce = 30,
}: {
  power?: number;
  bounce?: number;
} = {}) {
  const box = useRef<HTMLDivElement | null>(null);
  const ball = useRef<HTMLSpanElement | null>(null);
  const band = useRef<SVGPathElement | null>(null);
  const arrow = useRef<SVGSVGElement | null>(null);
  const dust = useRef<SVGGElement | null>(null);
  const knobs = useRef({ power, bounce });
  knobs.current = { power, bounce };

  const S = useRef({
    x: REST.x, y: REST.y, vx: 0, vy: 0,
    phase: "rest" as "rest" | "held" | "fly" | "gone",
    /* the band's free end: on the ball while held, then sprung home */
    bx: REST.x, by: REST.y, bvx: 0, bvy: 0,
    still: 0, raf: 0, last: 0, appear: 1, jx: 0, jy: 0,
    /* the side walls and the ceiling: the card's own edges, in the
       block's units — the floor stays the block's own */
    wl: 0, wr: W, wt: 0,
    grip: null as null | { id: number; real: boolean; dx: number; dy: number },
    /* the last click the stretch made, and whether the band is taut */
    notch: 0, taut: false, strain: 0,
    specks: [] as Speck[],
    /* how hard the last throw was pulled, 0..1, and whether the
       ball has left the sling yet — the burst waits for that */
    pull: 0, fired: true,
  });
  const unhook = useRef(() => {});
  /* reduced motion: the band still stiffens and clicks, it does not shake */
  const still = useRef(false);

  /* the speed a pull would give, from where the ball is held */
  /* the further the band is stretched, the more each pixel of it is
     worth: a short tug is a lob, a full stretch nearly twice the old
     top speed (0.7 + 1.1·u², so 0.8x at a third, 1.1x at 60%, 1.8x
     taut) */
  const launch = (x: number, y: number) => {
    const u = clamp(Math.hypot(REST.x - x, REST.y - y) / PULL, 0, 1);
    const k = K * (knobs.current.power / 100) * (0.7 + 1.1 * u * u);
    return { vx: (REST.x - x) * k, vy: (REST.y - y) * k };
  };

  /* n specks from (x, y), aimed along (dx, dy) and fanned by `spread`
     radians, at about `speed` px/s */
  const puff = (x: number, y: number, dx: number, dy: number, n: number, speed: number, spread: number) => {
    if (still.current) return;
    const s = S.current;
    const aim = Math.atan2(dy, dx);
    for (let i = 0; i < n; i++) {
      const a = aim + (Math.random() - 0.5) * spread;
      const v = speed * (0.45 + Math.random() * 0.9);
      s.specks.push({
        x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        t: 0, life: 0.35 + Math.random() * 0.35, r: 1.1 + Math.random() * 0.9,
      });
    }
    if (s.specks.length > POOL) s.specks.splice(0, s.specks.length - POOL);
  };

  const paint = () => {
    const s = S.current;
    const b = ball.current;
    if (b) {
      const sp = Math.hypot(s.vx, s.vy);
      const st = s.phase === "fly" ? clamp(sp / 2400, 0, 0.22) : 0;
      const ang = Math.atan2(s.vy, s.vx);
      /* held at the limit, the ball trembles in the hand: two sines
         that never line up, scaled by how hard the band is strained */
      const j = s.phase === "held" && !still.current ? s.strain * SHAKE : 0;
      const t = performance.now() / 1000;
      s.jx = j * Math.sin(t * 60); s.jy = j * Math.cos(t * 49);
      b.style.transform =
        `translate(${(s.x + s.jx - R).toFixed(2)}px, ${(s.y + s.jy - R).toFixed(2)}px) rotate(${ang}rad) scale(${(1 + st) * s.appear}, ${(1 - st * 0.7) * s.appear}) rotate(${-ang}rad)`;
      b.style.opacity = s.phase === "gone" ? "0" : "1";
    }
    /* the arrow: where a pull would send it, or the way it is flying */
    const a = arrow.current;
    if (a) {
      const dir = s.phase === "fly"
        ? Math.atan2(s.vy, s.vx)
        : s.phase === "held" && Math.hypot(REST.x - s.x, REST.y - s.y) > 4
          ? Math.atan2(REST.y - s.y, REST.x - s.x)
          : -Math.PI / 4;
      a.style.transform = `rotate(${dir + Math.PI / 2}rad)`;
    }
    /* the dust: the pool's circles, the live specks first */
    const g = dust.current;
    if (g) {
      const cs = g.children;
      for (let i = 0; i < cs.length; i++) {
        const c = cs[i] as SVGLineElement;
        const p = s.specks[i];
        if (!p) { c.setAttribute("opacity", "0"); continue; }
        const k = p.t / p.life;
        /* the streak trails behind the spark, its length its speed */
        const v = Math.hypot(p.vx, p.vy) || 1;
        const len = clamp(v * 0.028, 1.5, 12);
        c.setAttribute("x1", p.x.toFixed(1));
        c.setAttribute("y1", p.y.toFixed(1));
        c.setAttribute("x2", (p.x - (p.vx / v) * len).toFixed(1));
        c.setAttribute("y2", (p.y - (p.vy / v) * len).toFixed(1));
        c.setAttribute("stroke-width", p.r.toFixed(2));
        c.setAttribute("opacity", (0.6 * (1 - k) ** 1.4).toFixed(3));
      }
    }
    /* the band: the socket's hull, stretched to its free end */
    const l = band.current;
    if (l) l.setAttribute("d", hull(REST.x, REST.y, SOCKET, s.bx + (s.phase === "held" ? s.jx : 0), s.by + (s.phase === "held" ? s.jy : 0), R + 6));
  };

  /* two circles and the outer tangents between them: a capsule that
     hugs both, or the bigger circle alone when one holds the other */
  const hull = (ax: number, ay: number, ra: number, bx: number, by: number, rb: number) => {
    const d = Math.hypot(bx - ax, by - ay);
    const circle = `M${ax - ra},${ay}a${ra},${ra} 0 1,0 ${ra * 2},0a${ra},${ra} 0 1,0 ${-ra * 2},0Z`;
    if (d <= Math.abs(ra - rb) + 0.5) return circle;
    const th = Math.atan2(by - ay, bx - ax);
    const ph = Math.acos(clamp((ra - rb) / d, -1, 1));
    const P = (cx: number, cy: number, r: number, t: number) => `${(cx + r * Math.cos(t)).toFixed(2)},${(cy + r * Math.sin(t)).toFixed(2)}`;
    return `M${P(ax, ay, ra, th + ph)}L${P(bx, by, rb, th + ph)}`
      + `A${rb},${rb} 0 0,0 ${P(bx, by, rb, th - ph)}`
      + `L${P(ax, ay, ra, th - ph)}`
      + `A${ra},${ra} 0 1,0 ${P(ax, ay, ra, th + ph)}Z`;
  };

  const respawn = () => {
    const s = S.current;
    s.phase = "rest"; s.x = REST.x; s.y = REST.y; s.vx = s.vy = 0; s.appear = 0;
    wake();
  };

  const step = (dt: number) => {
    const s = S.current;
    if (s.appear < 1) s.appear = Math.min(1, s.appear + dt * 5);
    /* the band's end: on the ball in the hand, sprung home otherwise */
    let banding = false;
    if (s.phase === "held") { s.bx = s.x; s.by = s.y; s.bvx = s.bvy = 0; }
    else {
      const k = 900, c = 2 * Math.sqrt(k) * 0.32;
      s.bvx += (-k * (s.bx - REST.x) - c * s.bvx) * dt;
      s.bvy += (-k * (s.by - REST.y) - c * s.bvy) * dt;
      s.bx += s.bvx * dt; s.by += s.bvy * dt;
      banding = Math.abs(s.bx - REST.x) + Math.abs(s.by - REST.y) + Math.abs(s.bvx) * 0.01 + Math.abs(s.bvy) * 0.01 > 0.05;
      if (!banding) { s.bx = REST.x; s.by = REST.y; s.bvx = s.bvy = 0; }
    }
    /* specks drift on, slowing, sinking a touch, until they fade */
    if (s.specks.length) {
      const drag = Math.exp(-4 * dt);
      for (const p of s.specks) {
        p.t += dt;
        p.vx *= drag;
        p.vy = p.vy * drag + 60 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      s.specks = s.specks.filter((p) => p.t < p.life);
    }
    const dusty = s.specks.length > 0;
    if (s.phase !== "fly") return s.appear < 1 || banding || dusty;
    /* the moment the ball crosses the sling's middle on its way out:
       the burst comes off the SLING, at the rim the ball leaves
       through, fanned along the throw — not off the ball where it
       was held. More, and faster, for a harder pull */
    if (!s.fired && (s.x - REST.x) * s.vx + (s.y - REST.y) * s.vy >= 0) {
      s.fired = true;
      const sp = Math.hypot(s.vx, s.vy) || 1;
      const ux = s.vx / sp, uy = s.vy / sp;
      puff(REST.x + ux * SOCKET, REST.y + uy * SOCKET, ux, uy, Math.round(12 + s.pull * 10), 150 + s.pull * 170, 1.7);
    }
    const e = 0.2 + (knobs.current.bounce / 100) * 0.6;
    s.vy += G * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    /* a fast ball is drawn stretched along its flight: meet the card's
       edge with the tip of the stretch, not its middle, or the edge
       clips it */
    const m = R * (1 + clamp(Math.hypot(s.vx, s.vy) / 2400, 0, 0.22));
    if (s.x < s.wl + m) { s.x = s.wl + m; s.vx = Math.abs(s.vx) * e; }
    if (s.x > s.wr - m) { s.x = s.wr - m; s.vx = -Math.abs(s.vx) * e; }
    if (s.y < s.wt + m) { s.y = s.wt + m; s.vy = Math.abs(s.vy) * e; }
    if (s.y > H - R) {
      s.y = H - R; s.vy = -Math.abs(s.vy) * e; s.vx *= 0.8;
      if (Math.abs(s.vy) < 40) s.vy = 0;
    }
    /* at rest on the floor for a moment: back to the band */
    if (s.y >= H - R - 0.5 && Math.abs(s.vx) < 12 && Math.abs(s.vy) < 1) {
      s.still += dt;
      if (s.still > 0.5) { s.still = 0; s.phase = "gone"; window.setTimeout(respawn, 200); }
    } else s.still = 0;
    return true;
  };

  const wake = () => {
    const s = S.current;
    if (s.raf) return;
    s.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - s.last) / 1000);
      s.last = now;
      let busy = false;
      for (let i = 0; i < 3; i++) busy = step(dt / 3) || busy;
      paint();
      if (!busy && s.phase !== "held") { s.raf = 0; return; }
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  };

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paint();
    const s = S.current;
    return () => { cancelAnimationFrame(s.raf); s.raf = 0; unhook.current(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* the walls are the card the block sits on (the wall card's stage,
     or the overlay's), measured at each throw: the ball bounces off
     the edges you can see rather than the block's own box. Never
     inside the block, so a small stage cannot pinch the rest */
  const walls = () => {
    const s = S.current;
    const b = box.current;
    const st = b?.closest(".bench-card-stage, .dtl-stage") as HTMLElement | null;
    if (!b || !st) { s.wl = 0; s.wr = W; s.wt = 0; return; }
    const o = b.getBoundingClientRect(), r = st.getBoundingClientRect();
    const k = o.width / W || 1;
    s.wl = Math.min(0, (r.left - o.left) / k);
    s.wr = Math.max(W, (r.right - o.left) / k);
    s.wt = Math.min(0, (r.top - o.top) / k);
  };

  const local = (e: { clientX: number; clientY: number }) => {
    const o = box.current!.getBoundingClientRect();
    const k = o.width / W || 1;
    return { x: (e.clientX - o.left) / k, y: (e.clientY - o.top) / k };
  };

  const down = (e: React.PointerEvent) => {
    const s = S.current;
    if (s.grip && e.nativeEvent.isTrusted && !s.grip.real) { s.grip = null; unhook.current(); }
    if (s.grip || e.button !== 0 || s.phase !== "rest") return;
    const p = local(e);
    if (Math.hypot(p.x - s.x, p.y - s.y) > R + 14) return;
    e.preventDefault();
    s.grip = { id: e.pointerId, real: e.nativeEvent.isTrusted, dx: s.x - p.x, dy: s.y - p.y };
    s.phase = "held";
    const mv = (ev: PointerEvent) => {
      const g = s.grip;
      if (!g || ev.pointerId !== g.id || ev.isTrusted !== g.real) return;
      const q = local(ev);
      let dx = q.x + g.dx - REST.x, dy = q.y + g.dy - REST.y;
      const d = Math.hypot(dx, dy);
      /* the band gives freely, then stiffens hard near its end */
      const m = give(d / PULL);
      if (d > 0) { dx *= (m * PULL) / d; dy *= (m * PULL) / d; }
      s.x = REST.x + dx; s.y = REST.y + dy;
      s.strain = strainOf(m);
      /* the stretch is heard: a soft click every notch, higher the
         further it goes, and a firmer knock as it goes taut */
      const n = Math.floor(m * NOTCHES);
      if (n !== s.notch) { s.notch = n; }
      const taut = s.strain > 0.5;
      s.taut = taut;
      wake();
    };
    const up = (ev: PointerEvent) => {
      const g = s.grip;
      if (!g || ev.pointerId !== g.id || ev.isTrusted !== g.real) return;
      s.grip = null;
      unhook.current();
      s.notch = 0; s.taut = false; s.strain = 0;
      const pulled = Math.hypot(REST.x - s.x, REST.y - s.y);
      if (pulled < 8) { s.phase = "rest"; s.x = REST.x; s.y = REST.y; wake(); return; }
      const v = launch(s.x, s.y);
      s.vx = v.vx; s.vy = v.vy;
      walls();
      s.phase = "fly";
      /* the burst waits until the ball clears the sling — see step() */
      s.pull = clamp(pulled / PULL, 0, 1);
      s.fired = false;
      wake();
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    unhook.current = () => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      unhook.current = () => {};
    };
    wake();
  };

  return (
    <div ref={box} className="sls" style={{ width: W, height: H }} onPointerDown={down}>
      <svg className="sls-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <path ref={band} className="sls-band" />
        <g ref={dust} className="sls-dust">
          {Array.from({ length: POOL }, (_, i) => <line key={i} opacity="0" />)}
        </g>
      </svg>
      <span ref={ball} className="sls-ball" style={{ width: R * 2, height: R * 2 }} aria-hidden="true">
        <ArrowUp ref={arrow} className="sls-arrow" size={28} strokeWidth={2} />
      </span>
    </div>
  );
}
