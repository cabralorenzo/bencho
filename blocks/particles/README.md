# Particles

Dots scatter from your pointer and spring home; press for a shockwave.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/particles)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/particles.json
```

Or by hand: copy `Particles.tsx` and `Particles.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Particles } from "./Particles";
import "./Particles.css";

export default function Demo() {
  return <Particles />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `shape` | Shape | `"Circle"` | see the file | the one it opens as; a press moves to the next |
| `reach` | Reach | `80` | 30–160 px | how far the pointer pushes |
| `force` | Force | `60` | 0–100 | how hard it pushes |
| `grain` | Grain | `"Fine"` | `"Fine"`, `"Coarse"` |  |

## Tokens it reads

`--fill-on` `--ink` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
