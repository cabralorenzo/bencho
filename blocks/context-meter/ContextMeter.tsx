import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ══ Context meter ════════════════════════════════════════
   A model's context window as a field of dots, one per thousand
   tokens. Each kind of content fills its own band, column by column,
   in its own strength of ink, and the empty room is a faint grid.
   Point at a chip, or at any dot, and that kind lights while the rest
   fall back, and the big number rolls to its share. Compact folds the
   conversation down: its dots go out in a ripple from the far end,
   the bands after it close up, and the count rolls down with them.

   ── EVERY DOT IS AN INDEX ───────────────────────────────
   Dot i belongs to whichever kind's running total it falls inside,
   so a dot never moves: compacting changes which kind each index
   belongs to, and the colour change is the animation. A delay that
   grows along the indices that changed makes it a ripple rather
   than a cut.

   ── THE FIGURE POPS IN ──────────────────────────────────
   The Price flow block's number pop-in, recycled: a digit that
   changes rises a hair out of a 2px blur and lands a touch past
   its mark, left to right 70ms apart — from below when the figure
   grows, from above when it shrinks. Every digit is keyed by its
   place and its value, so one that did not change never moves. */

type Kind = { id: string; name: string; k: number };
const KINDS: Kind[] = [
  { id: "sys", name: "System", k: 4.2 },
  { id: "tools", name: "Tools", k: 12.8 },
  { id: "files", name: "Files", k: 46.1 },
  { id: "chat", name: "Chat", k: 108.6 },
  { id: "mem", name: "Memory", k: 3.9 },
];
const CHAT_COMPACT = 30.4;
const WINDOW = 200;
/* 200 dots, one per thousand: 20 across, 10 down, each an exact
   11 by 11 on a 3px gap, so every one is the same true square */
const COLS = 20;
const ROWS = 10;
const DOT_W = 11;
const DOT_H = 11;
const GAP = 3;
export type MeterStyle = "Field" | "Bar";

const fmt = (k: number) => `${k.toFixed(1)}K`;

function Roll({ text, up }: { text: string; up: boolean }) {
  const chars = text.split("");
  /* places counted from the right, so a new leading digit does not
     shift the keys of the ones already there */
  return (
    <span className="ctx-roll" aria-hidden="true">
      {chars.map((c, i) => {
        const place = chars.length - 1 - i;
        if (!/[0-9]/.test(c)) return <span key={`s${place}`} className="ctx-sym">{c}</span>;
        return (
          <span key={`p${place}`} className="ctx-wheel">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={c}
                className="ctx-digit"
                initial={{ y: up ? "0.18em" : "-0.18em", opacity: 0, filter: "blur(2px)" }}
                animate={{ y: "0em", opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(2px)", transition: { duration: 0.16 } }}
                transition={{ duration: 0.5, ease: [0.34, 1.45, 0.64, 1], delay: i * 0.07 }}
              >
                {c}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}

/* biggest first, as it stands before compacting: the order of the
   field, the bar and the chips alike. Fixed, so Compact shrinks the
   chat in place rather than reshuffling the bands */
const ORDER = KINDS.map((_, i) => i).sort((a, b) => KINDS[b].k - KINDS[a].k);

/* which kind each dot is, before and after compacting: running
   totals, a dot per thousand. Both are fixed, so the dots that
   differ between them — and so the ripple's delays — are too */
const ownersFor = (sizes: number[]) => {
  const out: (number | null)[] = [];
  ORDER.forEach((ci) => {
    for (let j = 0; j < Math.round(sizes[ci]) && out.length < WINDOW; j++) out.push(ci);
  });
  while (out.length < WINDOW) out.push(null);
  return out;
};
const OWNERS = [
  ownersFor(KINDS.map((c) => c.k)),
  ownersFor(KINDS.map((c) => (c.id === "chat" ? CHAT_COMPACT : c.k))),
];
const FIRST = OWNERS[0].findIndex((o, i) => o !== OWNERS[1][i]);
const LAST = OWNERS[0].reduce<number>((l, o, i) => (o !== OWNERS[1][i] ? i : l), FIRST);
/* the whole ripple fits inside the compact sound's squeeze: every dot
   that changes has started by RIPPLE ms, so the swap lands with the
   knock at ~280 rather than trailing on for a second after it.
   1 rather than 0 for the first, since 0 reads as "unchanged" */
const RIPPLE = 220;
const DELAY = OWNERS[0].map((o, i) => (o !== OWNERS[1][i] ? 1 + Math.round(((i - FIRST) / (LAST - FIRST || 1)) * RIPPLE) : 0));

/* the bar's corners: OUTER at its two ends, INNER where pieces meet */
const OUTER = 6;
const INNER = 2;
const corners = (first: boolean, last: boolean) => ({
  borderTopLeftRadius: first ? OUTER : INNER,
  borderBottomLeftRadius: first ? OUTER : INNER,
  borderTopRightRadius: last ? OUTER : INNER,
  borderBottomRightRadius: last ? OUTER : INNER,
});

export function ContextMeter({
  /* a field of dots, or one stacked bar */
  style = "Bar",
  /* the five hues, or strengths of the ink */
  colour = "Colour",
}: {
  style?: MeterStyle;
  colour?: "Colour" | "Mono";
} = {}) {
  const [compact, setCompact] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const sizes = KINDS.map((c) => (c.id === "chat" && compact ? CHAT_COMPACT : c.k));
  const used = sizes.reduce((a, b) => a + b, 0);

  const owner = OWNERS[compact ? 1 : 0];
  const was = OWNERS[compact ? 0 : 1];
  /* the swap only plays once Compact has been pressed: on first paint
     there is nothing to swap from */
  const [moved, setMoved] = useState(false);
  /* the big number rolls toward whatever it is showing */
  const hotKind = hot ? KINDS.findIndex((c) => c.id === hot) : -1;
  const target = hotKind >= 0 ? sizes[hotKind] : used;
  /* which way the wheels turn: up for more, down for less */
  const last = useRef(target);
  const up = useRef(true);
  if (target !== last.current) { up.current = target > last.current; last.current = target; }

  return (
    <div
      className="ctx"
      data-hot={hot || undefined}
      data-mono={colour === "Mono" || undefined}
      onPointerLeave={() => setHot(null)}
    >
      {/* only what reads at a glance: the name, and the one action */}
      <div className="ctx-head">
        <span className="ctx-title">Context</span>
        <button type="button" className="ctx-act" data-quiet={compact || undefined} onClick={() => { setMoved(true); setCompact((v) => !v); }}>
          {compact ? "Undo" : "Compact"}
        </button>
      </div>
      <div className="ctx-figure" aria-live="polite">
        <span className="ctx-num">
          <span className="ctx-sr">{fmt(target)}</span>
          <Roll text={fmt(target)} up={up.current} />
        </span>
        <span className="ctx-of">{hotKind >= 0 ? KINDS[hotKind].name : `of ${WINDOW}K`}</span>
      </div>
      {style === "Bar" ? (
        /* the bar: one segment per kind, as wide as its share, and the
           room left as a faint tail. Compact eases the chat's width */
        /* leaving the field, not the card, is what puts the total back */
        /* ── COMPACT SQUEEZES, IT DOES NOT RESHUFFLE ──────────
           The order is the uncompacted one, biggest first, and it
           never changes: re-sorting made the chat and the files
           cross each other mid-move. The widths are real flex-grow
           transitions rather than a layout scale, so the corners
           stay true every frame; the chat gives a squeeze as it
           folds, and a softer one runs down the bar after it.
           `data-wave` flips a/b on every press, which is what
           restarts the keyframes. */
        <div
          className="ctx-bar"
          aria-hidden="true"
          data-wave={moved ? (compact ? "a" : "b") : undefined}
          onPointerLeave={() => setHot(null)}
        >
          {ORDER.map((ci, n) => {
            const c = KINDS[ci];
            return (
              <i
                key={c.id}
                className="ctx-seg"
                data-kind={c.id}
                data-dim={hot !== null && c.id !== hot || undefined}
                /* the bar is one rounded shape cut into pieces: round at
                   its two ends, nearly square where two pieces meet */
                style={{
                  flexGrow: sizes[ci],
                  ...corners(n === 0, false),
                  "--ctx-wave": `${n * 55}ms`,
                  "--ctx-give": c.id === "chat" ? 0.78 : 0.93,
                } as React.CSSProperties}
                onPointerEnter={() => setHot(c.id)}
              />
            );
          })}
          <i
            className="ctx-seg ctx-seg-room"
            style={{ flexGrow: WINDOW - used, ...corners(false, true) }}
            data-dim={hot !== null || undefined}
            onPointerEnter={() => setHot(null)}
          />
        </div>
      ) : (
        <div
          className="ctx-grid"
          /* the field gives under the press as the bar does, its
             floor on the sound's knock */
          data-wave={moved ? (compact ? "a" : "b") : undefined}
          style={{
            /* fixed tracks, not fractions: a fraction lands each column on
               its own sub-pixel, and neighbouring squares round to
               different sizes */
            gridTemplateRows: `repeat(${ROWS}, ${DOT_H}px)`,
            gridTemplateColumns: `repeat(${COLS}, ${DOT_W}px)`,
            gap: GAP,
          }}
          aria-hidden="true"
          onPointerLeave={() => setHot(null)}
        >
          {owner.map((o, i) => (
            <i
              /* a dot that changes kind is a new element, so its swap
                 animation starts again; the rest keep theirs */
              key={moved && DELAY[i] ? `${i}${compact ? "+" : "-"}` : i}
              className="ctx-dot"
              data-kind={o === null ? undefined : KINDS[o].id}
              data-swap={moved && DELAY[i] ? (o === null ? "drain" : "fill") : undefined}
              data-dim={hot !== null && (o === null || KINDS[o].id !== hot) || undefined}
              style={DELAY[i] ? ({
                transitionDelay: `${DELAY[i]}ms`,
                animationDelay: `${DELAY[i]}ms`,
                "--was": was[i] === null ? "var(--ctx-empty)" : `var(--k-${KINDS[was[i]!].id})`,
                "--now": o === null ? "var(--ctx-empty)" : `var(--k-${KINDS[o].id})`,
              } as React.CSSProperties) : undefined}
              onPointerEnter={() => setHot(o === null ? null : KINDS[o].id)}
            />
          ))}
        </div>
      )}
      <div className="ctx-chips" onPointerLeave={() => setHot(null)}>
        {ORDER.map((ci) => KINDS[ci]).map((c) => (
          <button
            key={c.id}
            type="button"
            className="ctx-chip"
            data-on={hot === c.id || undefined}
            onPointerEnter={() => setHot(c.id)}
            onFocus={() => setHot(c.id)}
            onBlur={() => setHot(null)}
          >
            <i className="ctx-swatch" data-kind={c.id} />
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
