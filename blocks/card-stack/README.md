# Card stack

A small deck of photos that fans out as you reach it. Hover to draw a card up, click one to flip it into the middle, and click away to put it back on top.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/card-stack)** · Hover

## Use it

Copy `Stack.tsx` and `Stack.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Stack } from "./Stack";
import "./Stack.css";

export default function Demo() {
  return <Stack />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `spread` | Spread | `85` | 0–100 | the width of the fan, not the gap between cards |
| `bounce` | Bounce | `5` | 0–100 |  |
| `scatter` | Scatter | `0` | 0–100 | how far it is from being choreographed |
| `count` | Cards | `5` | 3–6 |  |
| `corner` | Corner | `14` | 0–32 px | the card's radius; the card in view keeps the same roundness |

## Tokens it reads

`--card` `--fill-slab` `--font-num` `--ink-4` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
