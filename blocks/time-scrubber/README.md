# Time scrubber

Drag the ruler to set a time; fling it and it coasts to the nearest step.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/time-scrubber)** · Slide

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/time-scrubber.json
```

Or by hand: copy `Scrub.tsx` and `Scrub.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Scrub } from "./Scrub";
import "./Scrub.css";

export default function Demo() {
  return <Scrub />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `step` | Step | `"15"` | `"5"`, `"15"`, `"30"` | what it settles on, in minutes |
| `momentum` | Momentum | `50` | 0–100 | how far a fling carries |
| `format` | Format | `"12h"` | `"12h"`, `"24h"` |  |
| `corner` | Corner | `20` | 0–32 px |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` `--signal` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
