# Huddle

A voice room with two people in it. Join and your blue orb pops in while the others shuffle up, and a sound wave plays over whoever is talking.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/huddle)** · Press

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/huddle.json
```

Or by hand: copy `Huddle.tsx` and `Huddle.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

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
