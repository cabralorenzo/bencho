# Huddle

A voice room with three people in it. Join and your orb pops in while the others shuffle up, and a ring breathes round whoever is talking.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/huddle)** · Press

## Use it

Copy `Huddle.tsx` and `Huddle.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install @outpacelabs/avatars @phosphor-icons/react framer-motion
```

```tsx
import { Huddle } from "./Huddle";
import "./Huddle.css";

export default function Demo() {
  return <Huddle />;
}
```

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--pane-edge` `--signal` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
