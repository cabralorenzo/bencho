# Carousel

Cards on a turntable that drift, lean under your pointer and swipe round.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/carousel)** · Swipe

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/carousel.json
```

Or by hand: copy `Carousel.tsx` and `Carousel.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Carousel } from "./Carousel";
import "./Carousel.css";

export default function Demo() {
  return <Carousel />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `orbit` | Spread | `138` | 110–150 px | how far round the ring reaches |
| `depth` | Depth | `100` | 0–150 | how much smaller the back gets |
| `corner` | Corner | `20` | 0–40 px |  |
| `float` | Float | `15` | 0–100 | how much they drift at rest |
| `sink` | Sink | `50` | 0–100 | how deep the pointer presses |
| `settle` | Settle | `50` | 0–100 | how quickly a throw lands |

## Pictures

The photographs on bencho.dev are licensed to the site and do not travel, so `SHOTS` at the top of `Carousel.tsx` holds drawn grey placeholders. Point it at your own images.

## Tokens it reads

`--bg` `--font-ui` `--ink-rgb` `--lift` `--sway` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
