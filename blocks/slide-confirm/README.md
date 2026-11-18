# Slide to confirm

Push the handle across; past the mark it takes over and finishes itself.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/slide-confirm)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/slide-confirm.json
```

Or by hand: copy `SlideConfirm.tsx` and `SlideConfirm.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion lucide-react
```

```tsx
import { SlideConfirm } from "./SlideConfirm";
import "./SlideConfirm.css";

export default function Demo() {
  return <SlideConfirm />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `width` | Width | `280` | 220–380 px | the track's length — the handle keeps its size |
| `corner` | Corner | `28` | 0–28 px |  |
| `speed` | Speed | `50` | 0–100 | how fast it takes over once you let go |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
