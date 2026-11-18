# Folding bill

A bill you can grab, drag and fold; plain or with the dollar print.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/folding-bill)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/folding-bill.json
```

Or by hand: copy `FoldingBill.tsx` and `FoldingBill.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install three
```

```tsx
import { FoldingBill } from "./FoldingBill";
import "./FoldingBill.css";

export default function Demo() {
  return <FoldingBill />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `print` | Print | `"Plain"` | `"Plain"`, `"Print"` |  |
| `stiffness` | Stiffness | `40` | 0–100 | silk at one end, card at the other |
| `settle` | Settle | `0` | 0–100 | how quickly it smooths out and comes home |

## Pictures

The photographs on bencho.dev are licensed to the site and do not travel, so `BILL_ART` at the top of `FoldingBill.tsx` holds drawn grey placeholders. Point it at your own images.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
