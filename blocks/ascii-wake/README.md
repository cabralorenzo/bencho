# ASCII wake

A cube drawn in ink dots: the pointer drags a wake of characters through it that thicken under the hand and cool back to dots behind it, and a press sends a ring out.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/ascii-wake)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/ascii-wake.json
```

Or by hand: copy `AsciiWake.tsx` and `AsciiWake.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { AsciiWake } from "./AsciiWake";
import "./AsciiWake.css";

export default function Demo() {
  return <AsciiWake />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `glyphs` | Glyphs | `"Classic"` | `"Classic"`, `"Blocks"`, `"Dots"`, `"Binary"` |  |
| `reach` | Reach | `60` | 0–100 | how wide the wake is |
| `trail` | Trail | `1.2` | 0.2–4 s | seconds for the wake to cool |
| `pull` | Pull | `40` | 0–100 | how far the characters lean toward the pointer |
| `size` | Size | `10` | 8–20 px |  |

## Tokens it reads

`--fill-on` `--ink` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
