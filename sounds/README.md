# Sounds

24 interface sounds, synthesised in the browser with the Web Audio API. No audio files and no dependencies: [`sounds.ts`](sounds.ts) is the whole thing.

**[Hear them on bencho.dev →](https://bencho.dev/sounds)**

```ts
import { play } from "./sounds";

button.addEventListener("click", () => play("tick"));
play("paid", { volume: 0.8 });
play("step", { pitch: 1.12 }); // a little higher
```

Browsers only start audio after a user gesture, so call `play()` from a click, a key press or a pointer event.

| Name | Call | Family |
| --- | --- | --- |
| Paid | `play("paid")` | Feedback |
| Landed | `play("landed")` | Feedback |
| Plop | `play("plop")` | Actions |
| Beacon | `play("beacon")` | Notifications |
| Drift | `play("drift")` | Movement |
| Hush | `play("hush")` | System |
| Wisp | `play("wisp")` | Movement |
| Sigh | `play("sigh")` | Feedback |
| Perk | `play("perk")` | Notifications |
| Purr | `play("purr")` | System |
| Lull | `play("lull")` | Movement |
| Whisk | `play("whisk")` | Navigation |
| Buzz | `play("buzz")` | Feedback |
| Bump | `play("bump")` | Feedback |
| Float | `play("float")` | Movement |
| Glide | `play("glide")` | Navigation |
| Step | `play("step")` | Navigation |
| Wander | `play("wander")` | Movement |
| Tick | `play("tick")` | Selection |
| Latch | `play("latch")` | Selection |
| Hail | `play("hail")` | Notifications |
| Drape | `play("drape")` | Movement |
| Boot | `play("boot")` | System |
| Drone | `play("drone")` | System |

Each sound is a short list of notes in `SOUNDS`. Change a number and you have a new sound; `schedule()` also renders into an `OfflineAudioContext` if you want a file.

[Bencho Pro](https://bencho.dev/pricing) has 140+ more, layering and WAV downloads.
