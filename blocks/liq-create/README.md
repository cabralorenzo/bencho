# Create menu

Press the pill and it spreads into the create menu it was all along.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/liq-create)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/liq-create.json
```

Or by hand: copy `Create.tsx` and `Create.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion lucide-react
```

```tsx
import { Create } from "./Create";
import "./Create.css";

export default function Demo() {
  return <Create />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `corner` | Corner | `20` | 0–40 px |  |

## Tokens it reads

`--board` `--fill-on` `--fill-on-rgb` `--fill-slab` `--font-ui` `--ink` `--ink-rgb` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
