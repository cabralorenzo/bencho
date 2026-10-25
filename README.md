<br>

<p align="center"><a href="https://bencho.dev"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/brand-dark.png"><img src="assets/readme/brand.png" alt="bencho.dev" width="240"></picture></a></p>

<p align="center">Interactive React blocks and interface sounds.<br><strong>44 blocks and 24 sounds</strong>, free and MIT licensed.</p>

<p align="center">
  <a href="https://bencho.dev"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/pill-blocks-dark.svg"><img src="assets/readme/pill-blocks.svg" alt="Blocks" height="34"></picture></a>
  <a href="https://bencho.dev/sounds"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/pill-sounds-dark.svg"><img src="assets/readme/pill-sounds.svg" alt="Sounds" height="34"></picture></a>
  <a href="https://bencho.dev/mcp"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/pill-mcp-dark.svg"><img src="assets/readme/pill-mcp.svg" alt="MCP" height="34"></picture></a>
  <a href="https://bencho.dev/pricing"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/pill-pro-dark.svg"><img src="assets/readme/pill-pro.svg" alt="Pro" height="34"></picture></a>
</p>

<br>

<a href="https://bencho.dev"><img src="assets/readme/hero.png" alt="A wall of Bencho blocks" width="100%" /></a>

<p align="center">Sponsored by</p>

<p align="center"><a href="https://mobbin.com"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/sponsor-mobbin-dark.png"><img src="assets/readme/sponsor-mobbin.png" alt="Mobbin" width="140"></picture></a></p>

## Take a block

Each block is a folder: the component, its stylesheet, and a README listing its props.

```bash
cp -r blocks/like src/components/like
npm install framer-motion lucide-react
```

```tsx
import "./tokens.css";
import { Like } from "./components/like/Like";
import "./components/like/Like.css";

export default function Page() {
  return <Like color="Ink" burst={70} />;
}
```

- **Props are the knobs.** Whatever you set on bencho.dev, pass the same values here. Every prop is optional.
- **[`tokens.css`](tokens.css)** holds the colours the blocks read, light and dark. Include it once, or map the names to your own theme.
- **Dark mode** follows `data-theme="dark"` on any parent, or the system setting.
- **Using an agent?** Each block on bencho.dev has a Copy prompt button with the file and how to wire it in.

## Take a sound

```ts
import { play } from "./sounds/sounds";

button.addEventListener("click", () => play("tick"));
```

24 sounds made with the Web Audio API, in one file with no audio assets. The list is in [`sounds/`](sounds).

## See them all

```bash
npm install
npm run dev
```

The playground puts every block and sound on one page.

## The shelf

### Hover

- **[ASCII wake](blocks/ascii-wake)** — A cube drawn in ink dots: the pointer drags a wake of characters through it that thicken under the hand and cool back to dots behind it, and a press sends a ring out. [Try it](https://bencho.dev/blocks/ascii-wake)
- **[Stacked bars](blocks/stacked-bars)** — A month of visits as stacked bars; run along them and one day is ringed while a tooltip glides beside it, and Day / Week regrows the bars. [Try it](https://bencho.dev/blocks/stacked-bars)
- **[Toast stack](blocks/toast-stack)** — Three toasts stacked at the edge, the two behind peeking out above the front one; point at them and they spring apart into a list. [Try it](https://bencho.dev/blocks/toast-stack)
- **[Emoji reactions](blocks/emoji-reactions)** — Press the button and the message turns into a pill of emoji; pick one and it flies down to its reaction chip as the count rolls up. [Try it](https://bencho.dev/blocks/emoji-reactions)
- **[Heat map](blocks/heat-word)** — Dots that melt into a heat map under your cursor; press for the next shape. [Try it](https://bencho.dev/blocks/heat-word)
- **[Eye tracker](blocks/eye-tracker)** — Two eyes on a soft cube that turn to follow your cursor around the block. [Try it](https://bencho.dev/blocks/eye-tracker)
- **[Particles](blocks/particles)** — Dots scatter from your pointer and spring home; press for a shockwave. [Try it](https://bencho.dev/blocks/particles)
- **[Image accordion](blocks/image-accordion)** — Hover a photo and it opens while its neighbours give way around it. [Try it](https://bencho.dev/blocks/image-accordion)
- **[Action node](blocks/action-node)** — An automation step card with its controls folded into the corner. [Try it](https://bencho.dev/blocks/action-node)
- **[Magnifying dock](blocks/dock)** — A dock whose icons swell toward your cursor, the nearest growing most. [Try it](https://bencho.dev/blocks/dock)
- **[Escape button](blocks/escape)** — A button that slides away from your cursor, and then gives up. [Try it](https://bencho.dev/blocks/escape)
- **[Tilt card](blocks/tilt)** — A photo card that sinks under your pointer instead of rising to meet it. [Try it](https://bencho.dev/blocks/tilt)

### Swipe

- **[Card swap](blocks/card-swap)** — A stack of photo cards in depth: press the front card or fling it and it goes straight to the back while the rest step forward, or switch Auto on to have it swap by itself. [Try it](https://bencho.dev/blocks/card-swap)
- **[Carousel](blocks/carousel)** — Cards on a turntable that drift, lean under your pointer and swipe round. [Try it](https://bencho.dev/blocks/carousel)

### Drag

- **[Rolling counter](blocks/rolling-counter)** — A number between a minus and a plus whose digits roll like an odometer, carrying column by column: tap, hold to speed up, or drag the number and fling it. [Try it](https://bencho.dev/blocks/rolling-counter)
- **[Folding bill](blocks/folding-bill)** — A bill you can grab, drag and fold; plain or with the dollar print. [Try it](https://bencho.dev/blocks/folding-bill)
- **[Image compare](blocks/image-compare)** — Drag the line to compare two pictures; flick it and it glides to the edge. [Try it](https://bencho.dev/blocks/image-compare)
- **[Signature pad](blocks/signature)** — Sign it; the ink thins with speed, and Clear rewinds it stroke by stroke. [Try it](https://bencho.dev/blocks/signature)
- **[Upload dropzone](blocks/upload-dropzone)** — Drag a file into the box to upload it; one that is too big gets refused. [Try it](https://bencho.dev/blocks/upload-dropzone)
- **[Glass bubble](blocks/glass-bubble)** — Drag a ball of glass over a photo and watch it bend the picture beneath. [Try it](https://bencho.dev/blocks/glass-bubble)
- **[Slide to confirm](blocks/slide-confirm)** — Push the handle across; past the mark it takes over and finishes itself. [Try it](https://bencho.dev/blocks/slide-confirm)
- **[Pull to refresh](blocks/pull)** — Pull the card down and it stretches; let go past the line to refresh. [Try it](https://bencho.dev/blocks/pull)
- **[Dragging ball](blocks/drag-ball)** — A ball you grab: it swells under the pointer and squeezes as you hold it. [Try it](https://bencho.dev/blocks/drag-ball)

### Slide

- **[Wake slider](blocks/wake-slider)** — A range made of thin bars with no thumb; drag fast and the bars you sweep past spring up in a wake behind the hand. [Try it](https://bencho.dev/blocks/wake-slider)
- **[Time scrubber](blocks/time-scrubber)** — Drag the ruler to set a time; fling it and it coasts to the nearest step. [Try it](https://bencho.dev/blocks/time-scrubber)
- **[Slosh slider](blocks/slosh)** — A slider whose fill has weight: drag fast and it sloshes past the handle. [Try it](https://bencho.dev/blocks/slosh)

### Press

- **[Asset swap](blocks/asset-swap)** — Flip the arrow to reverse the swap; tap a coin to pick another. [Try it](https://bencho.dev/blocks/asset-swap)
- **[Like](blocks/like)** — Press the heart and it pops with a burst while the count rolls up a digit. [Try it](https://bencho.dev/blocks/like)
- **[Voice note](blocks/voice-note)** — Hold to record a waveform, slide left to bin it, let go to play it back. [Try it](https://bencho.dev/blocks/voice-note)
- **[Dynamic island](blocks/dynamic-island)** — A live timer in a black pill: press it to grow into the full activity, and back again. [Try it](https://bencho.dev/blocks/dynamic-island)
- **[Generate](blocks/generate)** — Press Generate and an image resolves under glass, broad shapes first. [Try it](https://bencho.dev/blocks/generate)
- **[Step player](blocks/step-player)** — Press play and each step fills as a bar, then eases on to the next dot. [Try it](https://bencho.dev/blocks/step-player)
- **[Todo tower](blocks/todo-tower)** — A to-do list stacked like bricks; take one out and the rest come down. [Try it](https://bencho.dev/blocks/todo-tower)
- **[Checklist](blocks/checklist)** — Tick a task and the box fills, the tick draws in and the words strike out. [Try it](https://bencho.dev/blocks/checklist)
- **[Palette](blocks/palette)** — A set of colours that go together; press for a new palette. [Try it](https://bencho.dev/blocks/palette)
- **[Liquid toggle](blocks/liq-toggle)** — A switch whose droplet stretches as it slides across the track. [Try it](https://bencho.dev/blocks/liq-toggle)
- **[Now playing](blocks/sound)** — A now-playing bar that opens into a full player and folds back as one. [Try it](https://bencho.dev/blocks/sound)
- **[Search](blocks/seek)** — Press the search icon and it opens into the field as one object. [Try it](https://bencho.dev/blocks/seek)
- **[Create menu](blocks/liq-create)** — Press the pill and it spreads into the create menu it was all along. [Try it](https://bencho.dev/blocks/liq-create)

### Type

- **[Label input](blocks/label-input)** — A field whose label lifts into the top edge as you focus it. [Try it](https://bencho.dev/blocks/label-input)
- **[One-time code](blocks/one-time-code)** — Six boxes that are one field: paste, autofill and backspace all just work. [Try it](https://bencho.dev/blocks/one-time-code)

### Select

- **[Magnetic select](blocks/magnet-select)** — Press an option and it swells as the rest are pushed out of its way. [Try it](https://bencho.dev/blocks/magnet-select)
- **[Assignees](blocks/picker)** — Assign people from a list and their faces stack up in the pill. [Try it](https://bencho.dev/blocks/picker)
- **[Aspect ratio](blocks/aspect)** — Switch the crop between 4:3, 1:1 and 3:4, keeping the same area each time. [Try it](https://bencho.dev/blocks/aspect)

## The rest of the bench

This is a selection. [Bencho Pro](https://bencho.dev/pricing) opens all 140+ blocks and 130+ sounds, with full source, sound layering and downloads, an unlimited Bench to arrange them on, and the [Bencho MCP](https://bencho.dev/mcp) for Claude Code, Cursor and Codex. Everything added later comes with it.

## Licence

[MIT](LICENSE) for everything in this repository: use it at work, change it, sell what you build with it.

The photographs on bencho.dev are not included (blocks that use pictures ship with grey placeholders), the Bencho name and goat are not part of the licence, two sounds are rebuilt from [cuelume](https://cuelume.dev) ([notice](THIRD_PARTY.md)), and Pro blocks stay under the [Bencho Pro licence](https://bencho.dev/licence#pro).

Made by [Lorenzo Cabra](https://x.com/cabralorenzo). News at [@benchodev](https://x.com/benchodev).
