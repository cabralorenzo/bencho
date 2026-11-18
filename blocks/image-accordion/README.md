# Image accordion

Hover a photo and it opens while its neighbours give way around it.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/image-accordion)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/image-accordion.json
```

Or by hand: copy `Accordion.tsx` and `Accordion.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Accordion } from "./Accordion";
import "./Accordion.css";

export default function Demo() {
  return <Accordion />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `open` | Open | `50` | 0–100 | how much the one you point at takes |
| `reach` | Reach | `35` | 0–100 | how far the swell carries into the neighbours |
| `bounce` | Bounce | `10` | 0–100 |  |
| `gap` | Gap | `8` | 0–20 px | the air between pictures — the corner follows it |

## Pictures

The photographs on bencho.dev are licensed to the site and do not travel, so `SHOTS` at the top of `Accordion.tsx` holds drawn grey placeholders. Point it at your own images.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
