# Asset swap

Flip the arrow to reverse the swap; tap a coin to pick another.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/asset-swap)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/asset-swap.json
```

Or by hand: copy `Swap.tsx` and `Swap.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion lucide-react
```

```tsx
import { Swap } from "./Swap";
import "./Swap.css";

export default function Demo() {
  return <Swap />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `assets` | Assets | `"Crypto"` | `"Crypto"`, `"Currency"` |  |
| `bounce` | Bounce | `30` | 0–100 | how far the arrow overshoots as it turns |
| `corner` | Corner | `20` | 0–40 px |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` `--pick` `--swp-r` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
