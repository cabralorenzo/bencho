# Toast stack

Three toasts stacked at the edge, the two behind peeking out above the front one; point at them and they spring apart into a list.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/toast-stack)** · Hover

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/toast-stack.json
```

Or by hand: copy `ToastStack.tsx` and `ToastStack.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion lucide-react
```

```tsx
import { ToastStack } from "./ToastStack";
import "./ToastStack.css";

export default function Demo() {
  return <ToastStack />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `peek` | Peek | `14` | 6–24 px | how much of each tucked toast shows |
| `gap` | Gap | `10` | 4–20 px | the space between toasts once fanned out |
| `corner` | Corner | `20` | 0–32 px |  |

## Tokens it reads

`--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` `--signal` `--tst-r` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
