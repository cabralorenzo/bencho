# Context meter

A context window as one stacked bar, or a field of dots. Point at a kind to light it; Compact squeezes the chat down with a sound to match.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/context-meter)** · Hover

## Use it

Copy `ContextMeter.tsx` and `ContextMeter.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion
```

```tsx
import { ContextMeter } from "./ContextMeter";
import "./ContextMeter.css";

export default function Demo() {
  return <ContextMeter />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `style` | Style | `"Bar"` | `"Bar"`, `"Field"` | one stacked bar, or a field of dots |
| `colour` | Colour | `"Colour"` | `"Colour"`, `"Mono"` |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` `--signal` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
