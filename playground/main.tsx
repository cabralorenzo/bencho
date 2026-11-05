import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../tokens.css";
import "./playground.css";
import { ContextMeter as B_context_meter } from "../blocks/context-meter/ContextMeter";
import "../blocks/context-meter/ContextMeter.css";
import { Slingshot as B_slingshot } from "../blocks/slingshot/Slingshot";
import "../blocks/slingshot/Slingshot.css";
import { AsciiWake as B_ascii_wake } from "../blocks/ascii-wake/AsciiWake";
import "../blocks/ascii-wake/AsciiWake.css";
import { CardSwap as B_card_swap } from "../blocks/card-swap/CardSwap";
import "../blocks/card-swap/CardSwap.css";
import { Counter as B_rolling_counter } from "../blocks/rolling-counter/Counter";
import "../blocks/rolling-counter/Counter.css";
import { WakeSlider as B_wake_slider } from "../blocks/wake-slider/WakeSlider";
import "../blocks/wake-slider/WakeSlider.css";
import { StackedBars as B_stacked_bars } from "../blocks/stacked-bars/StackedBars";
import "../blocks/stacked-bars/StackedBars.css";
import { ToastStack as B_toast_stack } from "../blocks/toast-stack/ToastStack";
import "../blocks/toast-stack/ToastStack.css";
import { FoldingBill as B_folding_bill } from "../blocks/folding-bill/FoldingBill";
import "../blocks/folding-bill/FoldingBill.css";
import { Reactions as B_emoji_reactions } from "../blocks/emoji-reactions/Reactions";
import "../blocks/emoji-reactions/Reactions.css";
import { Swap as B_asset_swap } from "../blocks/asset-swap/Swap";
import "../blocks/asset-swap/Swap.css";
import { HeatWord as B_heat_word } from "../blocks/heat-word/HeatWord";
import "../blocks/heat-word/HeatWord.css";
import { Compare as B_image_compare } from "../blocks/image-compare/Compare";
import "../blocks/image-compare/Compare.css";
import { Like as B_like } from "../blocks/like/Like";
import "../blocks/like/Like.css";
import { Signature as B_signature } from "../blocks/signature/Signature";
import "../blocks/signature/Signature.css";
import { VoiceNote as B_voice_note } from "../blocks/voice-note/VoiceNote";
import "../blocks/voice-note/VoiceNote.css";
import { Watcher as B_eye_tracker } from "../blocks/eye-tracker/Watcher";
import "../blocks/eye-tracker/Watcher.css";
import { Island as B_dynamic_island } from "../blocks/dynamic-island/Island";
import "../blocks/dynamic-island/Island.css";
import { Scrub as B_time_scrubber } from "../blocks/time-scrubber/Scrub";
import "../blocks/time-scrubber/Scrub.css";
import { Upload as B_upload_dropzone } from "../blocks/upload-dropzone/Upload";
import "../blocks/upload-dropzone/Upload.css";
import { Particles as B_particles } from "../blocks/particles/Particles";
import "../blocks/particles/Particles.css";
import { LabelInput as B_label_input } from "../blocks/label-input/LabelInput";
import "../blocks/label-input/LabelInput.css";
import { Otp as B_one_time_code } from "../blocks/one-time-code/Otp";
import "../blocks/one-time-code/Otp.css";
import { Generate as B_generate } from "../blocks/generate/Generate";
import "../blocks/generate/Generate.css";
import { StepPlayer as B_step_player } from "../blocks/step-player/StepPlayer";
import "../blocks/step-player/StepPlayer.css";
import { Tower as B_todo_tower } from "../blocks/todo-tower/Tower";
import "../blocks/todo-tower/Tower.css";
import { Accordion as B_image_accordion } from "../blocks/image-accordion/Accordion";
import "../blocks/image-accordion/Accordion.css";
import { LiquidGlass as B_glass_bubble } from "../blocks/glass-bubble/LiquidGlass";
import "../blocks/glass-bubble/LiquidGlass.css";
import { ActionNode as B_action_node } from "../blocks/action-node/ActionNode";
import "../blocks/action-node/ActionNode.css";
import { MagneticSelect as B_magnet_select } from "../blocks/magnet-select/MagneticSelect";
import "../blocks/magnet-select/MagneticSelect.css";
import { SlideConfirm as B_slide_confirm } from "../blocks/slide-confirm/SlideConfirm";
import "../blocks/slide-confirm/SlideConfirm.css";
import { Picker as B_picker } from "../blocks/picker/Picker";
import "../blocks/picker/Picker.css";
import { Checklist as B_checklist } from "../blocks/checklist/Checklist";
import "../blocks/checklist/Checklist.css";
import { Carousel as B_carousel } from "../blocks/carousel/Carousel";
import "../blocks/carousel/Carousel.css";
import { Palette as B_palette } from "../blocks/palette/Palette";
import "../blocks/palette/Palette.css";
import { Toggle as B_liq_toggle } from "../blocks/liq-toggle/Toggle";
import "../blocks/liq-toggle/Toggle.css";
import { GlassDock as B_dock } from "../blocks/dock/GlassDock";
import "../blocks/dock/GlassDock.css";
import { Sound as B_sound } from "../blocks/sound/Sound";
import "../blocks/sound/Sound.css";
import { Balance as B_pull } from "../blocks/pull/Balance";
import "../blocks/pull/Balance.css";
import { Escape as B_escape } from "../blocks/escape/Escape";
import "../blocks/escape/Escape.css";
import { Aspect as B_aspect } from "../blocks/aspect/Aspect";
import "../blocks/aspect/Aspect.css";
import { Tilt as B_tilt } from "../blocks/tilt/Tilt";
import "../blocks/tilt/Tilt.css";
import { Ball as B_drag_ball } from "../blocks/drag-ball/Ball";
import "../blocks/drag-ball/Ball.css";
import { Seek as B_seek } from "../blocks/seek/Seek";
import "../blocks/seek/Seek.css";
import { Slosh as B_slosh } from "../blocks/slosh/Slosh";
import "../blocks/slosh/Slosh.css";
import { Create as B_liq_create } from "../blocks/liq-create/Create";
import "../blocks/liq-create/Create.css";
import { FooterField } from "../blocks/footer-field/FooterField";
import "../blocks/footer-field/FooterField.css";
import { play, SOUND_NAMES } from "../sounds/sounds";

const BLOCKS = [
  { id: "context-meter", title: "Context meter", el: <B_context_meter /> },
  { id: "slingshot", title: "Slingshot", el: <B_slingshot /> },
  { id: "ascii-wake", title: "ASCII wake", el: <B_ascii_wake /> },
  { id: "card-swap", title: "Card swap", el: <B_card_swap /> },
  { id: "rolling-counter", title: "Rolling counter", el: <B_rolling_counter /> },
  { id: "wake-slider", title: "Wake slider", el: <B_wake_slider /> },
  { id: "stacked-bars", title: "Stacked bars", el: <B_stacked_bars /> },
  { id: "toast-stack", title: "Toast stack", el: <B_toast_stack /> },
  { id: "folding-bill", title: "Folding bill", el: <B_folding_bill /> },
  { id: "emoji-reactions", title: "Emoji reactions", el: <B_emoji_reactions /> },
  { id: "asset-swap", title: "Asset swap", el: <B_asset_swap /> },
  { id: "heat-word", title: "Heat map", el: <B_heat_word /> },
  { id: "image-compare", title: "Image compare", el: <B_image_compare /> },
  { id: "like", title: "Like", el: <B_like /> },
  { id: "signature", title: "Signature pad", el: <B_signature /> },
  { id: "voice-note", title: "Voice note", el: <B_voice_note /> },
  { id: "eye-tracker", title: "Eye tracker", el: <B_eye_tracker /> },
  { id: "dynamic-island", title: "Dynamic island", el: <B_dynamic_island /> },
  { id: "time-scrubber", title: "Time scrubber", el: <B_time_scrubber /> },
  { id: "upload-dropzone", title: "Upload dropzone", el: <B_upload_dropzone /> },
  { id: "particles", title: "Particles", el: <B_particles /> },
  { id: "label-input", title: "Label input", el: <B_label_input /> },
  { id: "one-time-code", title: "One-time code", el: <B_one_time_code /> },
  { id: "generate", title: "Generate", el: <B_generate /> },
  { id: "step-player", title: "Step player", el: <B_step_player /> },
  { id: "todo-tower", title: "Todo tower", el: <B_todo_tower /> },
  { id: "image-accordion", title: "Image accordion", el: <B_image_accordion /> },
  { id: "glass-bubble", title: "Glass bubble", el: <B_glass_bubble /> },
  { id: "action-node", title: "Action node", el: <B_action_node /> },
  { id: "magnet-select", title: "Magnetic select", el: <B_magnet_select /> },
  { id: "slide-confirm", title: "Slide to confirm", el: <B_slide_confirm /> },
  { id: "picker", title: "Assignees", el: <B_picker /> },
  { id: "checklist", title: "Checklist", el: <B_checklist /> },
  { id: "carousel", title: "Carousel", el: <B_carousel /> },
  { id: "palette", title: "Palette", el: <B_palette /> },
  { id: "liq-toggle", title: "Liquid toggle", el: <B_liq_toggle /> },
  { id: "dock", title: "Magnifying dock", el: <B_dock /> },
  { id: "sound", title: "Now playing", el: <B_sound /> },
  { id: "pull", title: "Pull to refresh", el: <B_pull /> },
  { id: "escape", title: "Escape button", el: <B_escape /> },
  { id: "aspect", title: "Aspect ratio", el: <B_aspect /> },
  { id: "tilt", title: "Tilt card", el: <B_tilt /> },
  { id: "drag-ball", title: "Dragging ball", el: <B_drag_ball /> },
  { id: "seek", title: "Search", el: <B_seek /> },
  { id: "slosh", title: "Slosh slider", el: <B_slosh /> },
  { id: "liq-create", title: "Create menu", el: <B_liq_create /> },
];

function App() {
  /* starts on the system's choice; the button then picks one outright */
  const [dark, setDark] = useState(() => matchMedia("(prefers-color-scheme: dark)").matches);
  /* on <html>, where tokens.css and the blocks that watch the theme read it */
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  return (
    <div className="pg">
      <header className="pg-head">
        <h1>Bencho, free blocks</h1>
        <button onClick={() => setDark((d) => !d)}>{dark ? "Light" : "Dark"}</button>
      </header>
      <div className="pg-sounds">
        {SOUND_NAMES.map((n) => (
          <button key={n} onClick={() => play(n)}>{n}</button>
        ))}
      </div>
      <main className="pg-wall">
        {BLOCKS.map((b) => (
          <section key={b.id} className="pg-card">
            <div className="pg-stage">{b.el}</div>
            <a href={"../blocks/" + b.id}>{b.title}</a>
          </section>
        ))}
      </main>
      {/* full width, as at the foot of bencho.dev, so a wide window can be tried */}
      <footer className="pg-foot">
        <FooterField />
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
