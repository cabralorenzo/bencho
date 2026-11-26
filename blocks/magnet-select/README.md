# Magnetic select

Press an option and it swells as the rest are pushed out of its way.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/magnet-select)** · Select

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/magnet-select.json
```

Or by hand: copy `MagneticSelect.tsx` and `MagneticSelect.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion
```

```tsx
import { MagneticSelect } from "./MagneticSelect";
import "./MagneticSelect.css";

export default function Demo() {
  return <MagneticSelect />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `pull` | Pull | `55` | 0–100 | how hard the selected one pushes the rest away |
| `bounce` | Bounce | `55` | 0–100 |  |
| `give` | Give | `50` | 0–100 | how far a chip leans toward the cursor |
| `size` | Size | `"Large"` | `"Small"`, `"Large"` | three options, or seven |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
