# Wake slider

A range made of thin bars with no thumb; drag fast and the bars you sweep past spring up in a wake behind the hand.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/wake-slider)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/wake-slider.json
```

Or by hand: copy `WakeSlider.tsx` and `WakeSlider.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { WakeSlider } from "./WakeSlider";
import "./WakeSlider.css";

export default function Demo() {
  return <WakeSlider />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `bars` | Bars | `36` | 12–64 | how many bars make the track |
| `wake` | Wake | `60` | 0–100 | how high the bars rise behind a fast drag |

## Tokens it reads

`--fill-on` `--fill-slab` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
