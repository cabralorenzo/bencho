# Palette

A set of colours that go together; press for a new palette.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/palette)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/palette.json
```

Or by hand: copy `Palette.tsx` and `Palette.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { Palette } from "./Palette";
import "./Palette.css";

export default function Demo() {
  return <Palette />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `count` | Colours | `4` | 3–5 | how many in the set |
| `corner` | Corner | `14` | 0–29 px |  |
| `morph` | Morph | `50` | 0–100 | how quickly a colour changes |

## Tokens it reads

`--card` `--fill-on` `--fill-on-rgb` `--fill-slab` `--font-ui` `--ink-2` `--ink-rgb` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
