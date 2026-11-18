# Dynamic island

A live timer in a black pill: press it to grow into the full activity, and back again.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/dynamic-island)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/dynamic-island.json
```

Or by hand: copy `Island.tsx` and `Island.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion lucide-react
```

```tsx
import { Island } from "./Island";
import "./Island.css";

export default function Demo() {
  return <Island />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `tone` | Island | `"Black"` | `"Black"`, `"White"` |  |
| `bounce` | Bounce | `40` | 0–100 | how much the shape overshoots |

## Pictures

The photographs on bencho.dev are licensed to the site and do not travel, so `AVATARS` at the top of `Island.tsx` holds drawn grey placeholders. Point it at your own images.

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--p` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
