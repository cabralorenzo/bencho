# Glass bubble

Drag a ball of glass over a photo and watch it bend the picture beneath.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/glass-bubble)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/glass-bubble.json
```

Or by hand: copy `LiquidGlass.tsx` and `LiquidGlass.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { LiquidGlass } from "./LiquidGlass";
import "./LiquidGlass.css";

export default function Demo() {
  return <LiquidGlass />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `size` | Size | `180` | 100–280 px | the ball, not the picture |
| `bend` | Bend | `60` | 0–100 | how hard the rim bends |
| `fringe` | Fringe | `30` | 0–40 | how far the colours part at the edge |
| `corner` | Corner | `20` | 0–60 px |  |

## Pictures

The photographs on bencho.dev are licensed to the site and do not travel, so `COW` at the top of `LiquidGlass.tsx` holds drawn grey placeholders. Point it at your own images.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
