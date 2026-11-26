import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ══ Magnetic select ═══════════════════════════════════════
   A cluster of options set close enough together to be in
   each other's way, and a selection that behaves like a
   magnet rather than a highlight: the one you press swells
   and takes the ink, and the rest are shoved radially out of
   its way — hardest next to it, barely at all at the edges.

   THE POINT IS THE FIELD, NOT THE ITEM. A normal segmented
   control moves an indicator and leaves the layout alone,
   which is why selecting in one feels like bookkeeping. Here
   the choice deforms its neighbourhood, so the answer to
   "which one is selected" is legible from three feet away
   with the shapes unreadable — it is the one everything else
   is leaning away from.

   ── AND IT IS A GROUP, NOT A ROW ─────────────────────────
   It was a row first, and a row wastes the idea. In a line
   there are two directions to be pushed and both of them are
   the same direction, so the field can only ever read as
   spacing; the falloff has to be inferred from how far along
   the row you are. In a cluster the shove is a VECTOR — each
   chip goes the way it actually lies from the magnet — and
   the same arithmetic suddenly reads as a field, because you
   can see it acting on every bearing at once.

   Every number still falls out of ONE decision: how far the
   selected chip grows. The room it needs is arithmetic from
   that, the shove is that room plus an aura, the aura decays
   with real distance, and the tilt is the aura's leftovers. */

/* ── inlined from lab/spring ──────────────────────── */
/* ── one spring, for everything that settles ───────────────
   The maths was already on this bench twice, copied by hand:
   Humidity's wheel and Brightness's column both accumulate
   velocity toward a target, damp it, and snap when both the
   delta and the velocity fall under 0.02. Two copies is a
   coincidence; five would be a policy, so it comes out here
   before the elastic blocks are written against it.

   The two shipped copies are deliberately NOT refactored onto
   this. They work, they are tuned, and rewriting the innards
   of two live components to prove a point about duplication
   is how a good afternoon becomes a bad one. This is the one
   new code uses.

   Frames, not milliseconds. `dt` is expressed in sixtieths of
   a second and the damping is RAISED to it rather than
   multiplied by it, so a dropped frame decays the same amount
   of energy as the two frames it replaced. Multiplying is the
   version that makes a spring behave differently on a busy
   page, which is the hardest kind of bug to see.

   The loop parks itself the moment the value has settled.
   CLAUDE.md is not complimentary about the one permanent
   requestAnimationFrame already on this bench and there is no
   case for five more. */

/* Read once, the way the wheel and the pill nav do. A
   preference, not a live input. */
const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ── inlined from site/orb ──────────────────────── */
/* ══ the orb ═══════════════════════════════════════════════
   A voice, drawn. Lifted out of Sounds.tsx when the overlay
   arrived and needed the same disc at three times the size —
   one file, because the alternative is two hue tables that
   agree until somebody retunes a note.

   Everything here is derived from VOICES. Nothing about a
   sound is written down twice. */

/* ── the soft radial orbs (2026-11-24) ────────────────────────
   Eight blends from a reference Lorenzo sent: a warm or bright middle
   melting out to a contrasting rim, each sized to the circle
   (closest-side) so the rim colour lands on the orb's edge. Tried first
   on the free sounds, now on every sound in the library: each voice
   takes one, in turn. The bento's sounds row reads the same list. The
   film (src/film) still draws the old drifting meshes. */
/* all one recipe (2026-11-24), the pink-to-orange one Lorenzo picked:
   a saturated middle opening out through a neighbouring hue to a light
   rim, four stops at 0 / 34 / 68 / 100. Pink to orange, violet to pink,
   blue to cyan, teal to lime, indigo to rose, coral to peach, purple to
   sky, rose to lilac, emerald to aqua, sky to mint, fuchsia to orange,
   flame to blush, cobalt to lavender, plum to pink,
   ocean to teal, magenta to peach, royal to sky, green to seafoam,
   orchid to periwinkle. No yellows, no crimson red (2026-11-24) */
const RADIAL: readonly string[] = [
  "radial-gradient(circle closest-side, #f03c97 0%, #f4518f 34%, #f97c7c 68%, #fdb06b 100%)",
  "radial-gradient(circle closest-side, #8b3cf0 0%, #a24fe6 34%, #d071c8 68%, #f6a0b8 100%)",
  "radial-gradient(circle closest-side, #3c5df0 0%, #4f7cf0 34%, #5fb0f2 68%, #7fe0f0 100%)",
  "radial-gradient(circle closest-side, #12b5a0 0%, #2fc39a 34%, #7bd88a 68%, #c8ec7a 100%)",
  "radial-gradient(circle closest-side, #4a3cf0 0%, #6a4fe8 34%, #a874d8 68%, #f0a2c8 100%)",
  "radial-gradient(circle closest-side, #ff4f6e 0%, #ff6a78 34%, #ff9a8a 68%, #ffcf9e 100%)",
  "radial-gradient(circle closest-side, #b03cf0 0%, #9c55ee 34%, #7d86f0 68%, #6fb6f6 100%)",
  "radial-gradient(circle closest-side, #e8417a 0%, #ec5c94 34%, #e690c9 68%, #d9b8f2 100%)",
  "radial-gradient(circle closest-side, #10b981 0%, #26c39a 34%, #5fd6c6 68%, #9eeaf0 100%)",
  "radial-gradient(circle closest-side, #2f9bf0 0%, #4cb0ee 34%, #7fd0d8 68%, #b4f0c8 100%)",
  "radial-gradient(circle closest-side, #d63cf0 0%, #e351c8 34%, #f07f96 68%, #fbb46e 100%)",
  "radial-gradient(circle closest-side, #f05a1c 0%, #f47045 34%, #f7948a 68%, #f9c2c8 100%)",
  "radial-gradient(circle closest-side, #2443d6 0%, #4d5de2 34%, #8b8ae8 68%, #c9b8f4 100%)",
  "radial-gradient(circle closest-side, #7e22ce 0%, #9a3ad6 34%, #c66bd6 68%, #eba6d8 100%)",
  "radial-gradient(circle closest-side, #0e7490 0%, #1d8fa8 34%, #4fbcc0 68%, #9ee6d8 100%)",
  "radial-gradient(circle closest-side, #db2777 0%, #e64a86 34%, #f08b96 68%, #f9c4b0 100%)",
  "radial-gradient(circle closest-side, #1d4ed8 0%, #3466e8 34%, #5f9cf0 68%, #a6d6f8 100%)",
  "radial-gradient(circle closest-side, #16a34a 0%, #34b862 34%, #74d39a 68%, #b6edcf 100%)",
  "radial-gradient(circle closest-side, #c026d3 0%, #b44bdc 34%, #9b84ea 68%, #b9c4f6 100%)",
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* ── the options ───────────────────────────────────────────
   Pictures, and deliberately not icons. They were nine lucide
   shapes — a circle, a square, a triangle — chosen because a
   set of tools or weather states invites you to read the row
   instead of watching it, and this block has exactly one thing
   to show.

   Colour fields do that job better than outlines did. A shape
   at 19px is a thin mark in the middle of a 44px disc and most
   of the chip is empty; a picture IS the chip, so the cluster
   reads as seven objects rather than as seven containers with
   marks in them — and the field pushing them about has
   something to push.

   Inlined by scripts/marks.sh for the reason every picture on
   this bench is: the artifact bundle is one file and a linked
   image is a dead square the moment it leaves this machine.
   The FILE ORDER is the cluster order, so renaming them
   rearranges the component and nothing else has to know. */
/* each chip's face is one of the Sounds wall's soft radial orbs
   (2026-11-25), in place of the photographic marks: seven looks picked
   to sit apart, so neighbours never share a hue */
const ORBS = [10, 2, 3, 1, 5, 8, 12].map((k) => RADIAL[k]);
const NAMES = ORBS.map((_, i) => `Option ${i + 1}`);

const CHIP = 44;
const H_PAD = 26;

/* ── the packing ───────────────────────────────────────────
   A hex lattice at a pitch of 48 against a 44 chip, so every
   neighbour sits 4px off touching and the cluster is as tight
   as it can be without the field having nowhere to push.

   THE REGULARITY IS THE POINT, and it is a reversal. These
   were hand-jittered before, on the reasoning that a lattice
   reads as a grid — true when the arrangement is the thing you
   are looking at, and wrong here, because the arrangement is
   the thing being DEFORMED. A field distorting an irregular
   scatter is hard to read as anything but a different
   scatter; the same field opening a hole in a honeycomb is
   unmistakable. You need the regular ground to see the
   disturbance against.

   ── AND THERE ARE TWO OF THEM, not a slider from four to
   nine. Every count between them was a worse version of one of
   these: five and six are a flower with a bite out of it,
   eight and nine are a flower with something stuck to the
   side. Three is a triangle and seven is the closed hexagon —
   the only two arrangements at this pitch where every chip has
   the same relationship to its neighbours, and the only two
   worth offering. A slider across six stops invited a drag to
   find the good one; there are two, so they are named.

   Points are taken from the lattice in rings outward, so each
   is the roundest blob available at that size, and the first
   is the centre — pressing a chip with neighbours on
   every side is the single best frame this component has, and
   the one the card should be caught in. Six is the default
   because it is a centre with a ring that is one short of
   closing: the notch keeps it from reading as a logo. */
const CLUSTER: Record<number, [number, number][]> = {
  3: [[0, -26], [22.5, 13], [-22.5, 13]],
  7: [[0, 0], [45, 0], [22.5, -39], [-22.5, -39], [-45, 0], [-22.5, 39], [22.5, 39]],
};

/* the spacing the falloff is measured in. Distances divided by
   this — the lattice pitch, so a chip one step away sits at
   far = 1 and
   the exponent below is reading a neighbourhood rather than a
   pixel count that would mean something different at every
   count. */
const PITCH = 45;

/* the two answers, and what the knob calls them */
const SIZES: Record<string, number> = { Small: 3, Large: 7 };

/* ── how fast the aura falls off, in those steps ───────────
   1.4 for as long as the chips were far enough apart not to
   care, and the tight packing is what set the real number.

   THE TIGHTEST PAIR IS NEVER BESIDE THE MAGNET. It is two
   chips on the same ray out of it — the near one shoved
   harder than the one behind it, so the pair closes by the
   difference between their pushes, and with 4px of slack
   there is nothing to absorb that. Measured at full Pull with
   1.4: every other pair in the cluster sat above 11px and
   that one was at 0.8, which is not overlapping and is well
   inside the margin where rounding could make it so.

   1.8 fixed it at a pitch of 48. At 46 — chips two pixels off
   touching — the same pair came back to exactly zero, because
   there is now almost no rest gap for the closing to eat.
   2.8 with a deeper cower is the answer: the field reaches a
   little further, which if anything reads as more of a field,
   and the chip the magnet is nearest gives up more of its own
   size. Both leave the PACKING alone, which is the point —
   the tightness is the resting picture and the clearance has
   to come from somewhere else. At a pitch of 45 the same pair
   came to 0.57px; these two take it to about two. */
const SPREAD = 2.8;

export function MagneticSelect({
  /* how many options, 4 to 9 */
  /* "small" is three, "large" is seven — see SIZES */
  size = "Large",
  /* the strength of the whole field, 0-100 */
  pull = 55,
  /* how much it overshoots on the way to rest */
  bounce = 55,
  /* how far a chip leans toward the cursor near it, 0-100 */
  give = 50,
}: {
  size?: string;
  pull?: number;
  bounce?: number;
  give?: number;
} = {}) {
  const n = Math.min(SIZES[size] ?? 7, ORBS.length);
  const p = clamp(pull, 0, 100) / 100;
  const pts = CLUSTER[n];

  /* ── it lands SELECTED, on the one in the middle ─────────
     A magnetic select drawn with nothing chosen is a cluster
     of chips: true of the component and a picture of the one
     state where it has nothing to say. */
  /* ── IT OPENS ON THE MIDDLE ONE ─────────────────────────
     Index 0 is the centre of the cluster by construction — the
     lattice points are taken in rings outward, so the first is
     always the hub. On Small there is no hub and it is simply
     the first of the three.

     The centre is also the only selection whose field is even:
     every other chip is the same distance from it, so they all
     move by the same amount and the spacing stays uniform all
     round. That makes it the honest still image of what this
     block does — and the one frame the card on the wall is
     caught in.

     null is still the type, because "nothing chosen" is a
     state this can reach and an index that happens to be
     invalid is not the same thing. */
  const [sel, setSel] = useState<number | null>(0);
  const at = sel === null || sel >= n ? null : sel;

  /* ── ONE decision, and the rest is arithmetic ────────────
     GROW is the knob. ROOM is the space the swell physically
     takes on every side — half the extra width, exactly — so
     the neighbours are never merely *near* clear of it. AURA
     is the part that is not arithmetic: the push beyond what
     the geometry demands, which is the difference between a
     cluster making room and a cluster being repelled. */
  const grow = 1.16 + 0.22 * p;
  const room = (CHIP * (grow - 1)) / 2;
  const aura = 3 + 9 * p;
  const tilt = 5 * p;
  /* the neighbours give up a little size as well as ground —
     the magnet takes the mass as well as the space, and the
     size it gives up is also the clearance that keeps the
     tightest pair from touching */
  const cower = 0.04 + 0.09 * p;

  /* ── AND EACH ONE LEANS TOWARD THE CURSOR ───────────────
     The field is what a chip does about the SELECTION. This is
     what it does about your hand: come within reach of one and
     it tips a few pixels your way, and lets go as you leave.

     A few pixels is the whole specification. Past about seven
     a chip stops acknowledging you and starts being something
     you are dragging, which is a different component. Same
     ceiling and the same curve the search field uses, because
     it is the same gesture and they should feel identical.

     AND IT IS THE GROUP THAT LEANS, not the chip. Tipping one
     disc on its own opens a gap on the side it came from and
     closes one on the side it went to — so a cluster packed a
     pixel off touching came apart wherever your cursor was.
     The spacing here is the whole picture; it has to survive
     being touched. Every chip moves by one shared vector: the
     group tips toward you as one body and the gaps are exactly
     what they were.

     ── AND THE VECTOR IS MEASURED FROM ONE POINT ───────────
     It was measured from whichever chip the cursor was nearest,
     which gave a group with seven possible origins. Crossing
     from one chip's territory to the next swapped the origin
     and the direction snapped with it, so moving over the
     cluster made it jerk about — worst in the middle, where
     the nearest chip changes every few pixels.

     One origin, the cluster's own centre, and the whole thing
     goes away: there is nothing to hand over to. It also means
     nothing here knows where the individual chips ARE, which
     is the honest shape for a behaviour that belongs to the
     group — the spaces between them stop being a thing the
     lean can notice.

     The magnitude RAMPS UP from the centre rather than peaking
     there, which is the other half of the same problem. Toward
     a point, the direction is whatever it is; AT the point it
     is nothing at all — so a lean that is strongest where its
     own direction is undefined spins on the spot. Zero at the
     centre, full at the cluster's edge, easing out past it.

     Measured from the chips' own resting geometry rather than
     from their rects. Reading a position off a thing this
     displaces is a feedback loop — it settles, but it settles
     by ringing, and on a 44px disc the ring is visible. The
     numbers below are the layout, which never moves. */
  /* how far past the cluster's own edge the lean survives */
  const FADE = 44;
  const wrap = useRef<HTMLDivElement | null>(null);
  /* the centre it leans about, and how far its edge is */
  const hub = useRef({ x: 0, y: 0, r: 1 });
  const [lean, setLean] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const still = stillness();

    /* the box is the cluster's own bounds plus room for the
     field to spend itself in. Derived, so moving a point in
     the table above cannot push a chip off the block. */
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const W = Math.max(...xs) - minX + CHIP + H_PAD * 2;
  const H = Math.max(...ys) - minY + CHIP + H_PAD * 2;

  /* ── the springs ─────────────────────────────────────────
     Bounce is a DAMPING RATIO, not a damping value: tie it to
     a raw number and the same setting is bouncy on one chip
     and dead on another, because each chip here springs at a
     different stiffness. As a ratio it means the same thing
     everywhere — 0.9 arrives and stops, 0.42 arrives and
     rings — and stiffness is then free to vary. */
  const zeta = 0.9 - 0.48 * (clamp(bounce, 0, 100) / 100);
  const swing = (k: number, mass: number) => ({
    type: "spring" as const,
    stiffness: k,
    damping: 2 * Math.sqrt(k * mass) * zeta,
    mass,
  });

  /* ── the field, worked out once ──────────────────────────
     The chips need it to know where to go and the lean needs
     it to know where they went. Computed here rather than
     inside the map, because a copy of this arithmetic in two
     places is two things to keep in agreement. */
  const field = pts.map(([px, py], i) => {
    /* with no magnet there is no field: every chip sits on its
       own lattice point and the pushes are all zero */
    if (at === null) {
      return { far: 0, fall: 0, push: 0, ux: 0, uy: 0,
        cx: px - minX + H_PAD + CHIP / 2,
        cy: py - minY + H_PAD + CHIP / 2 };
    }
    const [ax, ay] = pts[at];
    const dx = px - ax;
    const dy = py - ay;
    const gap = Math.hypot(dx, dy);
    const far = gap / PITCH;
    /* the aura, spent. exp() rather than 1/d because an
       inverse law is violent at the first neighbour and flat
       everywhere after, so the cluster reads as one chip
       barged aside and four standing still. */
    const fall = i === at ? 0 : Math.exp(-(far - 1) / SPREAD);
    /* ── THE PUSH DOES NOT DECAY, and that is the fix ──────
       It was `room + aura * fall`, so a chip near the magnet
       moved further than the one behind it — and two chips on
       the same ray out of the magnet therefore CLOSED by the
       difference, while every other pair opened. That was the
       one pair in the cluster tighter than the rest, and it
       was the only pair anywhere that got tighter at all.

       Constant, it cannot happen: two chips on the same
       bearing move by the same amount and their spacing is
       exactly what it was. Nothing in the cluster ever
       compresses now; gaps only open.

       `fall` is still computed and still used — it drives the
       stagger and the tilt below, which is where a sense of
       the field reaching further at the front belongs. It was
       doing two jobs and only one of them was safe. */
    const push = i === at ? 0 : room + aura;
    /* ── AND THE DIRECTION IS THE BEARING ──────────────────
       Straight out along the line from the magnet, which is
       the whole reason for abandoning the row: in a line this
       reduces to a sign, and every chip is pushed along the
       same axis whatever its actual relationship to the one
       you pressed. */
    const ux = gap ? dx / gap : 0;
    const uy = gap ? dy / gap : 0;
    return { far, fall, push, ux, uy,
      /* where the chip comes to rest, in the block's own px */
      cx: px - minX + H_PAD + CHIP / 2 + ux * push,
      cy: py - minY + H_PAD + CHIP / 2 + uy * push };
  });
  /* the cluster's middle, and the distance to the furthest
     chip's outer edge — the radius the ramp is measured in */
  hub.current = {
    x: W / 2,
    y: H / 2,
    r: Math.max(1, ...field.map((f) =>
      Math.hypot(f.cx - W / 2, f.cy - H / 2) + CHIP / 2)),
  };

  /* ── the lean, read off the pointer ─────────────────────
     One listener for the whole cluster and one rect per move,
     because the chips' positions come from `spots` rather than
     from the DOM. Throttled to a frame: a pointermove can
     arrive several times between paints and only the last one
     is worth anything.

     The block is drawn at a fraction on the wall and at a zoom
     on the canvas, so client pixels are divided back into the
     component's own before any distance is compared to REACH —
     otherwise the reach is a different size in every place the
     block appears. */
  useEffect(() => {
    const el = wrap.current;
    if (!el || !give || still) return;
    let raf = 0;
    let next = { x: 0, y: 0 };
    const publish = () => { raf = 0; setLean(next); };
    const read = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      const k = b.width / (el.offsetWidth || b.width) || 1;
      const mx = (e.clientX - b.left) / k;
      const my = (e.clientY - b.top) / k;
      const { x: hx, y: hy, r } = hub.current;
      const dx = mx - hx;
      const dy = my - hy;
      const d = Math.hypot(dx, dy);
      /* nothing at the centre, full at the edge, and gone by
         FADE past it — see the note above */
      const rise = Math.min(1, d / r);
      const away = d <= r ? 1 : Math.max(0, 1 - (d - r) / FADE);
      /* the search field's ceiling, because it is the same
         gesture even though the curve into it is not */
      const drawn = rise * away * (2 + (clamp(give, 0, 100) / 100) * 5);
      next = drawn > 0
        ? { x: (dx / (d || 1)) * drawn, y: (dy / (d || 1)) * drawn }
        : { x: 0, y: 0 };
      if (!raf) raf = requestAnimationFrame(publish);
    };
    const gone = () => { next = { x: 0, y: 0 }; if (!raf) raf = requestAnimationFrame(publish); };
    document.addEventListener("pointermove", read, { passive: true });
    document.addEventListener("pointerleave", gone);
    return () => {
      document.removeEventListener("pointermove", read);
      document.removeEventListener("pointerleave", gone);
      cancelAnimationFrame(raf);
    };
  }, [give, still, n]);

  const choose = (i: number) => {
    if (i === at) return;
    setSel(i);
  };

  return (
    <div className="mag" ref={wrap} style={{ width: W, height: H }} role="radiogroup" aria-label="Shape">
      {pts.map(([px, py], i) => {
        const on = i === at;
        const { far, fall, push, ux, uy } = field[i];

        const k = 300 + 280 * (1 - Math.min(far, 3) / 4);
        const wait = far * 0.022;

        return (
          <motion.button
            key={i}
            className="mag-chip"
            role="radio"
            aria-checked={on}
            aria-label={NAMES[i]}
            data-on={on || undefined}
            style={{
              left: px - minX + H_PAD,
              top: py - minY + H_PAD,
              width: CHIP,
              height: CHIP,
            }}
            onClick={() => choose(i)}
            /* nothing animates on mount — the block is drawn
               with a selection already made, and a field that
               assembles itself on page load reads as a loading
               state rather than as a choice */
            initial={false}
            animate={{
              x: ux * push,
              y: uy * push,
              /* ── wide before it goes tall ────────────────
                 Two springs at different stiffnesses rather
                 than one scale, so the transient is
                 anisotropic and the rest state is not: X
                 leads, Y follows a beat behind, and the chip
                 flattens out and rounds up on its way to size.
                 This is the whole of the "jelly", and it is
                 four numbers rather than a keyframe track —
                 which matters, because a keyframed squash is
                 the same squash at every Bounce setting and
                 this one is not there at all when the spring
                 is critically damped. */
              scaleX: on ? grow : 1 - cower * fall,
              scaleY: on ? grow : 1 - cower * fall,
              /* shoved things tip, and only the sideways part
                 of the shove tips them — a chip driven straight
                 up has nothing to lean into. The shapes carry
                 it even when the chip is a circle and the
                 rotation is otherwise invisible. */
              rotate: ux * tilt * fall,
            }}
            transition={{
              /* ── and the far ones are LATE ────────────────
                 22ms a step. Fire them together and the
                 cluster moves as a slab; stagger them and the
                 shove travels outward, which is the difference
                 between a layout change and a force. */
              x: { ...swing(k, 0.9), delay: wait },
              y: { ...swing(k, 0.9), delay: wait },
              scaleX: { ...swing(k * 1.24, 0.8), delay: wait },
              scaleY: { ...swing(k * 0.86, 0.95), delay: wait },
              rotate: { ...swing(k * 0.8, 1), delay: wait },
            }}
          >
            {/* ── the hover lives on its OWN element ────────
                The button carries a Framer transform and this
                carries a CSS one, because they cannot share:
                CSS `scale` and `transform` are applied in
                sequence rather than folded together, so a rule
                here and a spring there fight every frame. Two
                elements, two transforms, no argument — and it
                buys the hover its own curve, which it needs,
                since the spring that moves the field would
                make a bouncy hover out of a lift that is meant
                to be felt rather than seen. */}
            {/* ── the lean lives HERE, not on the button ────
                The button's transform is Framer's — the field's
                shove, the swell and the tilt, all on one spring
                with a delay on it. A cursor-follow on that
                spring would arrive late and keep arriving after
                you had gone. The skin is the other element and
                carries its own transform, which is also where
                the hover swell already lives. */}
            <span
              className="mag-skin"
              style={{
                "--lx": `${lean.x.toFixed(2)}px`,
                "--ly": `${lean.y.toFixed(2)}px`,
              } as React.CSSProperties}
            >
              <span className="mag-mark" style={{ background: ORBS[i] }} />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
