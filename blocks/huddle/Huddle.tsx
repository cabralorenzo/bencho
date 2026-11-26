import { useEffect, useRef, useState } from "react";
import { GradientAvatar } from "@outpacelabs/avatars";
import { DotsThree, Microphone, MicrophoneSlash } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";

/* ══ Huddle ════════════════════════════════════════════════
   A voice room with two people in it. Join and your orb pops in
   beside theirs, the others shuffle up to make room, and a sound
   wave plays in the middle of whoever is talking; leave and the room closes up
   again.

   ── THE ROOM MAKES ROOM ───────────────────────────────────
   The orbs are a row that lays itself out, and each one animates its
   own change of place. So a fourth arriving is not a fourth being
   placed: it is three moving over and one growing into the gap they
   leave, and it leaving is the same thing backwards. Who is talking
   only shows while you are in the room; before that nobody is marked
   as talking and nothing runs. */

/* ── inlined from site/orb ──────────────────────── */
/* ══ the orb ═══════════════════════════════════════════════
   A voice, drawn. Lifted out of Sounds.tsx when the overlay
   arrived and needed the same disc at three times the size —
   one file, because the alternative is two hue tables that
   agree until somebody retunes a note.

   Everything here is derived from VOICES. Nothing about a
   sound is written down twice. */

function family(hue: number): string[] {
  return [hsl(hue, 88, 64), hsl(hue + 34, 84, 58), hsl(hue - 20, 90, 68)];
}

/* hsl to hex, because the library takes hex and the palette
   above is reasoned about in degrees */
function hsl(h: number, s: number, l: number): string {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + ((h % 360) + 360) / 30) % 12;
    const v = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * v)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/* two people by default, the sign-up sheet's own candid photos (the
   same files public/crowd serves there); you join as a peach orb
   (2026-11-21) */
const ROOM = [
  { name: "Ines", face: "/crowd/four.jpg" },
  { name: "Tom", face: "/crowd/one.jpg" },
];
const YOU = { name: "You", face: "" };
const ME = ROOM.length;   // your index in the row once you are in

export function Huddle() {
  const [joined, setJoined] = useState(false);
  const [talking, setTalking] = useState(0);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const people = joined ? [...ROOM, YOU] : ROOM;

  /* while you are muted the wave never lands on you */
  useEffect(() => {
    if (!joined) { setTalking(0); setMuted(false); return; }
    const id = window.setInterval(() => setTalking((t) => {
      let n = (t + 1 + Math.floor(Math.random() * 2)) % (ME + 1);
      if (mutedRef.current && n === ME) n = 0;
      return n;
    }), 1700);
    return () => window.clearInterval(id);
  }, [joined]);
  useEffect(() => { if (muted && talking === ME) setTalking(0); }, [muted, talking]);

  return (
    <div className="hdl" data-live={joined || undefined} style={{ width: 300 }}>
      <div className="hdl-head">
        <span className="hdl-title">Huddle</span>
      </div>
      <div className="hdl-room">
        <AnimatePresence initial={false} mode="popLayout">
          {people.map((p, i) => (
            <motion.div
              key={p.name}
              layout
              /* only when someone joins or leaves (2026-11-22). Left to
                 measure on every render, a block that MOVED (the overlay's
                 panel folding, the wall reflowing) read as the people
                 moving, and they sprang after it on their own */
              layoutDependency={joined}
              className="hdl-person"
              data-talking={talking === i || undefined}
              data-muted={(p === YOU && muted) || undefined}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.16 } }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            >
              <span className="hdl-orb">
                {p.face
                  ? <img src={p.face} alt="" width={52} height={52} draggable={false} />
                  : <GradientAvatar seed={p.name} size={52} radius={0} colors={family(22)} />}
                {/* a small sound wave in the middle of whoever is talking */}
                <span className="hdl-wave" aria-hidden="true"><i /><i /><i /><i /></span>
              </span>
              <span className="hdl-name">{p.name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* once you are in, a round mute key and a round more key sit beside Leave */}
      <div className="hdl-keys">
        {joined && (
          <button type="button" className="hdl-go hdl-mute" data-muted={muted || undefined} aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"} onClick={() => { setMuted(!muted); }}>
            <span key={muted ? "u" : "m"}>{muted ? <MicrophoneSlash size={18} weight="fill" aria-hidden="true" /> : <Microphone size={18} weight="fill" aria-hidden="true" />}</span>
          </button>
        )}
        {joined && (
          <button type="button" className="hdl-go hdl-more" aria-label="More options" onClick={() => void 0}>
            <span><DotsThree size={20} weight="bold" aria-hidden="true" /></span>
          </button>
        )}
        <button type="button" className="hdl-go" data-in={joined || undefined} onClick={() => { setJoined(!joined); }}>
          <span key={joined ? "l" : "j"}>{joined ? "Leave" : "Join huddle"}</span>
        </button>
      </div>
    </div>
  );
}
