import { useLayoutEffect, useRef, useState } from "react";
import { Bookmark, Folder, House, Search, User } from "lucide-react";

type Item = { key: string; label: string; Icon: typeof House };

/* the dock's set; the icon bar (GlassIconBar.tsx) carries the same
   five: they are the same navigation in two different materials */
const DOCK: Item[] = [
  { key: "home", label: "Home", Icon: House },
  { key: "search", label: "Search", Icon: Search },
  { key: "files", label: "Files", Icon: Folder },
  { key: "saved", label: "Saved", Icon: Bookmark },
  { key: "you", label: "You", Icon: User },
];

/* ══ dock, distance based magnification ═══════════════════
   Scale falls off with distance from the cursor rather than
   applying only to the hovered item, which is what stops it
   reading as a row of buttons that happen to grow. */

export function GlassDock({
  /* what the glyph under the cursor grows to */
  magnify = 1.32,
  /* how many neighbours either side feel it. This is the knob
     that decides whether the dock reads as a row of buttons
     that happen to grow or as a sheet being pushed up from
     underneath — at 0 it is the former, and no amount of
     magnification rescues it. */
  spread = 2,
  /* how far the nearest glyph rises out of the bar */
  lift = 8,
  /* the name that appears over whatever is under the cursor */
  labels = true,
}: {
  magnify?: number;
  spread?: number;
  lift?: number;
  labels?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [active, setActive] = useState(DOCK[0].key);

  /* ── THE BAR READS THE POINTER, THE ITEMS DO NOT ─────────
     Each item used to carry its own onMouseEnter, which fails
     on a touch screen twice over. A mouse event is the smaller
     half of it — the real problem is that a touch is captured
     to whatever it started on, so sliding a finger along the
     dock keeps sending every event to the first icon you
     landed on and nothing else ever learns the finger arrived.

     One handler on the bar, and the index comes from where the
     pointer is: the nearest item centre to the pointer's x.
     Measured rather than derived from the index, because the
     items are not all the same width once one of them is
     magnified — the geometry moves as you sweep, which is
     exactly what makes a dock a dock, and an arithmetic guess
     would lag it. */
  const bar = useRef<HTMLElement | null>(null);
  const down = useRef(false);
  /* set when a finger has already chosen on lift, so the click
     the browser sends afterwards — aimed at whichever item the
     touch STARTED on, which is not the one it ended over — does
     not undo the choice. A mouse never sets it. */
  const chose = useRef(false);

  const at = (clientX: number) => {
    const items = bar.current?.querySelectorAll(".gdock-item");
    if (!items?.length) return null;
    let best = 0;
    let gap = Infinity;
    items.forEach((el, i) => {
      const b = el.getBoundingClientRect();
      const d = Math.abs(clientX - (b.left + b.width / 2));
      if (d < gap) { gap = d; best = i; }
    });
    return best;
  };

  /* Crossing onto a glyph, not hovering one: a sound on hover
     fires on every pixel of a sweep. Quiet, floored, and
     pitched by position so running along the dock is a scale. */
  const to = (i: number | null) => {
    setHover((_was) => {
      return i;
    });
  };

  const track = (e: React.PointerEvent) => {
    /* a mouse magnifies on hover, the way it always did; a
       finger has to be down, or the bar would answer a scroll
       passing over it */
    if (e.pointerType !== "mouse" && !down.current) return;
    to(at(e.clientX));
  };

  return (
    <nav
      className="gdock"
      aria-label="Dock"
      ref={bar}
      /* ── CAPTURE PHASE, and no pointer capture ───────────
         Two different things with confusingly similar names.

         The phase is capture because each item stops
         pointerdown propagating — it has to, or the wall card
         behind it treats a press on the dock as a press on the
         card. Bubbling handlers here never ran: measured, the
         magnification sat on item 0 through a full sweep.
         Capture runs top-down, before the child can stop it.

         What this does NOT do is call setPointerCapture. The
         touch is already captured to the item it began on
         whether we ask or not, and those events reach here
         with their real coordinates, which is all this needs.
         Capturing on the bar as well would retarget the click
         and take it from the item — breaking the mouse to fix
         the finger. */
      onPointerDownCapture={(e) => {
        down.current = true;
        /* ── disarmed HERE, not by the click ────────────────
           `chose` used to be cleared by the click it was meant
           to swallow, which assumes a click always follows a
           touch. It does not: a finger that lands on one item
           and lifts over another is a drag, and a browser is
           entitled to send no click at all. Measured — the flag
           stayed armed and ate the next real mouse click, so
           the dock ignored the first thing you pressed after
           any touch sweep. Cleared at the start of the next
           gesture instead, which is true whatever the browser
           decided to do with the last one. */
        chose.current = false;
        to(at(e.clientX));
      }}
      onPointerMoveCapture={track}
      /* ── and the touch has to CHOOSE something ────────────
         With the bar holding the capture the button underneath
         never gets its click, so the lift is where a finger
         picks: whichever item it came to rest over. A mouse is
         untouched by this — it still clicks the button. */
      onPointerUpCapture={(e) => {
        if (down.current && e.pointerType !== "mouse") {
          const i = at(e.clientX);
          if (i !== null) {
            chose.current = true;
            if (DOCK[i].key !== active) {
              setActive(DOCK[i].key);
            }
          }
        }
        down.current = false;
        if (e.pointerType !== "mouse") to(null);
      }}
      onPointerCancelCapture={() => { down.current = false; to(null); }}
      onPointerLeave={() => { if (!down.current) to(null); }}
    >
      {DOCK.map(({ key, label, Icon }, i) => {
        const d = hover === null ? 99 : Math.abs(i - hover);
        /* A raised cosine over the reach, rather than the three
           hand-picked steps this used to carry. Those could not
           be made adjustable without also picking every
           intermediate value by hand, and a curve is what the
           effect was always imitating: 1 under the cursor,
           easing to 0 at the edge of the reach, and flat zero
           past it. */
        const f =
          d > spread ? 0 : (1 + Math.cos((Math.PI * d) / (spread + 1))) / 2;
        const scale = 1 + (magnify - 1) * f;
        return (
          <button
            key={key}
            className="gdock-item"
            aria-label={label}
            aria-current={active === key ? "page" : undefined}
            data-near={d <= 1 ? d : undefined}
            data-active={active === key}
            /* Crossing onto a glyph, not hovering one: a sound
               on hover fires on every pixel of a mouse sweep.
               Quiet, floored, and pitched by position so
               running along the dock is a scale. */
            onClick={() => {
              /* the lift already chose — see `chose` */
              if (chose.current) return;
              setActive(key);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* the glyph magnifies, not the button. Scaling the
                whole item dragged the dot and the label along
                with it — the label ended up 15px further from
                the bar purely as a side effect of the zoom. */}
            <span
              className="gdock-glyph"
              style={{ transform: `translateY(${-lift * f}px) scale(${scale})` }}
            >
              <Icon size={20} strokeWidth={2} />
            </span>
            <span className="gdock-dot" data-on={active === key} />
          </button>
        );
      })}
      {labels && <DockTip bar={bar} at={hover} />}
    </nav>
  );
}

/* ── ONE TIP THAT TRAVELS ─────────────────────────────────
   After the avatar tooltip in transitions.dev's share dialog: not a
   label per icon blinking on and off, but one pill that slides
   along to whichever icon is under the pointer and changes width to
   fit the new word as it goes, both on one short curve. It keeps the
   last word while it fades, so leaving the dock does not empty it
   mid-fade. Its place is read off the item it sits over, centre to
   centre, since a magnified dock does not lay out evenly. */
function DockTip({ bar, at }: { bar: React.RefObject<HTMLElement | null>; at: number | null }) {
  const [last, setLast] = useState(0);
  const [place, setPlace] = useState<{ x: number; w: number } | null>(null);
  const word = useRef<HTMLSpanElement>(null);
  /* the first placing must not slide in from the bar's left edge:
     until it has been placed once it moves without a transition */
  const [ready, setReady] = useState(false);
  if (at !== null && at !== last) setLast(at);

  useLayoutEffect(() => {
    const nav = bar.current;
    const item = nav?.querySelectorAll<HTMLElement>(".gdock-item")[last];
    const text = word.current;
    if (!nav || !item || !text) return;
    /* offsetLeft is layout, so the glyph's own scale does not skew it */
    const w = Math.ceil(text.scrollWidth) + 24;
    setPlace({ x: item.offsetLeft + item.offsetWidth / 2 - w / 2, w });
  }, [last, bar]);
  useLayoutEffect(() => {
    if (!place || ready) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [place, ready]);

  return (
    <span
      className="gdock-tip"
      aria-hidden="true"
      data-on={at !== null && !!place}
      data-ready={ready || undefined}
      style={place ? { width: place.w, transform: `translateX(${place.x}px)` } : undefined}
    >
      <span ref={word}>{DOCK[last].label}</span>
    </span>
  );
}
