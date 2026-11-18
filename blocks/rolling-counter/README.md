# Rolling counter

A number between a minus and a plus whose digits roll like an odometer, carrying column by column: tap, hold to speed up, or drag the number and fling it.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/rolling-counter)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/rolling-counter.json
```

Or by hand: copy `Counter.tsx` and `Counter.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { Counter } from "./Counter";
import "./Counter.css";

export default function Demo() {
  return <Counter />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `bounce` | Bounce | `45` | 0–100 | how lively a digit lands |
| `stagger` | Stagger | `45` | 0–120 ms | the wait between one column and the next |
| `blur` | Blur | `50` | 0–100 | how much a spinning digit smears |
| `corner` | Corner | `16` | 0–28 px |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` `--signal` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
