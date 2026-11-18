# One-time code

Six boxes that are one field: paste, autofill and backspace all just work.

**[Try it live on bencho.dev →](https://bencho.dev/blocks/one-time-code)** · Type

## Use it

With the shadcn CLI, in one line (the packages and colours come with it):

```bash
npx shadcn@latest add https://bencho.dev/r/one-time-code.json
```

Or by hand: copy `Otp.tsx` and `Otp.css` into your project, and add [`tokens.css`](../../tokens.css) once if you have not already.

```bash
npm install lucide-react
```

```tsx
import { Otp } from "./Otp";
import "./Otp.css";

export default function Demo() {
  return <Otp />;
}
```

## Props

Every prop is optional and defaults to what the block ships with on bencho.dev.

| Prop | Knob | Default | Range | What it does |
| --- | --- | --- | --- | --- |
| `answer` | Answer | `"Accept"` | `"Accept"`, `"Reject"` | what a full code gets back |
| `length` | Length | `"4"` | `"4"`, `"6"` |  |
| `corner` | Corner | `12` | 0–22 px |  |

## Tokens it reads

`--card` `--fill-on` `--fill-slab` `--font-ui` `--ink` — all defined in [`tokens.css`](../../tokens.css). Map them to your own theme if you have one.

---

MIT licensed. Part of [Bencho](https://bencho.dev).
