# Liquid toggle

A switch whose droplet stretches as it slides across the track.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/liq-toggle)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/liq-toggle.json
```

Or by hand: copy `Toggle.tsx` and `Toggle.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion
```

```tsx
import { Toggle } from "./Toggle";
import "./Toggle.css";

export default function Demo() {
  return <Toggle />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `speed` | Speed | `50` | 0–100 |  |
| `stretch` | Stretch | `36` | 0–100 | how much it lengthens as it moves |

## SVG filter

This block reads the `#liq-goo` filter. The markup to mount once on the page is in the comment at the top of `Toggle.tsx`.

## Tokens it reads

`--board` `--card` `--fill-on` `--fill-slab` `--ink` `--nod-r` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
