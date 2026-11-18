# Pull to refresh

Pull the card down and it stretches; let go past the line to refresh.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/pull)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/pull.json
```

Or by hand: copy `Balance.tsx` and `Balance.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { Balance } from "./Balance";
import "./Balance.css";

export default function Demo() {
  return <Balance />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `corner` | Corner | `20` | 0–40 | the card, and the tabs with it |
| `spin` | Spin | `50` | 0–100 | how fast the ring turns while it works |
| `dots` | Dots | `6` | 3–10 | marks in the loading wheel |

## Tokens it reads

`--bg` `--card` `--ember` `--fill-on` `--fill-on-rgb` `--fill-slab` `--font-ui` `--ink` `--ink-rgb` `--nod-r` `--ok` `--pane-edge` `--tip` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
