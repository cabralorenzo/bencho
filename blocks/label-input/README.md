# Label input

A field whose label lifts into the top edge as you focus it.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/label-input)** · Type

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/label-input.json
```

Or by hand: copy `LabelInput.tsx` and `LabelInput.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { LabelInput } from "./LabelInput";
import "./LabelInput.css";

export default function Demo() {
  return <LabelInput />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `field` | Field | `"Email"` | `"Email"`, `"Password"` |  |
| `corner` | Corner | `20` | 0–26 px |  |

## Tokens it reads

`--fill-on` `--fill-slab` `--font-ui` `--ink` `--ink-3` `--ink-4` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
