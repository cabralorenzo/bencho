# Slingshot

Pull the ball back and the band stretches, clicks and trembles at its limit; let go and it flies, bounces off the walls and comes home.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/slingshot)** · Drag

## Use it

Copy `Slingshot.tsx` and `Slingshot.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { Slingshot } from "./Slingshot";
import "./Slingshot.css";

export default function Demo() {
  return <Slingshot />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `power` | Power | `100` | 50–160 % | how hard the band throws |
| `bounce` | Bounce | `30` | 0–100 | how lively the ball comes off the walls |

## Tokens it reads

`--fill-on` `--fill-slab` `--font-ui` `--ink` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
