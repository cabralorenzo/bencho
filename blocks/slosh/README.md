# Slosh slider

A slider whose fill has weight: drag fast and it sloshes past the handle.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/slosh)** · Slide

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/slosh.json
```

Or by hand: copy `Slosh.tsx` and `Slosh.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Slosh } from "./Slosh";
import "./Slosh.css";

export default function Demo() {
  return <Slosh />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `corner` | Corner | `20` | 0–20 px |  |
| `viscosity` | Viscosity | `15` | 0–100 | 0 is a rigid fill, 100 is loose liquid |
| `momentum` | Momentum | `55` | 0–100 | how far it coasts after release |
| `tilt` | Tilt | `45` | 0–100 | lean on the leading edge |

## Tokens it reads

`--bg` `--board` `--fill-on` `--fill-on-rgb` `--fill-slab` `--font-ui` `--ink` `--ink-rgb` `--lean` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
