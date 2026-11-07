# Signature pad

Sign it; the ink thins with speed, and Clear rewinds it stroke by stroke.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/signature)** · Drag

## Use it

Copy `Signature.tsx` and `Signature.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { Signature } from "./Signature";
import "./Signature.css";

export default function Demo() {
  return <Signature />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `pen` | Pen | `40` | 0–100 | how heavy the nib is |
| `ink` | Ink | `"Black"` | `"Black"`, `"Blue"` |  |
| `smooth` | Smoothing | `50` | 0–100 | how much of the hand's wobble is taken out |
| `rewind` | Rewind | `50` | 0–100 | how fast Clear un-draws |
| `corner` | Corner | `20` | 0–28 px |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` `--signal` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
