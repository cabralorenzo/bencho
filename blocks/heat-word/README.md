# Heat map

Dots that melt into a heat map under your cursor; press for the next shape.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/heat-word)** · Hover

## Use it

Copy `HeatWord.tsx` and `HeatWord.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { HeatWord } from "./HeatWord";
import "./HeatWord.css";

export default function Demo() {
  return <HeatWord />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `shape` | Shape | `"Dots"` | `"Dots"`, `"Asterisk"`, `"Word"` |  |
| `colors` | Colors | `"Neon"` | `"Neon"`, `"Fire"`, `"Sea"`, `"Pop"` |  |
| `heat` | Heat | `60` | 0–100 | how much the cursor melts the letters |
| `area` | Area | `50` | 0–100 | how big the patch under the cursor is |
| `soft` | Softness | `40` | 0–100 | how far the heat spreads from each stroke |

---

MIT licensed. Part of [Bencho](https://bencho.dev).
