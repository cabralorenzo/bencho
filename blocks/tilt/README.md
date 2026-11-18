# Tilt card

A photo card that sinks under your pointer instead of rising to meet it.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/tilt)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/tilt.json
```

Or by hand: copy `Tilt.tsx` and `Tilt.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Tilt } from "./Tilt";
import "./Tilt.css";

export default function Demo() {
  return <Tilt />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `tilt` | Tilt | `10` | 0–20 | how far it turns under you |
| `shade` | Shade | `60` | 0–100 | how deep the dent reads |
| `corner` | Corner | `20` | 0–40 | the card's radius |

## Pictures

The photographs on bencho.dev are licensed to the site and do not travel, so `BUTTERFLY` at the top of `Tilt.tsx` holds drawn grey placeholders. Point it at your own images.

## Tokens it reads

`--surface-2` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
