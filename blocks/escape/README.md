# Escape button

A button that slides away from your cursor, and then gives up.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/escape)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/escape.json
```

Or by hand: copy `Escape.tsx` and `Escape.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Escape } from "./Escape";
import "./Escape.css";

export default function Demo() {
  return <Escape />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `corner` | Corner | `28` | 0–28 px |  |
| `skittishness` | Skittishness | `55` | 0–100 | how hard it pushes away |
| `patience` | Patience | `4` | 1–8 | dodges before it gives in |
| `radius` | Radius | `120` | 60–200 px |  |

## Tokens it reads

`--fill-on` `--fill-on-rgb` `--fill-slab` `--font-ui` `--ink` `--ink-rgb` `--on-ink` `--pane-edge` `--wash` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
