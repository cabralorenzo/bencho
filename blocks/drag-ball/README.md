# Dragging ball

A ball you grab: it swells under the pointer and squeezes as you hold it.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/drag-ball)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/drag-ball.json
```

Or by hand: copy `Ball.tsx` and `Ball.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion liquid-gooey
```

```tsx
import { Ball } from "./Ball";
import "./Ball.css";

export default function Demo() {
  return <Ball />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `stretch` | Stretch | `36` | 0–70 | how much it deforms as it moves |
| `give` | Give | `50` | 10–100 | how quickly it rounds back out |
| `grip` | Grip | `50` | 0–100 | how hard it squeezes when held |
| `size` | Size | `56` | 32–84 px | the ball |

---

MIT licensed. Part of [Bencho](https://bencho.dev).
