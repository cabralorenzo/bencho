# Aspect ratio

Switch the crop between 4:3, 1:1 and 3:4, keeping the same area each time.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/aspect)** · Select

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/aspect.json
```

Or by hand: copy `Aspect.tsx` and `Aspect.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Aspect } from "./Aspect";
import "./Aspect.css";

export default function Demo() {
  return <Aspect />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `morph` | Morph | `50` | 0–100 | how quickly it changes shape |
| `corner` | Corner | `20` | 0–40 | the picture's radius |

## Pictures

The photographs on bencho.dev are licensed to the site and do not travel, so `SHEEP` at the top of `Aspect.tsx` holds drawn grey placeholders. Point it at your own images.

## Tokens it reads

`--asp-ms` `--card` `--font-ui` `--ink` `--ink-3` `--ink-rgb` `--surface-2` `--wash` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
