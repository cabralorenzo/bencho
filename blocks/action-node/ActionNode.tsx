import { useEffect, useRef, useState } from "react";
import { Copy, GitCommitHorizontal, Link2, Plus, Settings2 } from "lucide-react";

/* ══ Action node ══════════════════════════════════════════
   A card for one step of an automation, with its controls
   folded into the corner until you want them.

   THE CONTROLS ARE THE COMPONENT. Everything else here — the
   mark, the name, the row of faces, the line about what it
   does — is a node card, and a node card is not an
   interaction. What this block is
   about is where a card's actions live when you are not using
   them, and the answer it argues for is: inside the corner
   they belong to.

   ── THEY COME OUT OF THE CORNER, THEY DO NOT ARRIVE AT IT ─
   The reflex is to fade a toolbar in above the card, and it
   is wrong in a way that is easy to miss: a control that
   fades in has no relationship to the thing it controls. It
   could belong to anything. These are drawn on an arc struck
   from the card's own top-right corner, they start AT that
   corner with no radius and no size, and they travel out
   along it — so the card is visibly where they came from and
   the corner is visibly what they are attached to.

   Which is also why they scale as they travel rather than
   arriving full size: a thing coming out of somewhere is
   small when it is still mostly inside it.

   ── ONE SPRING EACH, AND THE STAGGER IS A DELAY ON THE
      TARGET, NOT AN EASE ─────────────────────────────────
   Four springs, always constructed, because hooks cannot be
   conditional — the count knob decides how many are drawn,
   not how many exist. Each one is told to open a beat after
   the one before it, and the spring does the rest: the
   cascade is four objects with their own physics rather than
   one animation with offsets, which is the difference between
   a fan opening and a list appearing in order.

   Closing runs the other way, last out first back, so the
   fan folds into the corner rather than collapsing from the
   inside. */

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

/* 0..100 into the two numbers a spring actually has.

   50 is what Humidity and Brightness were tuned at, which is
   the rule every elastic knob on this bench follows — see
   lab/motion. Turn the panel to the middle and nothing has
   changed.

   Both ends have to be usable, which is what fixes the range:
   at 0 it is slow and heavy and still arrives, at 100 it is
   quick with a visible overshoot, and nowhere in between does
   it ring for longer than it takes to read. */
/* The pair is chosen by DAMPING RATIO and then written back
   as stiffness and decay, because the ratio is the thing a
   person is actually setting and the two numbers on their own
   do not say what they add up to.

     zeta = -ln(d) / (2 * sqrt(k))

   The first version of this ran 0.06..0.26 stiffness against
   0.93..0.74 decay, which reads as a sensible spread and is
   not one: it puts zeta between 0.15 and 0.16 across the
   WHOLE range, so every setting overshot by about sixty per
   cent and the knob only changed how fast it did it. Pull's
   return went 130px past its own resting position and lifted
   the content off the top of the card.

     0   → zeta ~0.85, heavy, arrives without a ring
     50  → zeta ~0.41, near where Humidity and Brightness sit
     100 → zeta ~0.20, lively, two visible rebounds

   Both ends shippable, which is the constraint that fixed the
   numbers rather than taste. */
const springOf = (tune: number) => ({
  /* stiffness: how hard it is pulled toward the target */
  k: 0.08 + (tune / 100) * 0.16,
  /* decay, per frame: how much of the velocity survives */
  d: 0.62 + (tune / 100) * 0.2,
});

/* Units matter. The snap threshold is absolute, so a caller
   works in pixels or in 0..100 — a spring driven over 0..1
   would be "settled" before it had visibly moved. */
function useSpring(target: number, tune = 50, instant = false) {
  const [at, setAt] = useState(target);
  const cur = useRef(target);
  const vel = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (instant) {
      cur.current = target;
      vel.current = 0;
      setAt(target);
      return;
    }
    const { k, d } = springOf(tune);
    let prev = 0;
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
      prev = t;
      vel.current += (target - cur.current) * k * dt;
      vel.current *= Math.pow(d, dt);
      cur.current += vel.current * dt;
      if (Math.abs(target - cur.current) < 0.02 && Math.abs(vel.current) < 0.02) {
        cur.current = target;
        vel.current = 0;
        setAt(target);
        raf.current = 0;
        return;
      }
      setAt(cur.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    /* `tune` sits here beside `target` for the reason
       Brightness spells out: the loop closes over it, so
       without it a knob turned mid-flight would do nothing
       until something else restarted the effect. Restarting
       picks up from the refs, so it continues rather than
       snapping. */
  }, [target, tune, instant]);

  return at;
}

/* Read once, the way the wheel and the pill nav do. A
   preference, not a live input. */
const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* the button and half of it. Everything else that has a size
   is measured off this one — the spacing, the hiding place,
   the air the block keeps — so the buttons grow by changing
   this number and nothing else. */
const DOT = 36;
const R = DOT / 2;

/* centre to centre along the path. A real distance rather
   than an angle, which is the point of laying these out by
   arc length: twelve pixels of air between two buttons is
   twelve pixels whatever the corner is doing. */
const SPACING = DOT + 12;

/* ── they ride the card's OWN corner, offset ───────────────
   The path is the card's outline pushed out by a constant
   distance: straight along the top edge, round the corner on
   an arc concentric with it, straight down the right edge.
   Buttons are placed by how far along that path they are.

   ── WHY NOT A CIRCLE STRUCK FROM ONE POINT ──────────────
   That is what this was, with the centre parked 26px inside
   the corner, and it only looked right at one corner radius —
   the 18 it was tuned against. Square the card off and the
   card's material comes out to meet a path that has not
   moved: measured at Corner 0, the middle button cleared the
   corner by 2px while the ones at the ends of the fan still
   had thirteen. Round it right up and the opposite happens.

   A circle also cannot go round more than the quarter between
   the two edges. Past that the buttons carry on rotating away
   from an edge that has stopped curving, and a wide fan put
   its end buttons THROUGH the card's top edge.

   An offset path has neither problem because it is the card's
   own shape: every point on it is exactly `gap` from the
   nearest card surface, corner or edge, at every radius.

   ── how far along the path a button sits ────────────────
   `s` is arc length measured from where the corner arc meets
   the top edge, so the corner occupies 0..len and anything
   outside that has run onto a straight. Returns the point and
   the direction out of the card there, which is what the
   button slides along when it opens. */
function ride(s: number, corner: number, off: number) {
  /* the offset arc is concentric with the card's, so its
     radius is the card's plus the offset — and floored just
     above zero for a square card, where the corner is a
     point and the arc is a quarter turn about it */
  const arc = Math.max(0.001, corner + off);
  const len = (arc * Math.PI) / 2;
  if (s <= 0) {
    /* along the top edge, going left */
    return { x: -corner + s, y: -off, nx: 0, ny: -1 };
  }
  if (s >= len) {
    /* down the right edge */
    return { x: off, y: corner + (s - len), nx: 1, ny: 0 };
  }
  const th = Math.PI / 2 - s / arc;
  return {
    x: -corner + arc * Math.cos(th),
    y: corner - arc * Math.sin(th),
    nx: Math.cos(th),
    ny: -Math.sin(th),
  };
}

/* ── where they hide, and it has to be PROVABLY inside ─────
   A point on the card's diagonal, far enough in that a whole
   button fits behind the card with nothing showing past the
   corner.

   It cannot simply be "back along the normal", which is what
   it was: a button over the top edge slid down behind the
   top edge fine, but the one sitting on the corner slid back
   toward a corner that, when Corner is 0, has no material in
   the diagonal to hide behind. Measured at Corner 1, four
   pixels of every folded button showed past the point.

   Two cases, because a rounded corner is bitten out of the
   very material a square one has:

     · corner >= R + 2, and the corner's own centre is the
       answer. It is `corner` from both edges and `corner`
       from the arc, so a button there is at least R inside
       everything, with two pixels to spare. The margin is not
       decoration: at exactly R the button is tangent to the
       boundary, which draws a hairline of it.

     · below that, and there is no room near the corner at
       all — the arc has eaten it. So go past the corner's
       disc entirely and stop where both edges are clear.

   The distance is along the diagonal, so this is one number.
   Nobody ever sees the position; what they see is that
   nothing shows when the fan is shut. */
const hideAt = (corner: number) =>
  corner >= R + 2
    ? corner * Math.SQRT2
    : Math.max(R * Math.SQRT2 + 2, corner * Math.SQRT2 + corner + 2);

/* ── Reach is the air between the card and the fan ─────────
   The scale is the original 0..100 one and the knob is
   allowed a narrow window of it: 20 to 40, which is 11px of
   gap to 16. That window is the whole of what is worth
   having — tighter and the buttons foul the corner, wider and
   they stop reading as attached to the card — so the knob
   spends all twenty of its steps inside it.

   NOT a pixel count, which it was for one revision and should
   not have been. Turning the number itself into pixels
   doubled every setting: 20 on this scale is 11px of air, and
   20 read as px is a fan sitting twice as far out as the one
   that had just been approved. The scale a value was judged
   on is part of the value. */
const gapPx = (reach: number) => 6 + (clamp(reach, 20, 40) / 100) * 24;

/* ── the air the BLOCK keeps above and below the card ─────
   The fan hangs outside the card, and until now it hung
   outside the block as well: the wrapper's box was the card
   and nothing else. That is right about width and wrong about
   height. The wall measures a component and pads what it
   measures, so a card reserving no vertical room of its own
   arrived as the squattest tile on the wall — 303px against
   neighbours at 364 and 424 — and the buttons the block is
   ABOUT were drawn in the tile's margin rather than in the
   block.

   So the block keeps the room the fan uses. Measured at the
   top of the Reach window and not at the current setting,
   because a box that changed size as the knob moved would
   resize its own tile on the wall while you dragged it. One
   constant, both sides, symmetrical so the card stays centred
   in the overlay.

   THE WIDTH IS UNTOUCHED, which was the whole of the old
   note: the wall scales by the LARGEST side, so a wider box
   is a smaller card. 300 across against 256 down keeps the
   width governing and the card exactly the size it was. */
const AIR = Math.ceil(gapPx(100) + DOT);

/* the beat between one button and the next, at the top of the
   range. 90ms is about as long as a cascade can be before the
   last one reads as late rather than as following. */
const BEAT = 90;

/* ── what the buttons do, and why these four ───────────────
   Connect, add a step, duplicate, settings: the four things
   you do to a node without opening it. They are all about the
   node's place in the flow, which is what a card in a canvas
   is for — running it is a property of the whole flow and
   belongs to the canvas, not to one step of it.

   Deliberately not delete. The one action here that cannot be
   undone does not belong in a row that appears under your
   cursor. */
const ACTS = [
  { id: "link", label: "Connect", Icon: Link2 },
  { id: "add", label: "Add a step", Icon: Plus },
  { id: "copy", label: "Duplicate", Icon: Copy },
  { id: "settings", label: "Settings", Icon: Settings2 },
];

/* ── who is on the step ────────────────────────────────────
   Three of the bench's own faces, from lab/avatars.ts, which
   is the same set the arrange list and the roster draw. One
   photograph of a person belongs to one person across the
   whole site: seeing the same face on three blocks reads as
   one product, and four different stock sets read as three.

   THREE PICTURED, not four. A row of four discs and a count
   beside them is most of the width of this card given over to
   who is on a step, which is the least urgent thing on it —
   see the note where the row is drawn. Three reads as a
   handful and leaves the sentence above room.

   Each face is one of the Sounds wall's soft radial orbs
   (2026-11-25), in place of the photographs: three looks that
   sit apart, so the overlapping discs stay distinct. */
const CREW = [
  { id: "mara", orb: RADIAL[2] },
  { id: "ines", orb: RADIAL[5] },
  { id: "kai", orb: RADIAL[10] },
];

/* ── and how many are on it altogether ─────────────────────
   The chip beside the faces is the DIFFERENCE, not a typed
   number. It read "+2" next to a row of four, which was right
   until the row became three and then quietly was not: the two
   halves of one fact, kept in two places, and only one of them
   edited. Six on the step, three pictured, three counted. */
const ON_STEP = 6;

/* ── the step's own number ─────────────────────────────────
   A node in a flow is identified by where it sits in the
   flow, not by the service it happens to call: two steps can
   both be Claude and they are not the same step. So the
   heading is the id and the service is a line under it \u2014 which
   is also what every automation tool on the market does, for
   the same reason. */
const NODE = "Node 07";

export function ActionNode({
  /* how far the fan travels out from the corner, 0..100 */
  /* the air between the card and the buttons, 20..40. It was
     the Reach knob; it is fixed at 25 and off the panel now
     (2026-09-26), and stays a prop so the value lives here. */
  reach = 25,
  /* the spring, 0..100 — see springOf in ./spring */
  bounce = 20,
  /* how far apart the buttons open, 0..100 */
  stagger = 55,
  /* how many of ACTS are drawn, 2..4 */
  count = 4,
  /* the card's own corner, in px. The buttons keep theirs. */
  corner = 20,
}: {
  reach?: number;
  bounce?: number;
  stagger?: number;
  count?: number;
  corner?: number;
} = {}) {
  const n = clamp(Math.round(count), 2, 4);
  const still = stillness();

  /* ── open, and then open PER BUTTON ─────────────────────
     `on` is the pointer. `lit` is what each spring is aiming
     at, which is the same thing a moment later — and the
     moment is the stagger. Kept as four flags rather than as
     a count, so the reverse fold is the same mechanism read
     backwards rather than a second one. */
  const [on, setOn] = useState(false);
  const [lit, setLit] = useState([false, false, false, false]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const gap = still ? 0 : (clamp(stagger, 0, 100) / 100) * BEAT;
    for (let i = 0; i < 4; i += 1) {
      /* opening runs first to last; closing runs last to
         first, so the fan folds back into the corner in the
         order it came out of it */
      const place = on ? i : n - 1 - i;
      const at = gap * place;
      const set = () =>
        setLit((prev) => {
          if (prev[i] === on) return prev;
          const next = [...prev];
          next[i] = on;
          return next;
        });
      if (at <= 0) set();
      else timers.current.push(window.setTimeout(set, at));
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [on, n, stagger, still]);

  /* Four, always, whatever `count` says: a hook cannot be
     drawn conditionally and a spring nobody reads costs a
     number that never moves. */
  const p0 = useSpring(lit[0] ? 100 : 0, bounce, still);
  const p1 = useSpring(lit[1] ? 100 : 0, bounce, still);
  const p2 = useSpring(lit[2] ? 100 : 0, bounce, still);
  const p3 = useSpring(lit[3] ? 100 : 0, bounce, still);
  const at = [p0, p1, p2, p3];

  /* ── where each button ends up ──────────────────────────
     The path is offset from the card by the gap PLUS a
     button's own half, so the gap is measured from the card
     to the button's edge rather than to its middle.

     Centred on the corner's midpoint and spread by arc
     length, so the fan is symmetrical about the diagonal
     however many are on it and however square the card is.
     Laid out from the top edge down, so the cascade opens
     over the card's top and comes round. */
  const c = clamp(corner, 0, 32);
  const off = gapPx(reach) + R;
  const mid = ((c + off) * Math.PI) / 4;
  const spots = Array.from({ length: n }, (_, i) =>
    ride(mid + (i - (n - 1) / 2) * SPACING, c, off),
  );

  /* the one place they all fold back to */
  const deep = hideAt(c) / Math.SQRT2;
  const hid = { x: -deep, y: deep };

  /* ── the air between the card and the fan is a HOLE ─────
     The wrapper's box is the card and the buttons hang
     outside it, so the eleven to sixteen pixels of air the
     Reach knob puts between the two belong to nothing at all.
     Move the pointer from the card toward a button and it
     leaves .nod on the way across — the fan folds itself away
     from under the cursor that was reaching for it, and the
     buttons cannot be got at by hand. Only a jump that clears
     the gap in one frame ever landed on one.

     So the fan carries a hit area: the box its own buttons
     occupy, bled a little, hung off the same corner anchor
     they are. Measured off `spots`, so it follows Reach,
     Corner and the count without a second copy of the
     geometry living anywhere.

     Live only while the fan is open — an always-on pad would
     mean empty space beside the card opened it, which is the
     opposite complaint. */
  const BLEED = 6;
  const box = spots.reduce(
    (b, s) => ({
      l: Math.min(b.l, s.x - R - BLEED),
      r: Math.max(b.r, s.x + R + BLEED),
      t: Math.min(b.t, s.y - R - BLEED),
      d: Math.max(b.d, s.y + R + BLEED),
    }),
    /* seeded on the anchor, so the pad reaches back to the
       corner however far out the fan has been sent */
    { l: 0, r: 0, t: 0, d: 0 },
  );
  const pw = box.r - box.l;
  const ph = box.d - box.t;
  /* the corner itself, in the pad's own coordinates */
  const px = -box.l;
  const py = -box.t;

  /* ── and the bite taken out of it is INSIDE the card ────
     The pad is a rectangle and the card is in one corner of
     it, so a piece has to come out or the pad lies over the
     card's surface. Cut the quadrant — x < 0 and y > 0 — and
     the cut is too greedy: just outside a ROUNDED corner, on
     the diagonal, the material has pulled back but the
     quadrant has not, and that is exactly where the middle
     button's path crosses. It leaves a hole 0.41c deep, 8px
     at the default, in the one place the hand goes.

     x < -c with y > c is card at every radius, so that is the
     rectangle to lose: the card keeps its whole surface and
     the pad keeps every scrap of the air. */
  const bx = Math.max(0, px - c);
  const by = Math.min(ph, py + c);

  return (
    <div
      className="nod"
      /* the corner rides on the wrapper as a variable rather
         than on the card as a style, because the Stroke rule
         has to cut its ring to the same radius and a rule
         cannot read an inline style. One number, two readers. */
      style={
        {
          "--nod-r": `${c}px`,
          /* ── the mark is cut with the card ────────────────
             It was a disc, which is the shape a service badge
             usually is — and on a card whose corner is a knob
             it was the one thing that ignored the knob. Square
             the card off and a perfect circle sat inside it
             looking like it had come from somewhere else.

             Not concentric, because concentric is for a thing
             sitting IN the corner and this one is inset from
             it by the card's whole padding: `c - 18` is 2 at
             the default, which is a square with a chip off it
             rather than a rounded square.

             A share of the card's radius instead, capped at
             half its own 30 — so the top of the Corner range
             hands back exactly the circle it used to be, the
             bottom is a square in a square card, and the
             default is the rounded square in between. */
          "--nod-mark-r": `${Math.min(15, c * 0.47).toFixed(2)}px`,
          /* here rather than in the sheet because the fan's
             anchor below has to be offset by the same number,
             and two copies of it is one copy too many */
          paddingBlock: AIR,
        } as React.CSSProperties
      }
      onPointerEnter={() => setOn(true)}
      /* ── `out` with a containment test, not `leave` ──────
         The same swap Tilt makes and for the same reason: the
         rehearsal's last beat walks a scripted pointer off the
         card carrying `relatedTarget: null`, which React never
         turns into a leave — so every card on the wall would
         finish its demo with the fan still out. */
      onPointerOut={(e) => {
        const to = e.relatedTarget as Node | null;
        if (!to || !e.currentTarget.contains(to)) setOn(false);
      }}
      onPointerCancel={() => setOn(false)}
    >
      <div className="nod-card" data-on={on || undefined}>
        <div className="nod-top">
          <span className="nod-mark" aria-hidden="true">
            {/* ── the mark, from the same set as the buttons ─
                lucide's git-commit-horizontal: a ring with a
                wire running out of either side of it. Which is
                what this card literally is — one step with a
                flow arriving and a flow leaving — where the
                diamond and the astroid before it were both
                shapes that STOOD FOR a step rather than
                drawing one.

                ── AND IT IS WIDER THAN THE OTHERS WERE ──────
                The glyph spans its full 24 units where those
                filled a square, so at the same nominal size it
                reads as a much lighter mark: 15 puts the ring
                at under four pixels. 18 is what gives the ring
                its weight back without the wires reaching the
                mark's own edge — measured, the glyph is 18
                across in a 30 box, so six pixels of air stay
                on each side.

                From the set rather than drawn by hand. The
                rule about not drawing marks is really a rule
                about not wearing somebody else's LOGO, and a
                shape out of the icon set the four buttons
                already use is the furthest thing from one. */}
            <GitCommitHorizontal size={18} strokeWidth={2} />
          </span>
          <span className="nod-name">{NODE}</span>
          {/* ── AND THERE IS NO BADGE ANY MORE ─────────────
              A "Connected" pill sat here, green dot and all, at
              the right-hand end of this row. It had already
              survived being the wrong word once — it read
              "Action", which the mark and the sentence below
              both said better — and being moved up from a row
              of its own at the foot of the card.

              It is gone because of what this block IS. The
              controls are the component; the card is the thing
              they fold into. A status pill is the loudest
              element in the header and it belongs to a node
              card that does not exist, telling you about a
              connection to nothing — furniture arguing for
              attention on a card whose whole job is to sit
              still while the corner does the work.

              The header is the mark and the name now, which is
              as much card as the demonstration needs. */}
        </div>

        <p className="nod-say">
          Reads the thread, writes a summary, and posts it back to the channel it
          came from.
        </p>

        {/* ── the faces, and they come AFTER the sentence ───
            They sat between the name and the description,
            which put four photographs of people through the
            middle of a paragraph — the eye stopped on them and
            then had to go back for the line it was reading.

            A card like this reads name, then what the step
            does, then who is on it. The faces are the least
            urgent of the three and the heaviest to look at,
            which is exactly the thing to put last. */}
        <div className="nod-chain" aria-hidden="true">
          {CREW.map((p) => (
            <span key={p.id} className="nod-link" style={{ background: p.orb }} />
          ))}
          <span className="nod-more">+{ON_STEP - CREW.length}</span>
        </div>
      </div>

      {/* ── the fan ──────────────────────────────────────────
          Anchored ON the corner, so every button's travel is
          measured from the one point they all came out of.
          Positioned rather than laid out: a flex row would put
          them in a line and the line is the thing this is
          arguing against. */}
      {/* ── anchored on the card's own top-right corner ────
          Every spot above is measured from that point, so the
          fan needs no offset of its own and the arithmetic has
          one origin.

          THE FAN HANGS OUTSIDE THE BOX, which is deliberate
          and is what fixes the card looking half the size of
          every other block on the wall. The wall scales a
          component so its LARGEST side lands on 260 — so the
          air this used to reserve as padding was coming
          straight out of the card's own budget: a 375px box
          for a 288px card meant the card drew at 199 where a
          plain 300px block drew at 260.

          The buttons overflow instead. The wall's cards carry
          82px of vertical padding and centre what they hold,
          so there is room for the fan on both sides it uses,
          and the component's box is now the card and nothing
          else \u2014 which is also what centres the card in the
          tile. */}
      {/* `top: AIR`, not 0: an absolutely positioned child is
          laid against the PADDING box, so the air above pushes
          the card down and would leave the anchor behind at
          the top of the block. The corner it is struck from is
          the card's corner or it is nothing. */}
      <div className="nod-fan" style={{ top: AIR, right: 0 }}>
        <i
          className="nod-reach"
          aria-hidden="true"
          data-on={on || undefined}
          style={{
            left: box.l,
            top: box.t,
            width: pw,
            height: ph,
            clipPath: `polygon(0 0, ${pw}px 0, ${pw}px ${ph}px, ${bx}px ${ph}px, ${bx}px ${by}px, 0 ${by}px)`,
          }}
        />
        {ACTS.slice(0, n).map((a, i) => {
          const u = clamp(at[i] / 100, 0, 1.4);
          const spot = spots[i];
          /* ── out of the corner, in a straight line ───────
             From the hidden point to its place on the path,
             so the fan opens OUT of the corner rather than
             each button dropping off its own edge. Which is
             also the only version that can be hidden at every
             corner radius — see hideAt.

             `u` is not clamped, so the spring's overshoot
             carries each button a little past its place and
             back, rather than being flattened at the end of
             the journey. */
          const put = (a: number, b: number) => a + (b - a) * u;
          return (
            <button
              key={a.id}
              className="nod-act"
              type="button"
              aria-label={a.label}
              title={a.label}
              /* hidden from the keyboard while it is folded
                 away: a control you cannot see should not be
                 the next thing tab lands on */
              tabIndex={on ? 0 : -1}
              style={{
                width: DOT,
                height: DOT,
                /* its own centre on the anchor before anything
                   moves it. Here rather than in the sheet
                   because it is exactly half a button, and a
                   copy of that over there is a number that
                   goes stale the day DOT changes — which it
                   just did. */
                marginTop: -R,
                marginLeft: -R,
                translate: `${put(hid.x, spot.x)}px ${put(hid.y, spot.y)}px`,
                /* ── barely any scale, and no fade at all ──
                   Both were doing a job the stacking does
                   better now. A button hidden UNDER the card
                   does not need to be transparent to be
                   hidden, and a fade on something sliding out
                   of a drawer is the one cue that says it was
                   never really in there.

                   The 0.18 that is left is not concealment,
                   it is weight: a thing being pushed out
                   arrives at its full size a moment after it
                   arrives at its place, and the spring's own
                   overshoot carries the rest.

                   ── A VARIABLE, NOT THE SCALE ────────────
                   Because the hover has to grow the button
                   too, and two writers cannot share one
                   property: an inline `scale` wins over any
                   rule, so a CSS hover would have been
                   ignored. The stylesheet multiplies this by
                   its own factor and sets `scale` once from
                   both — see .nod-act, which also explains why
                   only one of the two is transitioned. */
                "--pop": 0.82 + 0.18 * Math.min(u, 1),
              } as React.CSSProperties}
            >
              {/* 16 in a 36 disc, which is the 14-in-32 the
                  smaller button had. A glyph that stayed put
                  while the disc grew would read as the button
                  getting emptier rather than bigger. */}
              <a.Icon size={16} strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
