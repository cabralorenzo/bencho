# Emoji reactions

Press the button and the message turns into a pill of emoji; pick one and it flies down to its reaction chip as the count rolls up.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/emoji-reactions)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/emoji-reactions.json
```

Or by hand: copy `Reactions.tsx` and `Reactions.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion lucide-react
```

```tsx
import { Reactions } from "./Reactions";
import "./Reactions.css";

export default function Demo() {
  return <Reactions />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `magnify` | Magnify | `50` | 0–100 | how big the emoji under the pointer pops |
| `bounce` | Bounce | `45` | 0–100 | how springy the pill and the landings are |
| `set` | Set | `"Work"` | `"Work"`, `"Classic"`, `"Hearts"` |  |
| `corner` | Corner | `20` | 0–20 px |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--on-slab` `--pane-edge` `--signal` `--slab` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
