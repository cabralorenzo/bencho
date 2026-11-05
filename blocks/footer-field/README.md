# Footer field

The field of ink dots along the foot of [bencho.dev](https://bencho.dev): a wave of halftone dots that the pointer drags a wake of characters through, and a press sends a ring out across. It fills the width of whatever holds it.

**[See it at the foot of bencho.dev →](https://bencho.dev)** · Hover

## Use it

Copy `FooterField.tsx` and `FooterField.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

No packages beyond React.

```tsx
import { FooterField } from "./FooterField";
import "./FooterField.css";

export default function Footer() {
  return (
    <footer>
      <FooterField />
    </footer>
  );
}
```

## Props

Every prop is optional.

| Prop | Default | What it does |
| --- | --- | --- |
| `size` | `16` | how big a character is, px |
| `reach` | `44` | how far the wake reaches from the pointer, px |
| `trail` | `1.2` | seconds for the wake to cool |

The height comes from the stylesheet (380px, 300px on a phone), and `--clear` sets the strip left bare at the bottom for a line of links to sit over.

## Why it stays smooth on a wide screen

The cold dots never change, so they are drawn once onto a layer of their own whenever the size or the theme changes. Each frame only restores that layer where the last frame wrote and draws the warm cells on top. The work follows the wake rather than the width of the window, and an idle field does nothing at all. Drawing every dot on every frame cost a little more for each pixel of width, and on a 2560px screen that was enough to stutter the whole page.

## Tokens it reads

`--ink` `--bg` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev). Built on the same field-then-ramp idea as the [ASCII wake](../ascii-wake) block.
