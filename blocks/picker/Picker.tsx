import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

/* ══ Assignees ════════════════════════════════════════════
   A pill that opens a list, and fills up with faces as you
   assign them. One, two, four — the pill grows to hold them
   and they overlap into a stack rather than a row.

   It was called "People picker", which named the widget
   rather than the job. What this is FOR is putting names
   against a thing — assigning a task, adding contributors —
   and the pill is the answer to "who is on this".

   THE PILL IS THE READOUT. There is no count badge and no
   "3 selected" caption: the faces themselves say who, which
   is the thing a person actually wants back. A number tells
   you how many you picked; a stack of faces tells you whether
   you picked the right ones. */

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

/* ── the cast ──────────────────────────────────────────────
   The same four pictures the rest of the bench uses — there
   are only four in avatars.ts and every block that needs
   people draws from them — under names of their own, which is
   what the selection list and the reorder list both do. Four
   blocks sharing one set of names would read as one dataset
   being shown four ways rather than four components. */
/* The names follow the PICTURES. avatars.ts keys are `kai`,
   `mara`, `sofia`, `ines` and none of them describes who is in
   the photograph — the reorder list and the selection list use
   the same four faces under different names, so the key is a
   slot rather than a person. Checked against the images at
   size rather than off the thumbnails: two men, two women. */
/* the faces are the Sounds wall's soft radial orbs (2026-11-25), in
   place of the photographs: one look each, picked to sit apart */
const ORB: Record<string, string> = { kai: RADIAL[10], mara: RADIAL[2], sofia: RADIAL[3], ines: RADIAL[5] };
const CAST = [
  { id: "kai", name: "Adam Marsh", role: "Design" },
  { id: "mara", name: "Priya Raman", role: "Research" },
  { id: "sofia", name: "Nora Wilder", role: "Engineering" },
  { id: "ines", name: "Marco Bellini", role: "Product" },
];

/* the block's own box. Reserved for the list OPEN, so closing
   it does not resize the card underneath — the same bargain
   the selection list makes, and for the same reason: a block
   that changes height when you press it makes the wall jump. */
const W = 264;
const H = 268;

/* the faces in the pill */
const FACE = 28;
const CORNER = 20;
/* how much of each face the next one covers, px */
const LAP = 10;

/* ── the other way to stack ────────────────────────────────
   A row of overlapping faces is the honest default: it says
   who, in order, and it grows sideways as you add people. But
   it grows sideways, and a pill in a dense toolbar cannot
   always afford that.

   So the second arrangement packs the same four into the
   footprint of ONE. Nothing overlaps — that is the whole point
   of it, and the reason it is not simply "a tighter row". A
   row hides parts of faces behind other faces; the quad shows
   all of every face and pays for it in size.

   The box is FACE across whatever the count, so the pill in
   this mode does not grow at all. That is the trade the mode
   exists to make, and drawing one face big and four faces
   small is what makes it visible: the box does not fill up,
   it SUBDIVIDES.

   Three is the awkward count. It fills reading order and
   leaves the last cell empty, which looks like a gap and is
   actually the point: the quad is a fixed set of four slots,
   and three people occupy three of them. Centring the odd one
   balances the picture but breaks the grid — the face lands
   where no cell is, and adding the fourth person then shunts
   it sideways for no reason the eye can name. */
const quad = (n: number, gut: number) => {
  const cell = (FACE - gut) / 2;
  const s = cell / FACE;
  const a = cell / 2;          /* centre of the near cell */
  const b = FACE - cell / 2;   /* centre of the far one */
  const m = FACE / 2;
  if (n <= 1) return [{ cx: m, cy: m, s: 1 }];
  if (n === 2) return [{ cx: a, cy: m, s }, { cx: b, cy: m, s }];
  if (n === 3) return [{ cx: a, cy: a, s }, { cx: b, cy: a, s }, { cx: a, cy: b, s }];
  return [
    { cx: a, cy: a, s }, { cx: b, cy: a, s },
    { cx: a, cy: b, s }, { cx: b, cy: b, s },
  ];
};

export function Picker({
  /* the pill's corner and the card's, px */
  corner = CORNER,
  /* how far the faces overlap, px — 0 is a row of separate
     circles, which is a real answer and not a broken one */
  overlap = LAP,
  /* "Row" or "Grid" — see quad() above */
  stack = "Row",
}: {
  corner?: number;
  overlap?: number;
  stack?: string;
} = {}) {
  /* open, and with two already chosen. A picker drawn shut is
     a pill with a word in it: true of the component and
     useless as a picture of it. This is the state worth
     landing on — the pill doing its job and the list showing
     why. */
  const [open, setOpen] = useState(true);
  const [picked, setPicked] = useState<string[]>(["kai", "mara"]);

  const r = clamp(corner, 0, 26);
  const lap = clamp(overlap, 0, 22);
  const grid = stack === "Grid";

  /* Overlap still means something in the quad, because a knob
     that goes dead in half the modes is a knob you have to
     explain. It reads as PACKING there rather than as covering:
     4px of air at nought, 2px at full. It never reaches zero —
     "they never touch" is the arrangement's one promise, and a
     slider is not allowed to break it. */
  const spots = quad(picked.length, 4 - (lap / 22) * 2);

  /* ── the width is COMPUTED, not measured ─────────────────
     Framer's `layout` would animate this by measuring screen
     rectangles, and every block on this bench is drawn at a
     fraction of its own size — see Gooey.tsx. A width worked
     out from the count is the same number at any zoom, and CSS
     can transition it without knowing where the block is. */
  const rail = !picked.length
    ? 0
    : grid
      /* one face wide at every count — the quad's whole bargain */
      ? FACE
      : FACE + (picked.length - 1) * (FACE - lap);

  /* ── IT DOES NOT CLOSE ON AN OUTSIDE PRESS ───────────────
     It did, and that is the right behaviour for a dropdown in
     an application — the note that used to be here called it
     the one thing every dropdown has to do. It is the wrong
     behaviour for a block on this wall.

     Measured: one real click anywhere on the page collapsed
     the list, and nothing brought it back — so the card spent
     the rest of the session showing a pill and nothing else,
     which is a demonstration of a third of the component. The
     same class of fault as a demo that leaves a toggle on.

     The pill is still the toggle, so it is still dismissible
     by the person actually using it. What is gone is the case
     where something you did to a DIFFERENT block put this one
     away.

     Anyone lifting this into a real interface wants the
     listener back; it is four lines and the reason it is not
     here is the wall, not the pattern. */

  const toggle = (id: string) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  return (
    <div
      className="pik"
      style={{
        width: W,
        height: H,
        /* ── concentric, and it follows the knob ───────────
           The row's hover pad was a flat 12 against a card cut
           at 22, which reads squarer than the box holding it.
           The rule the rest of this bench uses is the radius
           of a thing inside another, LESS the gap between them
           — the card's 6px padding here — so 22 gives 16.

           Published from here rather than written in the
           stylesheet because the card's corner is a knob: at 0
           the pair is square together and at 26 both are as
           round as they go, instead of the pad being right at
           one setting and wrong at the rest. */
        "--pik-row-r": `${Math.max(0, r - 6)}px`,
      } as React.CSSProperties}
    >
      <button
        className="pik-pill"
        style={{ borderRadius: r }}
        onClick={() => { setOpen((v) => !v); }}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {/* ── the faces ─────────────────────────────────────
            Absolutely placed inside a rail whose width is the
            arithmetic above, so the pill grows and shrinks by
            one CSS transition rather than by anything watching
            the DOM.

            Reversed z-order: the first face sits on top of the
            second, so the stack reads left to right the way the
            list does. Painted the other way the newest arrival
            covers everyone before it, and adding a fourth
            person looks like losing the first three. */}
        <span className="pik-rail" style={{ width: rail }}>
          <AnimatePresence initial={false}>
            {picked.map((id, i) => {
              /* ── EVERY face is placed by its transform ─────
                 It used to ride on `left`, which cannot carry
                 the quad: that one needs a size and two axes,
                 and a face swapping arrangements has to travel
                 rather than teleport. One vector and one scale
                 describe both layouts, so switching modes is
                 the same animation as arriving. */
              const spot = grid ? spots[Math.min(i, spots.length - 1)] : null;
              const tx = spot ? spot.cx - FACE / 2 : i * (FACE - lap);
              const ty = spot ? spot.cy - FACE / 2 : 0;
              const sc = spot ? spot.s : 1;
              return (
              <motion.span
                key={id}
                className="pik-face"
                style={{ zIndex: CAST.length - i }}
                /* ── a face lands, it does not fade in ──────
                   It drops from slightly above with a turn on
                   it and overshoots on the way to rest, so
                   adding somebody reads as a token being put
                   down. Leaving is the same move backwards and
                   quicker — you are removing a name, not
                   watching an animation.

                   The rotation is small and it is the reason
                   this feels different from a scale: a circle
                   scaling is a circle, and a circle scaling
                   while it turns is an object.

                   The drop lands at `ty`, not at nought, and
                   the pop lands at `sc`, not at one: in the
                   quad a face's rest is wherever its cell is
                   and however big its cell is. */
                initial={{ scale: 0.2 * sc, opacity: 0, x: tx, y: ty - 10, rotate: -22 }}
                animate={{ scale: sc, opacity: 1, x: tx, y: ty, rotate: 0 }}
                exit={{ scale: 0.2 * sc, opacity: 0, x: tx, y: ty - 6, rotate: 14 }}
                /* ── two springs, and the reason is the knob ──
                   Position and size are also what the Overlap
                   slider moves, and a slider wants a follower,
                   not a bouncer: dragged to an end, a 0.48-zeta
                   spring wobbles for a third of a second after
                   the thumb has stopped. So x, y and scale get
                   a tight one that tracks.

                   Rotate keeps the loose spring, and it is the
                   half that was carrying the character anyway —
                   the face still rocks past level as it sets
                   down. Nothing drags the rotation, so nothing
                   is waiting on it. */
                transition={{
                  type: "spring", stiffness: 500, damping: 18, mass: 0.8,
                  x: { type: "spring", stiffness: 380, damping: 34, mass: 0.7 },
                  y: { type: "spring", stiffness: 380, damping: 34, mass: 0.7 },
                  scale: { type: "spring", stiffness: 380, damping: 34, mass: 0.7 },
                  opacity: { duration: 0.16 },
                }}
              >
                <span className="pik-orb" style={{ background: ORB[id] }} />
              </motion.span>
              );
            })}
          </AnimatePresence>
        </span>

        {/* ── what the pill says with nothing in it ────────
            It said "Assign", which is an instruction — and the
            pill is a READOUT: with faces in it, it reports who
            is on this, so with none in it, it should report
            that nobody is. One word, the state rather than the
            verb, and it goes the moment there is a face,
            because a label beside three pictures is the control
            describing itself instead of answering. */}
        {picked.length === 0 && <span className="pik-say">Unassigned</span>}

        <ChevronDown className="pik-chev" size={16} strokeWidth={2} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="pik-card"
            style={{ borderRadius: r }}
            role="listbox"
            aria-multiselectable="true"
            /* ── it unfolds OUT OF the pill ──────────────────
               The origin is the card's top-left, which is the
               pill's own left edge, so it opens down and out
               from the corner it belongs to rather than growing
               from its middle like a box appearing.

               NOT a goo morph, and that was considered first:
               the reorder list took the metaball out from
               between its card and its button for the reason
               that applies here too — two separate objects
               joined by a bridge read as welded, not as one
               opening. A metaball is for a single body changing
               shape, which is also why the faces do not get one:
               they are photographs, and the filter thresholds
               alpha.

               The scale starts high — 0.86 across, 0.72 down —
               because a card is a rounded rectangle and a scale
               drags its corner radius with it. From a third of
               its height the corners arrive visibly squashed;
               from three quarters, with the spring doing the
               work, they do not. The BOUNCE is where the
               character is, not the distance. */
            initial={{ opacity: 0, y: -10, scaleX: 0.86, scaleY: 0.72 }}
            animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleX: 0.92, scaleY: 0.86 }}
            transition={{
              /* zeta about 0.63 — it goes past and comes back,
                 which is the whole of "bubbly" */
              type: "spring", stiffness: 500, damping: 18, mass: 0.9,
              opacity: { duration: 0.16 },
            }}
          >
            {CAST.map((p) => {
              const on = picked.includes(p.id);
              return (
                <motion.button
                  key={p.id}
                  className="pik-row"
                  role="option"
                  aria-selected={on}
                  data-on={on || undefined}
                  onClick={() => toggle(p.id)}
                  /* they deal out under the card rather than
                     arriving with it — four rows appearing at
                     once is a panel, four arriving in order is
                     a list being handed to you. Fast and close
                     together: 40ms apart is a stagger you feel
                     rather than one you wait through. */
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring", stiffness: 380, damping: 34, mass: 0.7,
                    delay: 0.04 * CAST.indexOf(p) + 0.03,
                  }}
                >
                  <span className="pik-av" style={{ background: ORB[p.id] }} />
                  <span className="pik-who">
                    <span className="pik-name">{p.name}</span>
                    <span className="pik-role">{p.role}</span>
                  </span>
                  {/* the box is always drawn; only the tick
                      arrives. A mark that appears WITH its own
                      container reads as the row growing a
                      control, rather than as the control being
                      answered */}
                  <span className="pik-mark">
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          className="pik-tick"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 18, mass: 0.6 }}
                        >
                          <Check size={14} strokeWidth={2} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
