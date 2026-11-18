# Upload dropzone

Drag a file into the box to upload it; one that is too big gets refused.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/upload-dropzone)** · Drag

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/upload-dropzone.json
```

Or by hand: copy `Upload.tsx` and `Upload.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install framer-motion lucide-react
```

```tsx
import { Upload } from "./Upload";
import "./Upload.css";

export default function Demo() {
  return <Upload />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `speed` | Speed | `50` | 0–100 | how fast a file sends |
| `bounce` | Bounce | `40` | 0–100 | how springy a file flies home |
| `corner` | Corner | `20` | 0–24 px |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` `--ok` `--pane-edge` `--signal` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
