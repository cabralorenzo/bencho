# Action node

An automation step card with its controls folded into the corner.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/action-node)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/action-node.json
```

Or by hand: copy `ActionNode.tsx` and `ActionNode.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { ActionNode } from "./ActionNode";
import "./ActionNode.css";

export default function Demo() {
  return <ActionNode />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `bounce` | Bounce | `20` | 0–40 |  |
| `stagger` | Stagger | `55` | 0–100 | all at once, or one after another |
| `count` | Buttons | `4` | 2–4 |  |
| `corner` | Corner | `20` | 0–32 px |  |

## Pictures

The photographs on bencho.dev are licensed to the site and do not travel, so `AVATARS` at the top of `ActionNode.tsx` holds drawn grey placeholders. Point it at your own images.

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--ink-3` `--ink-4` `--ink-rgb` `--pane-edge` `--wash` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
