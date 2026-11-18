# Like

Press the heart and it pops with a burst while the count rolls up a digit.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/like)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/like.json
```

Or by hand: copy `Like.tsx` and `Like.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion lucide-react
```

```tsx
import { Like } from "./Like";
import "./Like.css";

export default function Demo() {
  return <Like />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `color` | Color | `"Red"` | `"Red"`, `"Ink"` |  |
| `effect` | Effect | `"Bloom"` | `"Bloom"`, `"Firework"` | how the like lands |
| `burst` | Burst | `50` | 0–100 | how far the particles fly |
| `corner` | Corner | `22` | 0–22 px |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` `--signal` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
