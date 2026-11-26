# Stacked bars

A month of visits as stacked bars; run along them and one day is ringed while a tooltip glides beside it, and Day / Week regrows the bars.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/stacked-bars)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/stacked-bars.json
```

Or by hand: copy `StackedBars.tsx` and `StackedBars.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion
```

```tsx
import { StackedBars } from "./StackedBars";
import "./StackedBars.css";

export default function Demo() {
  return <StackedBars />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `colour` | Colour | `"Colour"` | `"Mono"`, `"Colour"` |  |
| `bars` | Bars | `20` | 12–30 | how many days or weeks the chart shows |
| `gap` | Gap | `6` | 2–6 px | the air between bars; it gives way before a bar gets thinner than 3px |

## Tokens it reads

`--c` `--fill-on` `--fill-slab` `--font-ui` `--i` `--pane-edge` `--signal` `--stb-r` `--stb-rr` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
