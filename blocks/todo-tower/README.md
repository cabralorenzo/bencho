# Todo tower

A to-do list stacked like bricks; take one out and the rest come down.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/todo-tower)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/todo-tower.json
```

Or by hand: copy `Tower.tsx` and `Tower.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { Tower } from "./Tower";
import "./Tower.css";

export default function Demo() {
  return <Tower />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `gravity` | Gravity | `50` | 0–100 | how hard it falls |
| `count` | Todos | `6` | 3–8 |  |
| `slip` | Slip | `45` | 0–100 | how crooked it stacks, and how far a card skates |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--focus` `--ink` `--ink-2` `--ink-4` `--ink-rgb` `--on-ink` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
