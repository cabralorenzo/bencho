# Search

Press the search icon and it opens into the field as one object.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/seek)** · Press

## Use it

Copy `Seek.tsx` and `Seek.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Seek } from "./Seek";
import "./Seek.css";

export default function Demo() {
  return <Seek />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `corner` | Corner | `24` | 0–24 px |  |
| `give` | Give | `50` | 0–100 | how far it leans toward the cursor |
| `spring` | Spring | `20` | 0–100 | how the width settles |
| `width` | Width | `240` | 200–360 px | the field at rest |

## Tokens it reads

`--bg` `--font-ui` `--g-blur` `--g-sat` `--ink` `--ink-2` `--ink-3` `--ink-4` `--ink-5` `--ink-rgb` `--pane` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
