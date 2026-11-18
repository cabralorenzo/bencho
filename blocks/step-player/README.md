# Step player

Press play and each step fills as a bar, then eases on to the next dot.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/step-player)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/step-player.json
```

Or by hand: copy `StepPlayer.tsx` and `StepPlayer.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { StepPlayer } from "./StepPlayer";
import "./StepPlayer.css";

export default function Demo() {
  return <StepPlayer />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `wake` | Wake | `100` | 0–100 | how far back the ripple runs |
| `pace` | Pace | `3` | 1–6 s | seconds a step takes to fill |
| `steps` | Steps | `5` | 3–8 |  |

## Tokens it reads

`--card` `--fill-on` `--fill-on-rgb` `--fill-slab` `--font-ui` `--ink` `--ink-2` `--ink-rgb` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
