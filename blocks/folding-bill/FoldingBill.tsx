import { useEffect, useRef } from "react";

type Three = typeof import("three");

/* ══ Folding bill ═════════════════════════════════════════
   A one-dollar bill blown in glass that you can take hold of:
   drag it and it bends after your hand, fold a corner over and
   it creases, let go and it eases flat and floats back.

   ── IT IS CLOTH ─────────────────────────────────────────
   The bill is a grid of points joined by springs that hold
   their length — along the grid, across its diagonals, and
   two points apart for bending — integrated with Verlet and
   relaxed a dozen times a frame. Nothing about folding is
   written anywhere: take hold of one point and move it, and
   the rest follow because the springs will not stretch. The
   bending springs are the Stiffness knob, paper at one end and
   silk at the other.

   ── AND IT WANTS TO BE FLAT ─────────────────────────────
   Every point is pulled, gently, toward where it sits on a flat
   bill in the middle of the frame. Held, that pull nearly lets
   go so the hand wins; released, it smooths the folds out and
   brings the bill home, at the rate Settle sets.

   ── THE GLASS IS LIGHT AND A BUMP ───────────────────────
   No refraction: a pale, glossy surface under a studio of soft
   lights, with the real note's engraving raised by a bump map —
   the portrait, the seals, the lettering — over a puffed edge so
   the sheet reads as thick. The engraving is the public-domain
   one-dollar note, baked in grey by scripts/bill.sh. */

export const BILL_W = 340;
export const BILL_H = 240;
/* how far past its box the canvas reaches, as a multiple of it */
const SPILL = 2;

/* the sheet: points across and down, size, how far the camera
   stands, and how it is tipped to the light */
const SPEC = { nx: 46, ny: 20, w: 3.0, h: 3.0 / 2.35, cam: 3.95, tilt: [-0.32, 0.22, -0.06] as [number, number, number], fw: BILL_W, fh: BILL_H };

type Link = { a: number; b: number; len: number; k: number };

/* how far a point may be pulled from its place before the pull goes
   to rubber, and how sharp a fold may get (a bend link's shortest,
   as a share of its length) */
const REACH = 1.5;
const CREASE = 0.55;

/* the glass: a cool, pale blue-white */
const ICE = 0xdde8f0;

/* ── the corners ───────────────────────────────────────────
   The sheet is cut to a rounded rectangle: CORNER is the radius as
   a share of the bill's height. `inset` is how far a point is in
   from that outline (negative outside it), in pixels of a W×H map. */
const CORNER = 0.09;
function inset(x: number, y: number, W: number, H: number) {
  const r = CORNER * H;
  const qx = Math.max(r - x, x - (W - 1 - r), 0);
  const qy = Math.max(r - y, y - (H - 1 - r), 0);
  if (qx > 0 && qy > 0) return r - Math.hypot(qx, qy);
  return Math.min(x, y, W - 1 - x, H - 1 - y);
}

/* the outline as a mask: white inside, clear outside */
function outline(W: number, H: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#fff";
  g.beginPath(); g.roundRect(0, 0, W, H, CORNER * H); g.fill();
  return c;
}

/* ── the engraving, as heights ──────────────────────────────
   The real note's engraving (see bill-art.ts), turned into a height
   map: ink is raised and paper is the sheet, so the portrait, the
   seals and the lettering stand up out of the glass. Under it the
   sheet is puffed — it rises over its first 34px from the rim to a
   plateau — so the bill reads as a thick slab rather than a film.
   Light is high, dark is low. */
/* ── the printed frame's corners ───────────────────────────
   The note's printed border is square-cornered and the sheet is
   not, so the border's corners are cut round to match: a radius
   concentric with the sheet's own (the sheet's less the margin
   between the two), measured off the scan — the border runs from
   24 to 997 across a 1024 scan and 22 to 414 down a 437 one.
   Outside that curve the scan counts as blank paper. */
function offFrame(x: number, y: number, W: number, H: number) {
  const l = W * 0.0234, r = W * 0.9736, t = H * 0.0503, b = H * 0.9474;
  const rad = Math.max(4, CORNER * H - t);
  const cx = x < l + rad ? l + rad : x > r - rad ? r - rad : x;
  const cy = y < t + rad ? t + rad : y > b - rad ? b - rad : y;
  return cx !== x && cy !== y && Math.hypot(x - cx, y - cy) > rad;
}

/* the engraving as ink in the glass: two maps off the same scan.
   Colour, where the lines darken the glass they are cut into, and
   roughness (green channel), where the lines are frosted against the
   polished sheet — so they read even where no highlight crosses them.
   The scan is put through levels first, so its paper goes clean and
   only the line work carries. */
function etching(img: HTMLImageElement): { color: HTMLCanvasElement; rough: HTMLCanvasElement } {
  const W = img.naturalWidth, H = img.naturalHeight;
  const make = () => {
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    return c;
  };
  const src = make().getContext("2d", { willReadFrequently: true })!;
  src.drawImage(img, 0, 0);
  const d = src.getImageData(0, 0, W, H);
  const color = make(), rough = make();
  const cg = color.getContext("2d")!, rg = rough.getContext("2d")!;
  const cd = cg.createImageData(W, H), rd = rg.createImageData(W, H);
  for (let i = 0; i < d.data.length; i += 4) {
    const p = i / 4;
    const ink = offFrame(p % W, Math.floor(p / W), W, H) ? 0 : Math.min(1, Math.max(0, (255 - d.data[i] - 70) / 160));
    const v = 255 * (1 - 0.26 * ink);
    cd.data[i] = cd.data[i + 1] = cd.data[i + 2] = v; cd.data[i + 3] = 255;
    const r = 255 * (0.2 + 0.4 * ink);
    rd.data[i] = rd.data[i + 1] = rd.data[i + 2] = r; rd.data[i + 3] = 255;
  }
  cg.putImageData(cd, 0, 0);
  rg.putImageData(rd, 0, 0);
  return { color, rough };
}

/* with no image it is the plain sheet: the puffed rim and nothing on it */
function engraving(img: HTMLImageElement | null): HTMLCanvasElement {
  const W = img ? img.naturalWidth : 1024, H = img ? img.naturalHeight : 437;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);
  if (img) g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, W, H);
  const RIM = 34;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const ink = offFrame(x, y, W, H) ? 0 : 255 - d.data[i];
      /* distance in from the rounded outline, so the puffed rim
         turns the corners with the sheet */
      const edge = inset(x, y, W, H) / RIM;
      const e = Math.min(1, edge);
      const puff = e * (2 - e); // eased: steep at the rim, flat inside
      const h = 46 + 84 * puff + ink * 0.42 * puff;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = Math.min(255, h);
    }
  g.putImageData(d, 0, 0);
  /* soften, so the raised work has shoulders rather than steps */
  const out = document.createElement("canvas");
  out.width = W; out.height = H;
  const o = out.getContext("2d")!;
  o.filter = "blur(0.8px)";
  o.drawImage(c, 0, 0);
  return out;
}

/* a studio for the glass to reflect: dark room, soft boxes */
function studio(THREE: Three, pmrem: InstanceType<Three["PMREMGenerator"]>) {
  const room = new THREE.Scene();
  room.add(new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40),
    new THREE.MeshBasicMaterial({ color: 0x1c2026, side: THREE.BackSide })));
  const panel = (w: number, h: number, x: number, y: number, z: number, glow: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(glow), side: THREE.DoubleSide }));
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    room.add(m);
  };
  panel(14, 5, -4, 9, 9, 3.2);
  panel(3, 16, 12, 0, 6, 2.4);
  panel(16, 3, 0, -10, 6, 1.2);
  panel(20, 20, 0, 0, 16, 0.55);
  panel(10, 10, -12, 2, 2, 0.8);
  return pmrem.fromScene(room, 0.03).texture;
}

export function FoldingBill({
  stiffness = 40,
  settle = 0,
  print = "Plain",
}: {
  stiffness?: number;
  settle?: number;
  /* Plain glass, or the note's engraving etched into it */
  print?: string;
}) {
  const host = useRef<HTMLDivElement | null>(null);
  const live = useRef({ stiffness, settle, print });
  live.current = { stiffness, settle, print };
  const spec = SPEC;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    /* three.js is heavy for one block, so it is fetched here, the
       first time a bill is drawn, rather than with the page */
    let undo = () => {};
    let gone = false;
    import("three").then((THREE) => {
      if (gone) return;
      undo = mount(THREE, el);
    });
    return () => { gone = true; undo(); };
  }, []);

  function mount(THREE: Three, el: HTMLDivElement) {
    /* ── ON A PHONE IT IS LIGHTER, AND IT SLEEPS ───────────────
       The bill used to simulate and redraw every frame for as long
       as it was on screen: its idle flutter meant it never settled,
       and a glass material on a canvas twice the block's size at a
       phone's pixel density is a lot to redraw sixty times a second
       while somebody is only scrolling past. On a touch screen it now
       draws at a lower density without antialiasing, solves the
       sheet in fewer passes, lets the flutter die away a few seconds
       after the last touch, and stops the loop entirely once the
       sheet is still. A touch wakes it. A desktop keeps its density
       and passes but sleeps the same way, 6s after the cursor last
       crossed the bill; hovering it wakes it. */
    const light = window.matchMedia("(pointer: coarse), (max-width: 760px)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: !light, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, light ? 1.25 : 2));
    /* ── no edges ──────────────────────────────────────────────
       The canvas is SPILL times the block's box and centred on it,
       so a bill dragged or folded past the box keeps being drawn
       instead of being cut at an invisible line. The box is what the
       wall measures and fits; the canvas hangs out of it, and the
       camera's field widens by the same factor so nothing changes
       size. What clips it now is the card or the stage it sits in. */
    renderer.setSize(spec.fw * SPILL, spec.fh * SPILL, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    const cv = renderer.domElement;
    cv.className = "fbill-gl";
    cv.dataset.ink = "false";
    Object.assign(cv.style, {
      width: `${SPILL * 100}%`, height: `${SPILL * 100}%`,
      left: `${(-(SPILL - 1) / 2) * 100}%`, top: `${(-(SPILL - 1) / 2) * 100}%`,
    });
    el.appendChild(cv);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = studio(THREE, pmrem);
    const camera = new THREE.PerspectiveCamera(
      (2 * Math.atan(SPILL * Math.tan((15 * Math.PI) / 180)) * 180) / Math.PI,
      spec.fw / spec.fh, 0.1, 50);
    camera.position.set(0, 0, spec.cam);
    const { nx: NX, ny: NY, w: BW, h: BH } = spec;

    /* ── the sheet ── */
    const geo = new THREE.PlaneGeometry(BW, BH, NX - 1, NY - 1);
    const P = geo.attributes.position as InstanceType<Three["BufferAttribute"]>;
    const N = P.count;
    const rest = new Float32Array(P.array as Float32Array);
    const pos = new Float32Array(rest);
    const prev = new Float32Array(rest);

    const links: Link[] = [];
    const id = (i: number, j: number) => j * NX + i;
    const add = (a: number, b: number, k: number) => {
      const dx = rest[a * 3] - rest[b * 3], dy = rest[a * 3 + 1] - rest[b * 3 + 1];
      links.push({ a, b, len: Math.hypot(dx, dy), k });
    };
    for (let j = 0; j < NY; j++)
      for (let i = 0; i < NX; i++) {
        if (i < NX - 1) add(id(i, j), id(i + 1, j), 1);
        if (j < NY - 1) add(id(i, j), id(i, j + 1), 1);
        if (i < NX - 1 && j < NY - 1) { add(id(i, j), id(i + 1, j + 1), 0.7); add(id(i + 1, j), id(i, j + 1), 0.7); }
        if (i < NX - 2) add(id(i, j), id(i + 2, j), -1); // bend: weight from the knob
        if (j < NY - 2) add(id(i, j), id(i, j + 2), -1);
      }

    const mat = new THREE.MeshPhysicalMaterial({
      color: ICE,
      /* glossy enough to read as glass, quiet enough that the
         engraving is what you see rather than the room it reflects */
      metalness: 0.3,
      roughness: 0.2,
      clearcoat: 0.45,
      clearcoatRoughness: 0.12,
      envMapIntensity: 0.75,
      iridescence: 0.12,
      iridescenceIOR: 1.3,
      bumpScale: 6,
      side: THREE.DoubleSide,
    });
    /* ── plain or printed ──────────────────────────────────────
       Plain is the sheet with only its puffed rim, there from the
       first frame. The engraving arrives with its own small module
       the first time Print is asked for, and after that the two are
       swapped on the material without rebuilding anything. */
    const plain = new THREE.CanvasTexture(engraving(null));
    plain.colorSpace = THREE.NoColorSpace;
    plain.anisotropy = renderer.capabilities.getMaxAnisotropy();
    let bump: InstanceType<Three["CanvasTexture"]> | null = null;
    let ink: InstanceType<Three["CanvasTexture"]> | null = null;
    let frost: InstanceType<Three["CanvasTexture"]> | null = null;
    let fetching = false;
    let shown = "";
    const dress = () => {
      const want = live.current.print === "Print" ? "Print" : "Plain";
      if (want === "Print" && !bump) {
        if (!fetching) {
          fetching = true;
          /* a picture Bencho's build bakes in (a base64 data
       URL) — point this at your own */ Promise.resolve({ BILL_ART: "" as string }).then(({ BILL_ART }) => {
            const img = new Image();
            img.onload = () => {
              if (disposed) return;
              bump = new THREE.CanvasTexture(engraving(img));
              bump.colorSpace = THREE.NoColorSpace;
              bump.anisotropy = plain.anisotropy;
              const { color, rough } = etching(img);
              ink = new THREE.CanvasTexture(color);
              ink.colorSpace = THREE.SRGBColorSpace;
              ink.anisotropy = plain.anisotropy;
              frost = new THREE.CanvasTexture(rough);
              frost.colorSpace = THREE.NoColorSpace;
              frost.anisotropy = plain.anisotropy;
              shown = "";
            };
            img.src = BILL_ART;
          });
        }
        if (shown) return;
      }
      const now = want === "Print" && bump ? "Print" : "Plain";
      if (now === shown) return;
      shown = now;
      if (now === "Print") {
        mat.bumpMap = bump;
        mat.map = ink;
        mat.roughnessMap = frost;
        mat.roughness = 1; // the map carries it: 0.2 polished, 0.6 in the lines
      } else {
        mat.bumpMap = plain;
        mat.map = null;
        mat.roughnessMap = null;
        mat.roughness = 0.2;
      }
      mat.needsUpdate = true;
    };
    let disposed = false;
    /* the rounded corners: cut by an alpha mask, so the cloth
       underneath stays a plain grid and folds exactly as before */
    const cut = new THREE.CanvasTexture(outline(512, Math.round(512 / 2.35)));
    cut.colorSpace = THREE.NoColorSpace;
    mat.alphaMap = cut;
    mat.alphaTest = 0.5;
    const mesh = new THREE.Mesh(geo, mat);
    /* tipped back a little and turned, so the light runs across it
       rather than lying flat on it */
    mesh.rotation.set(...spec.tilt);
    scene.add(mesh);

    /* ── the hand ── */
    let held = -1;
    let holdZ = 0;
    const target = new THREE.Vector3();
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const toNdc = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    /* the point under the pointer on a plane facing the camera at
       the held point's depth */
    /* the sheet is tipped, so the drag is worked out in the world —
       on a plane facing the camera at the held point's depth — and
       handed to the cloth in the sheet's own frame */
    const aim = () => {
      ray.setFromCamera(ndc, camera);
      const t = (holdZ - ray.ray.origin.z) / ray.ray.direction.z;
      target.copy(ray.ray.direction).multiplyScalar(t).add(ray.ray.origin);
      mesh.worldToLocal(target);
      /* ── the hand has a reach ──────────────────────────────────
         Past REACH from where the held point sits on the flat bill
         the pull turns to rubber: a fifth as much again, no more.
         Without it a long drag dragged one point across the frame
         while the cloth behind it could not keep its length, and the
         sheet tore into a stretched, creased strip. */
      if (held >= 0) {
        const k = held * 3;
        const dx = target.x - rest[k], dy = target.y - rest[k + 1], dz = target.z - rest[k + 2];
        const d = Math.hypot(dx, dy, dz);
        if (d > REACH) {
          const f = (REACH + (d - REACH) * 0.2) / d;
          target.set(rest[k] + dx * f, rest[k + 1] + dy * f, rest[k + 2] + dz * f);
        }
      }
    };
    const down = (e: PointerEvent) => {
      toNdc(e);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObject(mesh)[0];
      cv.dataset.ink = String(!!hit);
      if (!hit) return;
      const local = mesh.worldToLocal(hit.point.clone());
      let best = -1, bd = Infinity;
      for (let n = 0; n < N; n++) {
        const d = (pos[n * 3] - local.x) ** 2 + (pos[n * 3 + 1] - local.y) ** 2 + (pos[n * 3 + 2] - local.z) ** 2;
        if (d < bd) { bd = d; best = n; }
      }
      held = best;
      holdZ = hit.point.z;
      touched = performance.now();
      flutter = 1;
      calm = 0;
      aim();
      cv.dataset.held = "true";
      try { cv.setPointerCapture(e.pointerId); } catch { /* scripted pointers */ }
      wake();
    };
    const move = (e: PointerEvent) => {
      toNdc(e);
      if (held >= 0) aim();
      else {
        ray.setFromCamera(ndc, camera);
        const on = ray.intersectObject(mesh).length > 0;
        cv.dataset.over = on ? "true" : "";
        /* read by the wall card: only the bill itself is the block,
           the empty canvas round it is the card's to open */
        cv.dataset.ink = String(on);
        /* a cursor over the bill keeps it awake, and wakes it if it
           had gone still: the flutter comes back under the hand */
        if (on) { touched = performance.now(); calm = 0; wake(); }
      }
    };
    const up = (e: PointerEvent) => {
      if (held < 0) return;
      held = -1;
      cv.dataset.held = "";
      try { cv.releasePointerCapture(e.pointerId); } catch { /* never captured */ }
    };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);

    /* ── the loop ── */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let seen = true;
    let running = false;
    let last = performance.now();
    let clock = 0;
    const H = 1 / 120;
    const PASSES = light ? 9 : 16;
    /* when a hand last moved the sheet, or a cursor last crossed it;
       the flutter and the loop both answer to it. A phone lets the
       flutter go after 2s, a desktop after 6 — there it is what you
       see while reading the wall, so it gets longer to be seen */
    const GRACE = light ? 2 : 6;
    let touched = performance.now();
    let flutter = 1;
    let calm = 0;

    const step = () => {
      const { stiffness: st, settle: se } = live.current;
      const bend = 0.04 + (st / 100) * 0.5;
      /* held, the pull home nearly lets go so the hand wins */
      const home = (0.3 + (se / 100) * 7) * (held >= 0 ? 0.04 : 1);
      for (let n = 0; n < N; n++) {
        const k = n * 3;
        const rx = rest[k], ry = rest[k + 1];
        /* at rest the sheet is not flat: a long, soft wave along its
           length (the curl a bill has out of a wallet), and a slow
           flutter on top of it — both are what give the glass
           highlights to carry */
        const rz = Math.sin(rx * 1.25 + 0.6) * 0.16 + Math.cos(ry * 2.2) * 0.04
          + (still ? 0 : Math.sin(clock * 1.3 + rx * 1.7 + ry * 0.8) * 0.035 * flutter);
        for (let c = 0; c < 3; c++) {
          const p = pos[k + c];
          const v = (p - prev[k + c]) * 0.982;
          const want = c === 0 ? rx : c === 1 ? ry : rz;
          prev[k + c] = p;
          pos[k + c] = p + v + (want - p) * home * H * H * 60;
        }
      }
      if (held >= 0) {
        const k = held * 3;
        pos[k] = target.x; pos[k + 1] = target.y; pos[k + 2] = target.z;
      }
      /* sixteen passes: enough that a hard pull is answered by the
         whole sheet rather than rippling the edge nearest the hand */
      for (let it = 0; it < PASSES; it++) {
        for (const l of links) {
          const a = l.a * 3, b = l.b * 3;
          const dx = pos[b] - pos[a], dy = pos[b + 1] - pos[a + 1], dz = pos[b + 2] - pos[a + 2];
          const d = Math.hypot(dx, dy, dz) || 1e-6;
          let w = (l.k < 0 ? bend : l.k) * 0.5 * (d - l.len) / d;
          /* ── a fold has a limit ────────────────────────────────
             A bend link spans two cells, so how short it gets is how
             sharp the crease is. Under CREASE of its length it is
             pushed back out at full strength: the bill can fold over
             on itself in a round, but never flatten into a knife
             edge, which is where the jagged seam came from. */
          if (l.k < 0 && d < l.len * CREASE) w = 0.5 * (d - l.len * CREASE) / d;
          const pa = l.a === held ? 0 : 1, pb = l.b === held ? 0 : 1;
          const s = pa + pb || 1;
          pos[a] += dx * w * (2 * pa / s); pos[a + 1] += dy * w * (2 * pa / s); pos[a + 2] += dz * w * (2 * pa / s);
          pos[b] -= dx * w * (2 * pb / s); pos[b + 1] -= dy * w * (2 * pb / s); pos[b + 2] -= dz * w * (2 * pb / s);
        }
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      dress();
      if (held >= 0) touched = now;
      const idle = (now - touched) / 1000;
      flutter = Math.max(0, Math.min(1, 1 - (idle - GRACE) / 1.5));
      if (still) flutter = 0;
      const n = Math.max(1, Math.round(dt / H));
      for (let s = 0; s < n; s++) step();
      /* still? count frames where nothing moved more than a hair */
      let moved = 0;
      for (let k = 0; k < pos.length; k++) moved = Math.max(moved, Math.abs(pos[k] - prev[k]));
      calm = held < 0 && moved < 2e-4 ? calm + 1 : 0;
      (P.array as Float32Array).set(pos);
      P.needsUpdate = true;
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
      renderer.render(scene, camera);
      /* asleep once the flutter is gone and the sheet has settled, on
         every device; the last frame drawn stays on the canvas. It ran
         forever on a desktop and was the costliest block on the wall:
         ~37% of the main thread while nobody touched it (2026-11-07) */
      const sleep = flutter === 0 && calm > 20;
      if (seen && !sleep) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const wake = () => {
      if (running || !seen) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([row]) => {
      seen = row.isIntersecting;
      if (seen) wake();
    });
    io.observe(el);
    wake();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
      disposed = true;
      geo.dispose(); mat.dispose(); plain.dispose(); bump?.dispose(); ink?.dispose(); frost?.dispose(); cut.dispose();
      scene.environment?.dispose(); pmrem.dispose(); renderer.dispose();
      cv.remove();
    };
  }

  return <div ref={host} className="fbill" style={{ width: spec.fw, height: spec.fh }} />;
}
