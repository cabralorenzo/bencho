# Assignees

Assign people from a list and their faces stack up in the pill.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/picker)** · Select

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/picker.json
```

Or by hand: copy `Picker.tsx` and `Picker.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion lucide-react
```

```tsx
import { Picker } from "./Picker";
import "./Picker.css";

export default function Demo() {
  return <Picker />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `corner` | Corner | `20` | 0–26 px |  |
| `stack` | Stack | `"Row"` | `"Row"`, `"Grid"` | a growing row, or four packed into the width of one |
| `overlap` | Overlap | `10` | 0–22 px | how far the faces stack over each other |

## Tokens it reads

`--card` `--fill-on` `--fill-on-rgb` `--fill-slab` `--font-ui` `--ink` `--ink-rgb` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
