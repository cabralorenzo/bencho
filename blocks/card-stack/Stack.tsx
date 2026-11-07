import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* ══ Card stack ════════════════════════════════════════════
   A short pile of cards that fans out when you go near it and
   packs itself away when you leave.

   ── IT IS ONE ROTATION PER CARD, AND NOTHING ELSE ─────────
   The reflex is to animate x, y and rotation separately and
   tune three curves until the three agree. They never quite
   do, because they are describing one physical thing — a card
   pivoting in a hand — with three independent numbers, and
   any disagreement between them reads as the cards sliding
   rather than turning.

   So there is one number per card: the angle it is turned to.
   The pivot is a point 200px BELOW the pile, well outside the
   block, and `transform-origin` puts it there — which means
   the sideways travel, the arc that drops the outer cards
   lower than the middle one, and the tilt are all the same
   rotation. The fan cannot come apart, because there is
   nothing to come apart.

   ── THE MARK LIVES IN THE LEFT EDGE ───────────────────────
   Which is not a decoration decision. A fanned card shows one
   sliver of itself — about 23px at the default spread — and
   that sliver is its left edge, because the card to its right
   covers the rest. Anything that identifies a card has to be
   inside that strip or it is only ever legible on the one
   card at the end of the fan. The numerals are at 12px, 12
   from the left, which is the whole of why they are there and
   not centred.

   ── AND THE SCATTER IS SEEDED, NOT RANDOM ─────────────────
   A pile that squared itself up perfectly reads as a graphic
   of a pile, and a fan whose cards are at exactly 6.6 degrees
   apart reads as a chart. Both want a little disagreement in
   them — but from a table written down here rather than from
   Math.random, for two reasons. A wall can hold several
   copies of this block and they must not each be sitting at a
   different angle; and a number nobody chose cannot be tuned,
   which means the "organic" version could never be made
   better or worse on purpose. These five columns were picked
   by eye and they are the same five every time. */

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
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;

/* ── the card, and everything is measured off it ───────────
   A 3:4 rectangle, which is the proportion of nearly every
   card anybody has held. Change these two and the stage, the
   pivot's reach and the block's own box all follow. */
const CARD_W = 156;
const CARD_H = 208;

/* ── how far below the pile the hand is ────────────────────
   The whole geometry of the fan is this one distance. Short,
   and the cards swing wide for very little rotation — they
   read as sliding sideways. Long, and they rotate on the spot
   without ever separating.

   A little over a card and a quarter, which is where the two
   effects are about equal: at the widest setting the end card
   has turned 20 degrees and travelled about 90px, so you can
   see both happening and neither is doing all the work. It
   scales with the card, so the fan keeps its shape. */
const PIVOT = 260;

/* the widest the fan ever opens, corner to corner in degrees.
   Spread is a window on this, never the whole of it — see
   `arc` below. */
const ARC = 40;

/* ── the loosest the pile ever sits ────────────────────────
   Scatter at 100. A card can be five degrees off square and
   seven pixels off centre, which is a deck somebody put down
   in a hurry rather than a deck somebody dropped. Past that it
   stops being a stack and becomes a mess, and the block is
   about a stack. */
const SHUT_ROT = 5;
const SHUT_OFF = 7;

/* ── and the same disagreement in the OPEN fan ─────────────
   A SHARE OF THE STEP, not a number of degrees, and that
   correction is worth the line. It was a flat 2.2deg, which is
   a quarter of the step at the widest spread and nearly half
   of it at the tightest — so at Spread 0 with Scatter at 100
   two adjacent cards could land within half a degree of each
   other and one of them simply disappeared behind the other.

   Measured: three cards at Spread 0 drew two. A knob whose
   bottom end loses a card is a broken end, and this is a
   block where both ends of every range have to be a stack.

   As a share, the disorder is the same disorder at every
   spread and the cards cannot cross: the worst case is two
   neighbours leaning at each other by this much each, which
   still leaves more than half a step between them. */
const RAGGED = 0.22;

/* how much of the fan the SHUT pile already shows. A share of
   the open angle, so the resting pile is the same fan held
   nearly closed — every card's edge peeks out on its own side
   — and opening is that fan carrying on rather than a squared
   pile changing into one. It sits inside the open fan's own
   reach, so the stage does not grow for it. */
const REST = 0.4;

/* how far each card behind the front one peeks out of the
   top of the pile, and how much smaller it is drawn. The
   recession is what makes five cards in nearly the same place
   read as five cards rather than as one thick one.

   5 rather than the 3.5 it was drawn at, and the wall is what
   decided it. A card there is 260px for a block measured at
   366, so everything in the shut pile arrives at about seven
   tenths of the size it was tuned at — and at 3.5 the whole
   stack collapsed into what read as a single card with a
   shadow. The resting state is the thumbnail for this block,
   so it has to be a STACK at the size the wall draws it and
   not only at the size the overlay does. */
const DEEP = 5;
const SINK = 0.016;

/* how far the card under the pointer slides out of the fan,
   along its own axis — so it leaves the fan radially, the way
   a card is drawn from a hand, rather than simply moving up.

   20, and it is load-bearing rather than decorative: the card
   stays where it is in the stacking order, so this distance is
   the whole of what makes it legible. Less than about 14 and
   it reads as the fan wobbling. */
const LIFT = 20;

/* the beat between one card and the next. 70ms is about as
   long as a cascade of six can be before the last one reads
   as late rather than as following, and 55 keeps the cards
   reading as one motion travelling along the fan. */
const BEAT = 55;

/* the most cards the fan is ever asked to hold. Six springs
   are built whatever the count says, because a hook cannot be
   drawn conditionally — see `at` below. */
const MAX = 6;

/* ── the disagreement, written down ────────────────────────
   Five columns per card, all in -1..1, all multiplied by
   Scatter before they reach anything: how far off square it
   sits in the pile, how far off centre in each axis, how late
   it is out of the pile, and how much livelier or heavier its
   own spring is than the knob says.

   The last one is the one that does the most work. Six
   springs at identical stiffness arrive together however they
   are staggered, and a fan whose cards all stop on the same
   frame is the mechanical version of this no matter how
   uneven the angles are. */
const SEED = [
  { rot: -0.62, dx: 0.41, dy: -0.28, beat: 0.34, tune: -0.22 },
  { rot: 0.83, dx: -0.55, dy: 0.36, beat: -0.47, tune: 0.31 },
  { rot: -0.24, dx: 0.68, dy: 0.52, beat: 0.71, tune: -0.44 },
  { rot: 0.47, dx: -0.31, dy: -0.63, beat: -0.18, tune: 0.58 },
  { rot: -0.91, dx: -0.72, dy: 0.19, beat: 0.52, tune: -0.36 },
  { rot: 0.36, dx: 0.24, dy: -0.47, beat: -0.66, tune: 0.27 },
];

/* ── the room the block keeps, and it is ARITHMETIC ────────
   The wall measures a component and scales what it measures,
   and `.bench-card-stage` clips — so a fan that opened past
   the block's own box would be cut off square, and cut at a
   different place on the wall than in the overlay. The box
   has to contain the widest thing this block can ever draw.

   `MOST` is that: half the widest arc, plus the raggedness
   that sits on top of it — and the raggedness is worst at
   THREE cards, where one step is the whole half-arc.
   Everything below falls out of it and out of the card's own
   size, so changing a constant above moves the box with it
   rather than leaving a number here that used to be right. */
const MOST = (ARC / 2) * (1 + RAGGED);
/* how far the end card's centre swings, and how far the arc
   carries it down */
const SWING = PIVOT * Math.sin(rad(MOST));
const DROP = PIVOT * (1 - Math.cos(rad(MOST)));
/* a turned rectangle is wider and taller than a square one */
const EXT_X = (CARD_W * Math.cos(rad(MOST)) + CARD_H * Math.sin(rad(MOST))) / 2;
const EXT_Y = (CARD_W * Math.sin(rad(MOST)) + CARD_H * Math.cos(rad(MOST))) / 2;
/* what the loosest pile adds on every side */
const JIT =
  SHUT_OFF + (CARD_W * Math.sin(rad(SHUT_ROT)) + CARD_H * (1 - Math.cos(rad(SHUT_ROT)))) / 2;
/* and how far the back of a full pile reaches above the front
   card's own top edge */
const PILE = (MAX - 1) * DEEP;

const STAGE_W = Math.ceil((SWING + EXT_X + JIT) * 2);
/* The scatter margin is counted on both sides and the lift is
   counted once, above — and the two never happen at the same
   moment, because the pile only scatters when it is shut and
   a card is only drawn when the fan is open. The margin is
   shared on purpose rather than added twice. */
const ABOVE = Math.max(CARD_H / 2 + PILE, EXT_Y - DROP) + LIFT + JIT;
const BELOW = Math.max(CARD_H / 2, EXT_Y + DROP) + JIT;
const STAGE_H = Math.ceil(ABOVE + BELOW);

/* a photograph on each card, counted from the TOP of the pile, so the
   flowers is the front card at every count; past five they come round
   again. Resized from the originals to 480 on the long side, twice the
   most the card is ever drawn at. Five since 2026-11-06, so the default
   pile of five shows each one once (flowers in front since the same day) */
const PHOTOS = ["/lab/stack-flowers4.jpg", "/lab/stack-flowers.jpg", "/lab/stack-flowers5.jpg", "/lab/stack-flowers3.jpg", "/lab/stack-flowers2.jpg"];

/* ── a card taken out to look at ───────────────────────────
   Click one and it leaves the deck, turns over once on its way
   and lands face up in the middle, as large as the block's own
   box allows; a click anywhere else (or Esc) sends it back to
   the place in the fan it came from — wherever that place is by
   then, since the fan may have folded meanwhile.

   It is ONE element flying, not the card restyled. The card
   stays where it is, hidden, so the fan's springs and the lift
   never meet the flight; the flyer starts on the card's own
   centre, angle and size and ends square in the middle. A face
   on each side, both the photograph, so the turn reads as a
   card being flipped over rather than a picture spinning.

   Sized to the stage, never past it: the wall clips at the
   block's box, so a viewer bigger than the fan is a viewer cut
   off square. */
const VIEW_H = STAGE_H - 24;
const VIEW_W = Math.round((VIEW_H * CARD_W) / CARD_H);
const VIEW_IN = 920;
const VIEW_OUT = 660;
/* the most the card in view leans under the pointer, at its edge */
const TILT = 6;
/* the pose at rest in the middle: turned over once, full size */
const VIEW_AT = "perspective(2000px) translate(0px, 0px) rotate(0deg) rotateY(180deg) scale(1)";

export function Stack({
  /* how wide the fan opens, 0..100 */
  spread = 85,
  /* the spring, 0..100 — see springOf in ./spring */
  bounce = 5,
  /* how much the pile and the fan disagree with themselves */
  scatter = 0,
  /* how many cards are in it, 3..6; five, one per photograph (six repeats the picnic) */
  count = 5,
  /* the card's corner, px; the card in view keeps the same roundness, scaled */
  corner = 14,
}: {
  spread?: number;
  bounce?: number;
  scatter?: number;
  count?: number;
  corner?: number;
} = {}) {
  const n = clamp(Math.round(count), 3, MAX);
  const sc = clamp(scatter, 0, 100) / 100;
  const still = stillness();

  /* `on` is the pointer. `lit` is what each spring is aiming
     at, which is the same thing a moment later — and the
     moment is the cascade. */
  const [hover, setHover] = useState(false);
  const [lit, setLit] = useState<boolean[]>(() => Array(MAX).fill(false));
  /* which card the pointer is actually over, by index. Null
     rather than -1 so "none" cannot be confused with a card. */
  const [near, setNear] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  /* the card being looked at — by its id, not its slot, since it
     comes back to a different slot — and the pose it left from */
  const [view, setView] = useState<{ id: number; from: string } | null>(null);
  /* the fan stays out while a card is in view, wherever the
     pointer goes; it folds once the card is home and nobody is
     over the deck */
  const on = hover || !!view;
  /* the order of the deck, top first, as card ids (a photo each,
     PHOTOS[id % length]). A card looked at goes back on TOP, so
     this changes; slot i shows deck[n - 1 - i] */
  const [deck, setDeck] = useState<number[]>(() => Array.from({ length: MAX }, (_, k) => k));
  /* while the others shift down a slot to make room on top, their
     transforms glide rather than jump (see .stk[data-shuffle]) */
  const [shuffle, setShuffle] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const faces = useRef<(HTMLSpanElement | null)[]>([]);
  const flyer = useRef<HTMLSpanElement | null>(null);
  const tilt = useRef<HTMLSpanElement | null>(null);
  const closing = useRef(false);
  /* each card's angle and recession as last drawn, so the flight
     can start from exactly where the card is */
  const poses = useRef<{ rot: number; scale: number }[]>([]);

  /* where card i is now, as a transform on the flyer: its centre
     read off the screen (a rotated box keeps its centre), divided
     by whatever scale the wall or the overlay draws the block at */
  const poseOf = (i: number) => {
    const r = root.current?.getBoundingClientRect();
    const f = faces.current[i]?.getBoundingClientRect();
    const p = poses.current[i] ?? { rot: 0, scale: 1 };
    if (!r || !f || !r.width) return VIEW_AT;
    const k = r.width / STAGE_W;
    const dx = (f.left + f.width / 2 - (r.left + r.width / 2)) / k;
    const dy = (f.top + f.height / 2 - (r.top + r.height / 2)) / k;
    const s = (CARD_W / VIEW_W) * p.scale;
    return `perspective(2000px) translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) rotate(${p.rot.toFixed(3)}deg) rotateY(0deg) scale(${s.toFixed(4)})`;
  };

  const open = (i: number) => {
    if (view) return;
    closing.current = false;
    setView({ id: deck[n - 1 - i], from: poseOf(i) });
  };

  /* home is the TOP of the deck: the front slot's pose is read
     before the deck reorders (that slot is at rest — the fan is
     held open and nothing is lifted), then the card goes on top
     and the ones it passed slide down a slot while it flies in */
  const close = () => {
    const el = flyer.current;
    if (!view || closing.current) return;
    closing.current = true;
    /* level again on the way home */
    if (tilt.current) tilt.current.style.transform = "";
    const home = poseOf(n - 1);
    const top = [view.id, ...deck.filter((d) => d !== view.id)];
    const moved = deck[0] !== view.id;
    setDeck(top);
    if (moved) setShuffle(true);
    const done = () => {
      setView(null);
      setShuffle(false);
    };
    if (!el || still) {
      done();
      return;
    }
    const back = el.animate([{ transform: VIEW_AT }, { transform: home }], {
      duration: VIEW_OUT,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
    });
    back.onfinish = done;
  };

  /* the flight in, the moment the flyer exists */
  useLayoutEffect(() => {
    const el = flyer.current;
    if (!view || !el) return;
    el.animate([{ transform: view.from }, { transform: VIEW_AT }], {
      duration: still ? 1 : VIEW_IN,
      easing: still ? "linear" : "cubic-bezier(0.25, 0.8, 0.25, 1)",
      fill: "both",
    });
  }, [view?.id]);

  /* a press anywhere but the card in view puts it back. Trusted
     presses only: a card's rehearsal drives scripted pointers at
     the page, and a rehearsal elsewhere must not shut this one */
  useEffect(() => {
    if (!view) return;
    const down = (e: PointerEvent) => {
      if (!e.isTrusted) return;
      if (flyer.current?.contains(e.target as Node)) return;
      close();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("keydown", key);
    };
  });

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const gap = still ? 0 : BEAT;
    for (let i = 0; i < MAX; i += 1) {
      /* ── out in front, home last ──────────────────────────
         Opening runs from the top of the pile down, so the
         card you can actually see is the one that leads; and
         closing runs the other way, so that same card is the
         last thing to land. Which is what a pile IS: the top
         card is on top because it arrived last. Reversing the
         order is the same mechanism read backwards, not a
         second one. */
      const place = on ? n - 1 - i : i;
      const at = Math.max(0, gap * (place + SEED[i].beat * sc * 0.6));
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
  }, [on, n, sc, still]);

  /* Six, always, whatever `count` says: a hook cannot be drawn
     conditionally, and a spring nobody reads costs a number
     that never moves. Each one is a little livelier or heavier
     than the knob asks for — see SEED — which is what stops
     six cards arriving on the same frame. */
  const tune = (i: number) => clamp(bounce * (1 + SEED[i].tune * sc * 0.45), 0, 100);
  const s0 = useSpring(lit[0] ? 100 : 0, tune(0), still);
  const s1 = useSpring(lit[1] ? 100 : 0, tune(1), still);
  const s2 = useSpring(lit[2] ? 100 : 0, tune(2), still);
  const s3 = useSpring(lit[3] ? 100 : 0, tune(3), still);
  const s4 = useSpring(lit[4] ? 100 : 0, tune(4), still);
  const s5 = useSpring(lit[5] ? 100 : 0, tune(5), still);
  const at = [s0, s1, s2, s3, s4, s5];

  /* ── the fan is a WIDTH, not a gap between cards ───────────
     Spread sets the whole arc and the cards divide it, so
     turning Cards up packs more into the same fan instead of
     growing the block. The alternative — a fixed angle per
     card — is the version whose box changes size when you
     change the count, which on a wall that scales what it
     measures means the block redraws itself smaller as you
     add a card.

     And the floor is 10 degrees rather than 0. A Spread knob
     whose bottom end is a stack that does not open is a knob
     with a broken setting on it; 10 is a deck squaring itself
     up and just showing its edges, which is a thing. */
  const arc = 10 + (clamp(spread, 0, 100) / 100) * (ARC - 10);
  const step = arc / (n - 1);

  /* ── the open fan's own footprint, and a little air ────────
   The pad used to grow to the whole stage once the fan was out,
   and the stage is sized for the widest fan the knobs can make —
   so at the default you had to travel well clear of the cards
   before the deck folded. Now it is the fan as it is drawn: the
   end cards' outer corners, the lifted card's top, the arc's
   drop below, plus PAD all round. Cards overlap, so there is no
   gap inside it to fall through. */
  const PAD = 14;
  const half = rad((arc / 2) * (1 + RAGGED * sc));
  const fanX = PIVOT * Math.sin(half) + (CARD_W * Math.cos(half) + CARD_H * Math.sin(half)) / 2;
  const fanTop = ABOVE - CARD_H / 2 - LIFT;
  const fanBottom = ABOVE + (CARD_W * Math.sin(half) + CARD_H * Math.cos(half)) / 2 + PIVOT * (1 - Math.cos(half));
  const fanPad = {
    left: STAGE_W / 2 - fanX - PAD,
    top: fanTop - PAD,
    width: (fanX + PAD) * 2,
    height: fanBottom - fanTop + PAD * 2,
  };

  return (
    <div
      ref={root}
      className="stk"
      data-viewing={view ? "" : undefined}
      data-shuffle={shuffle ? "" : undefined}
      style={
        {
          width: STAGE_W,
          height: STAGE_H,
          "--stk-lift": `${LIFT}px`,
          "--stk-r": `${clamp(corner, 0, CARD_W / 2)}px`,
          "--stk-vr": `${((clamp(corner, 0, CARD_W / 2) * VIEW_W) / CARD_W).toFixed(2)}px`,
          /* the lift rides a CSS transition rather than a
             spring of its own, which is the pattern the
             magnetic select writes down: a rule on the same
             element as a spring is two animations arguing over
             one property. It is a separate element and a
             separate property — `translate`, not `transform` —
             so the two cannot meet. A soft ease with no
             overshoot (2026-11-06): the lift used to ride the
             Bounce curve and read as a card jumping out of the
             fan rather than being drawn from it. */
          "--stk-ease": still ? "linear" : "cubic-bezier(0.4, 0, 0.2, 1)",
        } as React.CSSProperties
      }
      /* ── `over`/`out`, not `enter`/`leave` ────────────────
         The wrapper is 347px across and the pile is 120 of
         them, so most of this box is air the fan has not
         reached yet. Air must not open anything — the block
         would spread from a cursor that was on its way
         somewhere else — so the wrapper takes no pointer
         events at all and the two things inside it that are
         real, the hit pad and the cards, take them back.

         Which means the handlers have to be on an event that
         BUBBLES from those children, and enter/leave do not.
         The containment test is what turns `out` back into
         `leave`, and it is also the version that survives the
         rehearsal: a scripted pointer's last beat walks off
         carrying `relatedTarget: null`, which React never
         turns into a leave. */
      onPointerOver={() => {
        if (!hover) {
          setHover(true);
        }
      }}
      onPointerOut={(e) => {
        const to = e.relatedTarget as Node | null;
        if (to && e.currentTarget.contains(to)) return;
        /* folding back to rest is silent (2026-11-06) */
        setHover(false);
        setNear(null);
      }}
      onPointerCancel={() => {
        setHover(false);
        setNear(null);
      }}
    >
      {/* ── what you have to be touching ─────────────────────
          Shut, it is the pile and a little air round it, so
          the block opens when you reach the cards rather than
          when you enter the tile. Open, it is the whole stage,
          so crossing the fan — which is most of the stage by
          then — never falls through a gap between two cards
          and folds the thing away under your cursor.

          Behind the cards, so a card is always the thing you
          are over when you are over one. */}
      <span
        className="stk-hit"
        aria-hidden="true"
        /* ── and it is what says NO card is being drawn ─────
           A card raises itself on its own pointerenter, and
           nothing in that tells it when the pointer has moved
           off onto bare stage — leave/enter pairs between two
           cards race, and the one that loses leaves a card
           standing out of a fan nobody is pointing at. The pad
           is behind every card, so being over it is the
           definition of not being over one. */
        onPointerOver={() => setNear(null)}
        style={
          on
            ? fanPad
            : {
                left: (STAGE_W - CARD_W) / 2 - 10,
                top: ABOVE - CARD_H / 2 - PILE - 10,
                width: CARD_W + 20,
                height: CARD_H + PILE + 20,
              }
        }
      />

      {Array.from({ length: n }, (_, i) => {
        const u = at[i] / 100;
        /* 0 at the back of the pile, n-1 on top */
        const back = n - 1 - i;
        const c = i - (n - 1) / 2;

        /* where it sits shut, and where it sits open. One
           number each, and the card is somewhere between them
           on its own spring. */
        const openRot = c * step + SEED[i].rot * sc * RAGGED * step;
        const shutRot = c * step * REST + SEED[i].rot * sc * SHUT_ROT * 0.6;
        const shutX = SEED[i].dx * sc * SHUT_OFF;
        const shutY = -back * DEEP + SEED[i].dy * sc * SHUT_OFF;

        const id = deck[back];
        const lift = on && near === i && !view;
        const rot = mix(shutRot, openRot, u);
        const recede = 1 - back * SINK * (1 - u);
        poses.current[i] = { rot, scale: recede };

        return (
          <span
            key={id}
            className="stk-card"
            style={{
              left: (STAGE_W - CARD_W) / 2,
              top: ABOVE - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              /* the hand, 200px below the card's middle. Every
                 card turns about the same point, which is what
                 makes this a fan rather than six cards that
                 happen to be rotated. */
              transformOrigin: `50% ${CARD_H / 2 + PIVOT}px`,
              /* rotate about that point, then nudge — so the
                 scatter is a real offset in the block's own
                 axes and not a second, tinier rotation */
              transform: `translate(${mix(shutX, 0, u).toFixed(2)}px, ${mix(
                shutY,
                0,
                u,
              ).toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`,
              /* out of the deck while it is in view; it is still
                 measured, so the flight home finds its place */
              visibility: view?.id === id ? "hidden" : undefined,
              /* ── AND THE LIFTED CARD DOES NOT COME FORWARD ─
                 It did, and it is the one thing here that was
                 measured wrong. Raising the card under the
                 pointer to the front of the stack looks
                 correct on the card at the right-hand end and
                 is a disaster on any other: in a fan every
                 card overlaps the one to its right, so
                 bringing the leftmost one forward drew it over
                 the three beside it and the fan became two
                 cards and a hidden pile.

                 The lift is enough on its own, and it is also
                 the truthful version. The card slides out
                 along its own axis, so it clears the top edges
                 of its neighbours by exactly the distance it
                 travelled — a card being drawn up out of a
                 hand, which is a thing that happens without
                 anybody reshuffling the deck. */
              zIndex: i,
            }}
            onPointerEnter={() => {
              if (near === i) return;
              setNear(i);
              /* the dock's note: a sound with `at` on it turns
                 running across a set into a scale rather than
                 a row of identical clicks */
            }}
            /* on the press, not the click: a first press often
               lands while the fan is still opening, the card turns
               out from under the pointer before the release, and
               a click needs both on the same element */
            onPointerDown={(e) => {
              if (e.button === 0) open(i);
            }}
          >
            <span
              ref={(el) => { faces.current[i] = el; }}
              className="stk-face"
              data-lift={lift || undefined}
              style={{
                /* the recession, and it is on the FACE rather
                   than on the card: every transform in one
                   declaration shares one origin, and this
                   card's origin is 200px below it — a scale
                   about that point would fling the card across
                   the block instead of shrinking it.

                   `scale` is its own property, so it can sit
                   beside a transitioned `translate` without
                   either touching the other. It is gone by the
                   time the fan is open, because six cards side
                   by side are six of the same card. */
                scale: recede,
              }}
            >
              <img className="stk-img" src={PHOTOS[id % PHOTOS.length]} alt="" draggable={false} />
            </span>
          </span>
        );
      })}

      {view && (
        <span
          ref={flyer}
          className="stk-view"
          role="img"
          aria-label="Card in view; click outside or press Escape to put it back"
          style={{
            left: (STAGE_W - VIEW_W) / 2,
            top: (STAGE_H - VIEW_H) / 2,
            width: VIEW_W,
            height: VIEW_H,
            transform: view.from,
          }}
          /* ── a slight tilt under the pointer ──────────────────
             The point you are over sinks away and the far side
             comes up, the bench's tilt card in miniature (TILT
             degrees at the very edge). It is on an inner layer:
             the flyer's own transform belongs to the flight.
             Inside a card turned over (rotateY 180) the X axis
             runs backwards, so rotateX takes +ny where the tilt
             card takes -ny; rotateY is unaffected */
          onPointerMove={(e) => {
            const t = tilt.current;
            if (!t || closing.current || still) return;
            const r = e.currentTarget.getBoundingClientRect();
            const nx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
            const ny = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
            t.style.transform = `rotateX(${(ny * TILT).toFixed(2)}deg) rotateY(${(nx * TILT).toFixed(2)}deg)`;
          }}
          onPointerLeave={() => {
            if (tilt.current) tilt.current.style.transform = "";
          }}
        >
          <span ref={tilt} className="stk-view-tilt">
            {/* a face each side, both the photograph */}
            <span className="stk-view-face">
              <img className="stk-img" src={PHOTOS[view.id % PHOTOS.length]} alt="" draggable={false} />
            </span>
            <span className="stk-view-face" data-back="">
              <img className="stk-img" src={PHOTOS[view.id % PHOTOS.length]} alt="" draggable={false} />
            </span>
          </span>
        </span>
      )}
    </div>
  );
}
