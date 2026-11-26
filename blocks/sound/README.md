# Now playing

A now-playing bar that opens into a full player and folds back as one.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/sound)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/sound.json
```

Or by hand: copy `Sound.tsx` and `Sound.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { Sound } from "./Sound";
import "./Sound.css";

export default function Demo() {
  return <Sound />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `corner` | Corner | `16` | 0–36 | the sleeve, and the box around it |
| `morph` | Morph | `50` | 0–100 | how quickly it opens |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink-3` `--ink-4` `--ink-5` `--ink-rgb` `--on-ink` `--on-slab` `--pane` `--pane-edge` `--slab` `--surface-2` `--surface-3` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
