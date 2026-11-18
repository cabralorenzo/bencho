# Card swap

A stack of photo cards in depth: press the front card or fling it and it goes straight to the back while the rest step forward, or switch Auto on to have it swap by itself.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/card-swap)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/card-swap.json
```

Or by hand: copy `CardSwap.tsx` and `CardSwap.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { CardSwap } from "./CardSwap";
import "./CardSwap.css";

export default function Demo() {
  return <CardSwap />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `auto` | Auto | `false` | `true` / `false` | swap by itself every few seconds |
| `every` | Every | `4` | 2–8 s | seconds between swaps, with Auto on |

## Tokens it reads

`--fill-on` `--fill-slab` `--t` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
