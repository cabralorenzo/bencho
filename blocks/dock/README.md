# Magnifying dock

A dock whose icons swell toward your cursor, the nearest growing most.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/dock)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/dock.json
```

Or by hand: copy `GlassDock.tsx` and `GlassDock.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { GlassDock } from "./GlassDock";
import "./GlassDock.css";

export default function Demo() {
  return <GlassDock />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `magnify` | Magnify | `1.32` | 1–2 × |  |
| `lift` | Lift | `8` | 0–22 px |  |
| `spread` | Reach | `2` | 0–4 | glyphs either side that feel it |

## Tokens it reads

`--fill-on` `--fill-slab` `--font-ui` `--g-blur` `--g-bright` `--g-edge-far` `--g-edge-hi` `--g-edge-lo` `--g-lift` `--g-sat` `--g-shadow` `--g-spec` `--ink` `--ink-rgb` `--on-ink` `--pane` `--pane-edge` `--shadow-rgb` `--try-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
