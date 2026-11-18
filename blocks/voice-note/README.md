# Voice note

Hold to record a waveform, slide left to bin it, let go to play it back.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/voice-note)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/voice-note.json
```

Or by hand: copy `VoiceNote.tsx` and `VoiceNote.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { VoiceNote } from "./VoiceNote";
import "./VoiceNote.css";

export default function Demo() {
  return <VoiceNote />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `bars` | Bars | `28` | 12–48 | how many bars the wave is drawn with |
| `gain` | Sensitivity | `60` | 0–100 | how tall a given level draws |
| `bounce` | Bounce | `40` | 0–100 | how far the pill overshoots as it opens |
| `corner` | Corner | `28` | 0–28 px |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--ink-3` `--pane-edge` `--signal` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
