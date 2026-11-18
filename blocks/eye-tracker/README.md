# Eye tracker

Two eyes on a soft cube that turn to follow your cursor around the block.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/eye-tracker)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/eye-tracker.json
```

Or by hand: copy `Watcher.tsx` and `Watcher.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Watcher } from "./Watcher";
import "./Watcher.css";

export default function Demo() {
  return <Watcher />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `follow` | Follow | `60` | 0–100 | how far it turns to look |
| `bounce` | Bounce | `30` | 0–100 | how much the turn overshoots |
| `shape` | Shape | `"Cube"` | `"Cube"`, `"Pill"`, `"Hexagon"` |  |
| `eyes` | Eyes | `"Slant"` | `"Slant"`, `"Dots"`, `"Squares"` |  |
| `size` | Size | `100` | 60–180 px |  |

## Tokens it reads

`--bg` `--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
