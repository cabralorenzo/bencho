# Checklist

Tick a task and the box fills, the tick draws in and the words strike out.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/checklist)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/checklist.json
```

Or by hand: copy `Checklist.tsx` and `Checklist.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion
```

```tsx
import { Checklist } from "./Checklist";
import "./Checklist.css";

export default function Demo() {
  return <Checklist />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `corner` | Corner | `20` | 0–40 px |  |
| `box` | Box | `18` | 14–28 px | the checkbox |
| `bounce` | Bounce | `50` | 0–100 | how far the box swells past full |

## Tokens it reads

`--card` `--fill-on` `--fill-on-rgb` `--fill-slab` `--font-ui` `--ink` `--ink-rgb` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
