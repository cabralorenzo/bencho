# Image compare

Drag the line to compare two pictures; flick it and it glides to the edge.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/image-compare)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/image-compare.json
```

Or by hand: copy `Compare.tsx` and `Compare.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Compare } from "./Compare";
import "./Compare.css";

export default function Demo() {
  return <Compare />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `labels` | Labels | `true` | `true` / `false` | the Before and After tags |
| `corner` | Corner | `20` | 0–28 px |  |

## Tokens it reads

`--bg` `--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--signal` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
