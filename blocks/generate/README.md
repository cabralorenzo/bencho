# Generate

Press Generate and an image resolves under glass, broad shapes first.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/generate)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/generate.json
```

Or by hand: copy `Generate.tsx` and `Generate.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Generate } from "./Generate";
import "./Generate.css";

export default function Demo() {
  return <Generate />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `pace` | Pace | `5` | 3–8 s | seconds from the press to the picture |
| `ripple` | Ripple | `50` | 0–100 | how liquid the surface is while it forms |
| `corner` | Corner | `20` | 0–40 px |  |

## Pictures

The photographs on bencho.dev are licensed to the site and do not travel, so `FLOWER` at the top of `Generate.tsx` holds drawn grey placeholders. Point it at your own images.

## Tokens it reads

`--fill-on` `--fill-on-rgb` `--fill-slab` `--font-ui` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
