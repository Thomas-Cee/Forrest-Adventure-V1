import { useEffect, useRef, useState } from "react";
import {
  COLS,
  GCOLS,
  GROWS,
  ROWS,
  TILE,
  type Facing,
  grove,
  marsh,
  pond,
  ducklings,
  den,
  cove,
  yard,
  leaf,
  glade,
  world,
} from "@/game/world";
import {
  freshSim,
  interact,
  nearestPrompt,
  setForcedKeys,
  shoot,
  simFromSave,
  step,
  swing,
  toSave,
  type SaveData,
  type Sim,
} from "@/game/sim";

const SAVE_KEY = "forest-adventure-v1";

const SPRITES = {
  down: "/sprites/wren-down.png",
  up: "/sprites/wren-up.png",
  side: "/sprites/wren-side.png",
  tree: "/sprites/tree.png",
  fox: "/sprites/fox.png",
  owl: "/sprites/owl.png",
  lantern: "/sprites/lantern.png",
  acorn: "/sprites/acorn.png",
  oak: "/sprites/oak.png",
  bear: "/sprites/bear.png?v=2",
  rifle: "/sprites/rifle.png",
  cave: "/sprites/cave-door.png",
  frogdoor: "/sprites/frog-door.png",
  chickdoor: "/sprites/chick-door.png?v=2",
  beardoor: "/sprites/bear-door.png",
  squid: "/sprites/squid.png",
  pistol: "/sprites/pistol.png",
  squiddor: "/sprites/squid-door.png",
  cerberus: "/sprites/cerberus.png",
  blaster: "/sprites/blaster.png",
  dogdoor: "/sprites/dog-door.png",
  isopod: "/sprites/isopod.png",
  stick: "/sprites/stick.png",
  isodoor: "/sprites/isopod-door.png",
} as const;

type SpriteKey = keyof typeof SPRITES;

const HEIGHTS: Record<SpriteKey, number> = {
  down: 86,
  up: 86,
  side: 86,
  tree: 132,
  fox: 68,
  owl: 64,
  lantern: 50,
  acorn: 32,
  oak: 176,
  bear: 108,
  rifle: 18,
  cave: 156,
  frogdoor: 150,
  chickdoor: 150,
  beardoor: 150,
  squid: 118,
  pistol: 22,
  squiddor: 150,
  cerberus: 120,
  blaster: 20,
  dogdoor: 156,
  isopod: 86,
  stick: 54,
  isodoor: 150,
};

function drawSteelSword(ctx: CanvasRenderingContext2D) {
  ctx.scale(0.62, 0.62);
  ctx.beginPath();
  ctx.moveTo(0, -52);
  ctx.lineTo(4.5, -8);
  ctx.lineTo(-4.5, -8);
  ctx.closePath();
  const steel = ctx.createLinearGradient(-5, 0, 5, 0);
  steel.addColorStop(0, "#7d8792");
  steel.addColorStop(0.28, "#eef3f7");
  steel.addColorStop(0.55, "#b7c2cc");
  steel.addColorStop(1, "#5e6872");
  ctx.fillStyle = steel;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-1.4, -46);
  ctx.lineTo(-2.8, -12);
  ctx.stroke();
  ctx.strokeStyle = "rgba(40,48,56,0.45)";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(0, -44);
  ctx.lineTo(0, -12);
  ctx.stroke();
  ctx.fillStyle = "#c6a15a";
  ctx.beginPath();
  ctx.moveTo(-15, -7);
  ctx.quadraticCurveTo(-12, -1, -6, -3);
  ctx.lineTo(6, -3);
  ctx.quadraticCurveTo(12, -1, 15, -7);
  ctx.lineTo(13, -10);
  ctx.quadraticCurveTo(0, -13, -13, -10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#7a5a24";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#4a2e22";
  ctx.beginPath();
  ctx.roundRect(-3, -2, 6, 16, 2);
  ctx.fill();
  ctx.fillStyle = "#c6a15a";
  ctx.fillRect(-3.2, 1, 6.4, 1.3);
  ctx.fillRect(-3.2, 6, 6.4, 1.3);
  ctx.fillRect(-3.2, 11, 6.4, 1.3);
  ctx.fillStyle = "#d7b56a";
  ctx.beginPath();
  ctx.arc(0, 16, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7a5a24";
  ctx.beginPath();
  ctx.arc(0, 16, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawShotgun(ctx: CanvasRenderingContext2D) {
  ctx.scale(0.62, 0.62);
  ctx.fillStyle = "#6a3d22";
  ctx.beginPath();
  ctx.moveTo(-2, -1);
  ctx.quadraticCurveTo(-16, -2, -24, 6);
  ctx.quadraticCurveTo(-22, 12, -14, 9);
  ctx.lineTo(-4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#3d2414";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  const metal = ctx.createLinearGradient(0, -7, 0, 7);
  metal.addColorStop(0, "#e7eef3");
  metal.addColorStop(0.45, "#8e99a3");
  metal.addColorStop(1, "#3e464d");
  ctx.fillStyle = metal;
  ctx.beginPath();
  ctx.roundRect(-7, -5, 16, 9, 1.4);
  ctx.fill();
  ctx.fillStyle = "#2c3338";
  ctx.fillRect(7, -4.6, 30, 2.5);
  ctx.fillRect(7, -1.5, 30, 2.5);
  ctx.fillStyle = "#15191c";
  ctx.fillRect(36, -5, 2.2, 3.2);
  ctx.fillRect(36, -1.9, 2.2, 3.2);
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(9, -4);
  ctx.lineTo(34, -4);
  ctx.stroke();
  ctx.fillStyle = "#c9a24a";
  ctx.beginPath();
  ctx.arc(36.6, -5.6, 1.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8a5730";
  ctx.beginPath();
  ctx.roundRect(8, 1.4, 16, 4.2, 1.2);
  ctx.fill();
  ctx.strokeStyle = "#2a241c";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.arc(0, 6.2, 3.3, 0.15, Math.PI - 0.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0.2, 3.2);
  ctx.lineTo(1.1, 7.2);
  ctx.stroke();
}

function drawDuckling(ctx: CanvasRenderingContext2D, fed: boolean, phase: number) {
  const bob = Math.sin(phase) * (fed ? 0.4 : 1.8);
  ctx.save();
  ctx.translate(0, bob);
  ctx.fillStyle = "rgba(8,16,10,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 4, 11, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = fed ? "#e2ae3a" : "#f6d15a";
  ctx.beginPath();
  ctx.ellipse(0, -5, 12, 7.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f0b43a";
  ctx.beginPath();
  ctx.ellipse(-7, -4, 4.5, 2.4, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffe38a";
  ctx.beginPath();
  ctx.arc(7, -12, 5.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e07a1f";
  ctx.beginPath();
  ctx.moveTo(11, -12);
  ctx.lineTo(16, -10);
  ctx.lineTo(11, -8.5);
  ctx.closePath();
  ctx.fill();
  if (fed) {
    ctx.strokeStyle = "#3a2a14";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(8, -13, 1.3, 0.25, Math.PI - 0.25);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#1a120c";
    ctx.beginPath();
    ctx.arc(8.2, -13, 1.15, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#e07a1f";
  ctx.beginPath();
  ctx.ellipse(-2, 1, 2.1, 1.1, 0, 0, Math.PI * 2);
  ctx.ellipse(3, 1, 2.1, 1.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawForestBlob(ctx: CanvasRenderingContext2D, time: number) {
  const wob = Math.sin(time / 260);
  ctx.save();
  ctx.translate(0, Math.sin(time / 180) * 2);
  ctx.fillStyle = "rgba(8,16,10,0.32)";
  ctx.beginPath();
  ctx.ellipse(0, 8, 42 + wob * 2, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-46, -6);
  ctx.bezierCurveTo(-62, -24, -44, -58, -10, -64 + wob * 3);
  ctx.bezierCurveTo(10, -74, 40, -66, 50, -38);
  ctx.bezierCurveTo(64, -14, 48, 6, 18, 8);
  ctx.bezierCurveTo(0, 16, -24, 12, -46, -6);
  ctx.closePath();
  const body = ctx.createLinearGradient(0, -72, 0, 14);
  body.addColorStop(0, "#7eaa52");
  body.addColorStop(0.42, "#3f6c34");
  body.addColorStop(1, "#1e3c1a");
  ctx.fillStyle = body;
  ctx.fill();
  ctx.fillStyle = "rgba(14,32,12,0.4)";
  ctx.beginPath();
  ctx.ellipse(2, 2, 34, 9, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = "#86b254";
  ctx.beginPath();
  ctx.ellipse(-20, -30, 15, 9, -0.4, 0, Math.PI * 2);
  ctx.ellipse(18, -40, 13, 8, 0.35, 0, Math.PI * 2);
  ctx.ellipse(4, -16, 11, 6, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(236, 246, 214, 0.38)";
  ctx.beginPath();
  ctx.ellipse(-12, -46, 16, 6, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2d6428";
  ctx.beginPath();
  ctx.ellipse(30, -22, 9, 3.4, 0.9, 0, Math.PI * 2);
  ctx.ellipse(-32, -14, 8, 3, -0.7, 0, Math.PI * 2);
  ctx.ellipse(8, -58, 7, 2.6, 0.2, 0, Math.PI * 2);
  ctx.fill();
  const eye = (x: number, y: number) => {
    ctx.fillStyle = "#142010";
    ctx.beginPath();
    ctx.ellipse(x, y, 6.2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f3f0dc";
    ctx.beginPath();
    ctx.ellipse(x, y, 4.2, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a140c";
    ctx.beginPath();
    ctx.arc(x + 0.8, y + 0.3, 1.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(x - 1.1, y - 1.1, 0.8, 0, Math.PI * 2);
    ctx.fill();
  };
  eye(-16, -34);
  eye(14, -30);
  ctx.strokeStyle = "#173216";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-12, -16);
  ctx.quadraticCurveTo(2, -9 + wob * 2, 14, -15);
  ctx.stroke();
  ctx.restore();
}

interface Hud {
  lit: number;
  found: number;
  note: string;
  prompt: string | null;
  mode: Sim["mode"];
  speaker: string;
  line: string;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  hp: number;
  hasKey: boolean;
  hasSword: boolean;
  hasGun: boolean;
  hasRifle: boolean;
  hasPistol: boolean;
  hasBlaster: boolean;
  hasStick: boolean;
  hasCorn: boolean;
  fed: number;
  blobHp: number;
  blobAlive: boolean;
  frogHp: number;
  frogAlive: boolean;
  bears: number;
  squidHp: number;
  squidAlive: boolean;
  dogHp: number;
  dogAlive: boolean;
  isoHp: number;
  isoAlive: boolean;
}

function readSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (!data || (data.version !== 1 && data.version !== 2) || typeof data.x !== "number" || typeof data.y !== "number") return null;
    if (!Array.isArray(data.lit) || !Array.isArray(data.found)) return null;
    return data;
  } catch {
    return null;
  }
}

function writeSave(sim: Sim) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave(sim)));
  } catch {
    /* private mode */
  }
}

function tileHash(x: number, y: number) {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return (n >>> 0) % 100;
}

function facingYaw(facing: Facing) {
  if (facing === "right") return 0;
  if (facing === "left") return Math.PI;
  if (facing === "up") return -Math.PI / 2;
  return Math.PI / 2;
}

function emptyHud(): Hud {
  return {
    lit: 0,
    found: 0,
    note: "Five lanterns mark the trail to the old oak.",
    prompt: null,
    mode: "play",
    speaker: "",
    line: "",
    level: 1,
    hp: 5,
    hasKey: false,
    hasSword: false,
    hasGun: false,
    hasCorn: false,
    fed: 0,
    blobHp: 8,
    blobAlive: true,
    frogHp: 6,
    frogAlive: true,
    hasRifle: false,
    hasPistol: false,
    hasBlaster: false,
    hasStick: false,
    bears: 2,
    squidHp: 5,
    squidAlive: true,
    dogHp: 6,
    dogAlive: true,
    isoHp: 10,
    isoAlive: true,
  };
}

export function ForestAdventure() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim | null>(null);
  const screenRef = useRef<"title" | "game">("title");
  const keysRef = useRef(new Set<string>());
  const stickRef = useRef({ x: 0, y: 0 });
  const stickId = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const reduceRef = useRef(false);
  const [screen, setScreen] = useState<"title" | "game">("title");
  const [hud, setHud] = useState<Hud>(emptyHud);
  const [saved, setSaved] = useState<SaveData | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const meters = useRef({ lit: 0, found: 0, mode: "play" as Sim["mode"], sig: "" });
  const lookRef = useRef<() => void>(() => {});
  const camRef = useRef({ x: 0, y: 0, ready: false });
  const levelSeen = useRef(0);
  const hudApi = useRef<(sim: Sim) => void>(() => {});
  hudApi.current = (sim: Sim) => {
    const prompt = nearestPrompt(sim);
    setHud({
      lit: sim.lit.size,
      found: sim.found.size,
      note: sim.note,
      prompt: prompt?.label ?? null,
      mode: sim.mode,
      speaker: sim.speaker,
      line: sim.line,
      level: sim.level,
      hp: sim.hp,
      hasKey: sim.hasKey,
      hasSword: sim.hasSword,
      hasGun: sim.hasGun,
      hasCorn: sim.hasCorn,
      fed: sim.fed?.size ?? 0,
      blobHp: sim.blobHp,
      blobAlive: sim.blobAlive,
      frogHp: sim.frogHp,
      frogAlive: sim.frogAlive,
      hasRifle: sim.hasRifle,
      hasPistol: sim.hasPistol,
      bears: (sim.bear1Alive ? 1 : 0) + (sim.bear2Alive ? 1 : 0),
      squidHp: sim.squidHp,
      squidAlive: sim.squidAlive,
      hasBlaster: sim.hasBlaster,
      dogHp: sim.dogHp,
      dogAlive: sim.dogAlive,
      hasStick: sim.hasStick,
      isoHp: sim.isoHp,
      isoAlive: sim.isoAlive,
    });
  };

  function unlockAudio() {
    const AC = window.AudioContext;
    if (!audioRef.current) audioRef.current = new AC();
    void audioRef.current.resume();
  }

  function chime(freq: number, extra?: number) {
    const ctx = audioRef.current;
    if (!ctx || reduceRef.current) return;
    const play = (f: number, delay: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const t = ctx.currentTime + delay;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.34);
    };
    play(freq, 0);
    if (extra) play(extra, 0.08);
  }

  function begin(save: SaveData | null) {
    unlockAudio();
    const sim = save ? simFromSave(save) : freshSim();
    simRef.current = sim;
    meters.current = { lit: sim.lit.size, found: sim.found.size, mode: sim.mode, sig: "" };
    camRef.current.ready = false;
    screenRef.current = "game";
    setScreen("game");
    setForcedKeys([]);
    keysRef.current.clear();
    stickRef.current = { x: 0, y: 0 };
    setKnob({ x: 0, y: 0 });
    writeSave(sim);
    hudApi.current(sim);
  }

  function rest() {
    const sim = simRef.current;
    if (sim) {
      writeSave(sim);
      setSaved(toSave(sim));
    }
    screenRef.current = "title";
    setScreen("title");
    setForcedKeys([]);
    keysRef.current.clear();
  }

  function restart() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      /* ignore */
    }
    setSaved(null);
    begin(null);
  }

  function look() {
    const sim = simRef.current;
    if (!sim || screenRef.current !== "game") return;
    unlockAudio();
    interact(sim);
    writeSave(sim);
    hudApi.current(sim);
  }
  lookRef.current = look;

  useEffect(() => {
    setSaved(readSave());
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: Partial<Record<SpriteKey, HTMLImageElement>> = {};
    for (const key of Object.keys(SPRITES) as SpriteKey[]) {
      const img = new Image();
      img.src = SPRITES[key];
      images[key] = img;
    }

    const keys = keysRef.current;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const onButton = tag === "BUTTON" || target?.getAttribute("role") === "button";
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (!onButton && (e.code === "Space" || e.code.startsWith("Arrow"))) e.preventDefault();
      if (!e.repeat) keys.add(e.code);
      if (e.repeat) return;
      if (e.code === "Escape") {
        const sim = simRef.current;
        if (!sim || screenRef.current !== "game") return;
        if (sim.mode === "talk") sim.mode = "play";
        else if (sim.mode === "play") sim.mode = "pause";
        else if (sim.mode === "pause") sim.mode = "play";
        hudApi.current(sim);
        return;
      }
      if ((e.code === "Space" || e.code === "KeyE") && !onButton) {
        const sim = simRef.current;
        if (e.code === "Space" && sim && sim.mode === "play") {
          if (sim.level === 2 && sim.hasSword) {
            swing(sim);
            writeSave(sim);
            hudApi.current(sim);
            return;
          }
          if (sim.level === 8 && sim.hasStick) {
            swing(sim);
            writeSave(sim);
            hudApi.current(sim);
            return;
          }
          if (sim.level === 3 && sim.hasGun) {
            shoot(sim);
            writeSave(sim);
            hudApi.current(sim);
            return;
          }
          if (sim.level === 5 && sim.hasRifle) {
            shoot(sim);
            writeSave(sim);
            hudApi.current(sim);
            return;
          }
          if (sim.level === 6 && sim.hasPistol) {
            shoot(sim);
            writeSave(sim);
            hudApi.current(sim);
            return;
          }
          if (sim.level === 7 && sim.hasBlaster) {
            shoot(sim);
            writeSave(sim);
            hudApi.current(sim);
            return;
          }
        }
        lookRef.current();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.code);
    };
    const clearKeys = () => {
      keys.clear();
      stickRef.current = { x: 0, y: 0 };
      setKnob({ x: 0, y: 0 });
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);
    document.addEventListener("visibilitychange", clearKeys);

    const cam = camRef.current;
    let last = performance.now();
    let acc = 0;
    let padWasDown = false;
    let raf = 0;

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const drawSprite = (key: SpriteKey, x: number, y: number, flip = false, alpha = 1) => {
      const img = images[key];
      const h = HEIGHTS[key];
      const aspect = img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 0.6;
      const w = h * aspect;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(8, 18, 12, 0.32)";
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(10, w * 0.28), 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      if (flip) ctx.scale(-1, 1);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, -w / 2, -h, w, h);
      } else {
        ctx.fillStyle = key === "lantern" ? "#e6a23c" : "#3d6b45";
        ctx.fillRect(-w / 2, -h, w, h * 0.8);
      }
      ctx.restore();
    };

    const caveScratch = document.createElement("canvas");
    const caveCtx = caveScratch.getContext("2d");

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!simRef.current) simRef.current = freshSim();
      const sim = simRef.current;

      let gx = 0;
      let gy = 0;
      let padDown = false;
      const pads = navigator.getGamepads?.();
      if (pads) {
        for (const pad of pads) {
          if (!pad) continue;
          const ax = pad.axes[0] ?? 0;
          const ay = pad.axes[1] ?? 0;
          if (Math.hypot(ax, ay) > Math.hypot(gx, gy)) {
            gx = ax;
            gy = ay;
          }
          if (pad.buttons[0]?.pressed) padDown = true;
        }
      }
      const touch = stickRef.current;
      const stick = Math.hypot(touch.x, touch.y) > 0.05 ? touch : { x: gx, y: gy };
      if (padDown && !padWasDown) lookRef.current();
      padWasDown = padDown;

      const playing = screenRef.current === "game";
      if (playing) step(sim, dt, keys, stick);
      else {
        sim.speed = 0;
        sim.moving = false;
      }
      if (reduceRef.current) sim.particles.length = 0;

      const mark = meters.current;
      if (sim.lit.size > mark.lit) chime(523, 784);
      if (sim.found.size > mark.found) chime(698);
      if (sim.mode === "won" && mark.mode !== "won") chime(392, 659);
      else if (sim.mode === "talk" && mark.mode !== "talk") chime(440);
      mark.lit = sim.lit.size;
      mark.found = sim.found.size;
      mark.mode = sim.mode;

      window.__controlsTest = {
        getX: () => sim.x,
        getY: () => sim.y,
        getSpeed: () => sim.speed,
        getYaw: () => facingYaw(sim.facing),
        setKeys: (codes: string[]) => setForcedKeys(codes),
      };

      const prompt = nearestPrompt(sim);
      const sig = [
        screenRef.current,
        sim.mode,
        sim.lit.size,
        sim.found.size,
        sim.note,
        sim.speaker,
        sim.line,
        prompt?.label ?? "",
        sim.level,
        sim.hp,
        sim.hasKey ? 1 : 0,
        sim.hasSword ? 1 : 0,
        sim.hasGun ? 1 : 0,
        sim.hasCorn ? 1 : 0,
        sim.fed?.size ?? 0,
        sim.blobHp,
        sim.blobAlive ? 1 : 0,
        sim.frogHp,
        sim.frogAlive ? 1 : 0,
        sim.hasRifle ? 1 : 0,
        (sim.bear1Alive ? 1 : 0) + (sim.bear2Alive ? 1 : 0),
        sim.bear1Hp,
        sim.bear2Hp,
        sim.hasPistol ? 1 : 0,
        sim.squidHp,
        sim.squidAlive ? 1 : 0,
        sim.hasBlaster ? 1 : 0,
        sim.dogHp,
        sim.dogAlive ? 1 : 0,
        sim.hasStick ? 1 : 0,
        sim.isoHp,
        sim.isoAlive ? 1 : 0,
      ].join("|");
      if (sig !== mark.sig) {
        mark.sig = sig;
        hudApi.current(sim);
        if (playing) {
          acc += dt;
          if (acc > 1.2) {
            acc = 0;
            writeSave(sim);
          }
        }
      }

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const viewW = canvas.clientWidth;
      const viewH = canvas.clientHeight;
      if (viewW < 2 || viewH < 2) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, viewW, viewH);
      ctx.fillStyle = "#14261c";
      ctx.fillRect(0, 0, viewW, viewH);

      const mapCols = sim.level === 1 ? COLS : GCOLS;
      const mapRows = sim.level === 1 ? ROWS : GROWS;
      const tiles =
        sim.level === 8
          ? leaf.tiles
          : sim.level === 7
            ? yard.tiles
            : sim.level === 6
            ? cove.tiles
            : sim.level === 5
              ? den.tiles
              : sim.level === 4
                ? pond.tiles
                : sim.level === 3
                  ? marsh.tiles
                  : sim.level === 2
                    ? grove.tiles
                    : world.tiles;
      const mapW = mapCols * TILE;
      const mapH = mapRows * TILE;
      const pad = viewW < 820 ? Math.min(220, viewH * 0.2) : 0;
      const clamp = (target: number, map: number, view: number) =>
        map <= view ? (map - view) / 2 : Math.max(-pad, Math.min(map - view + pad, target));
      const tx = clamp(sim.x - viewW / 2, mapW, viewW);
      const ty = clamp(sim.y - viewH / 2, mapH, viewH);
      if (levelSeen.current !== sim.level) {
        levelSeen.current = sim.level;
        cam.ready = false;
      }
      if (!cam.ready || reduceRef.current) {
        cam.x = tx;
        cam.y = ty;
        cam.ready = true;
      } else {
        const k = Math.min(1, dt * 8);
        cam.x += (tx - cam.x) * k;
        cam.y += (ty - cam.y) * k;
      }

      ctx.save();
      ctx.translate(-cam.x, -cam.y);
      ctx.beginPath();
      ctx.rect(0, 0, mapW, mapH);
      ctx.clip();

      const x0 = Math.max(0, Math.floor(cam.x / TILE) - 2);
      const y0 = Math.max(0, Math.floor(cam.y / TILE) - 2);
      const x1 = Math.min(mapCols - 1, Math.floor((cam.x + viewW) / TILE) + 2);
      const y1 = Math.min(mapRows - 1, Math.floor((cam.y + viewH) / TILE) + 2);

      for (let tyi = y0; tyi <= y1; tyi++) {
        for (let txi = x0; txi <= x1; txi++) {
          const tile = tiles[tyi][txi];
          const px = txi * TILE;
          const py = tyi * TILE;
          const h = tileHash(txi, tyi);
          ctx.fillStyle = h < 33 ? "#1b3c2c" : h < 66 ? "#234833" : "#2a523b";
          ctx.fillRect(px, py, TILE + 1, TILE + 1);
          if (tile === "grass" && h % 19 === 0) {
            ctx.fillStyle = h % 2 ? "#e6b84a" : "#f3ead7";
            ctx.beginPath();
            ctx.arc(px + TILE * 0.5, py + TILE * 0.55, 2.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      const pondDraw = (cx: number, cy: number, rx: number, ry: number) => {
        ctx.beginPath();
        ctx.ellipse(cx * TILE, cy * TILE, rx * TILE, ry * TILE, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#102f38";
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx * TILE - 6, cy * TILE - 4, rx * TILE * 0.72, ry * TILE * 0.62, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#1c5562";
        ctx.fill();
        if (!reduceRef.current) {
          ctx.strokeStyle = "rgba(214, 236, 232, 0.28)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(cx * TILE, cy * TILE + Math.sin(now / 700) * 3, rx * TILE * 0.45, ry * TILE * 0.22, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      };
      if (sim.level === 1) {
      pondDraw(6.5, 6.5, 4.15, 3.05);
      pondDraw(29.5, 6.5, 4.15, 3.05);
      } else if (sim.level === 3) {
        pondDraw(4.2, 5.2, 3.1, 2.15);
      } else if (sim.level === 4) {
        pondDraw(11.5, 8.5, 2.6, 1.8);
      }

      for (let tyi = y0; tyi <= y1; tyi++) {
        for (let txi = x0; txi <= x1; txi++) {
          if (tiles[tyi][txi] !== "path") continue;
          const cx = (txi + 0.5) * TILE;
          const cy = (tyi + 0.5) * TILE;
          ctx.fillStyle = "#8d6840";
          ctx.beginPath();
          ctx.ellipse(cx, cy, TILE * 0.62, TILE * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = tileHash(txi, tyi) % 2 ? "#d4b27a" : "#c4a36b";
          ctx.beginPath();
          ctx.ellipse(cx, cy, TILE * 0.48, TILE * 0.36, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const glowAt = (x: number, y: number, radius: number, inner: string) => {
        const g = ctx.createRadialGradient(x, y, 4, x, y, radius);
        g.addColorStop(0, inner);
        g.addColorStop(1, "rgba(255, 170, 60, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      };

      type Item = { y: number; draw: () => void };
      const items: Item[] = [];

      for (let tyi = y0; tyi <= y1; tyi++) {
        for (let txi = x0; txi <= x1; txi++) {
          if (tiles[tyi][txi] !== "tree") continue;
          const fx = (txi + 0.5) * TILE;
          const fy = (tyi + 0.92) * TILE;
          items.push({ y: fy, draw: () => drawSprite("tree", fx, fy) });
        }
      }

      if (sim.level === 1) {
      for (const actor of world.actors) {
        if (actor.kind === "acorn" && sim.found.has(actor.id)) continue;
        const bob =
          reduceRef.current || actor.kind === "oak" || actor.kind === "lantern"
            ? 0
            : Math.sin(now / 420 + actor.x * 0.01) * 1.6;
        items.push({
          y: actor.y,
          draw: () => {
            if (actor.kind === "lantern" && sim.lit.has(actor.id)) glowAt(actor.x, actor.y - 24, 78, "rgba(255, 196, 90, 0.55)");
            if (actor.kind === "oak" && sim.mode === "won") glowAt(actor.x, actor.y - 70, 120, "rgba(255, 214, 140, 0.4)");
            const key: SpriteKey =
              actor.kind === "lantern"
                ? "lantern"
                : actor.kind === "acorn"
                  ? "acorn"
                  : actor.kind === "fox"
                    ? "fox"
                    : actor.kind === "owl"
                      ? "owl"
                      : "oak";
            const unlit = actor.kind === "lantern" && !sim.lit.has(actor.id);
            drawSprite(key, actor.x, actor.y + bob, false, unlit ? 0.78 : 1);
          },
        });
      }
      } else if (sim.level === 2) {
        if (!sim.hasSword) {
          items.push({
            y: grove.swordY,
            draw: () => {
              ctx.save();
              ctx.translate(grove.swordX, grove.swordY);
              ctx.fillStyle = "#6b4a28";
              ctx.beginPath();
              ctx.ellipse(0, 2, 18, 7, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#8a6240";
              ctx.fillRect(-14, -8, 28, 12);
              ctx.rotate(-0.42);
              drawSteelSword(ctx);
              ctx.restore();
            },
          });
        }
        if (sim.blobAlive) {
          items.push({
            y: sim.blobY,
            draw: () => {
              ctx.save();
              ctx.translate(sim.blobX, sim.blobY);
              drawForestBlob(ctx, now);
              ctx.restore();
            },
          });
        }
        items.push({
          y: grove.doorY,
          draw: () => {
            ctx.save();
            ctx.translate(grove.doorX, grove.doorY);
            const img = images.cave;
            const h = HEIGHTS.cave;
            const aspect = img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 1.3;
            const w = h * aspect;
            ctx.fillStyle = "rgba(8, 18, 12, 0.35)";
            ctx.beginPath();
            ctx.ellipse(0, 2, w * 0.34, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            const flicker = 0.82 + Math.sin(now / 260) * 0.1 + Math.sin(now / 87) * 0.05;
            if (img && img.complete && img.naturalWidth > 0 && caveCtx) {
              const sw = img.naturalWidth;
              const sh = img.naturalHeight;
              if (caveScratch.width !== sw || caveScratch.height !== sh) {
                caveScratch.width = sw;
                caveScratch.height = sh;
              }
              caveCtx.setTransform(1, 0, 0, 1, 0, 0);
              caveCtx.clearRect(0, 0, sw, sh);
              caveCtx.drawImage(img, 0, 0);
              caveCtx.globalCompositeOperation = "multiply";
              const shade = caveCtx.createRadialGradient(sw * 0.5, sh * 0.52, sw * 0.08, sw * 0.5, sh * 0.5, sw * 0.52);
              shade.addColorStop(0, "rgba(90, 60, 40, 0.2)");
              shade.addColorStop(0.62, "rgba(30, 22, 18, 0.45)");
              shade.addColorStop(1, "rgba(12, 10, 12, 0.78)");
              caveCtx.fillStyle = shade;
              caveCtx.fillRect(0, 0, sw, sh);
              caveCtx.globalCompositeOperation = "screen";
              const day = caveCtx.createLinearGradient(0, 0, 0, sh * 0.38);
              day.addColorStop(0, "rgba(255, 236, 206, 0.55)");
              day.addColorStop(1, "rgba(255, 236, 206, 0)");
              caveCtx.fillStyle = day;
              caveCtx.fillRect(0, 0, sw, sh * 0.4);
              const mouth = caveCtx.createRadialGradient(sw * 0.48, sh * 0.5, sw * 0.02, sw * 0.5, sh * 0.5, sw * 0.2);
              mouth.addColorStop(0, `rgba(255, 198, 120, ${0.7 * flicker})`);
              mouth.addColorStop(0.5, `rgba(255, 140, 60, ${0.28 * flicker})`);
              mouth.addColorStop(1, "rgba(255, 120, 40, 0)");
              caveCtx.fillStyle = mouth;
              caveCtx.beginPath();
              caveCtx.ellipse(sw * 0.5, sh * 0.52, sw * 0.2, sh * 0.22, 0, 0, Math.PI * 2);
              caveCtx.fill();
              caveCtx.globalCompositeOperation = "destination-in";
              caveCtx.drawImage(img, 0, 0);
              caveCtx.globalCompositeOperation = "source-over";
              ctx.drawImage(caveScratch, -w / 2, -h, w, h);
            } else {
              ctx.fillStyle = "#4a4038";
              ctx.beginPath();
              ctx.ellipse(0, -h * 0.45, w * 0.42, h * 0.42, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            const beam = ctx.createLinearGradient(0, -h * 0.58, 0, 14);
            beam.addColorStop(0, `rgba(255, 186, 96, ${0.05 * flicker})`);
            beam.addColorStop(0.4, `rgba(255, 168, 72, ${0.2 * flicker})`);
            beam.addColorStop(1, "rgba(255, 140, 40, 0)");
            ctx.fillStyle = beam;
            ctx.beginPath();
            ctx.moveTo(-w * 0.1, -h * 0.62);
            ctx.lineTo(w * 0.1, -h * 0.62);
            ctx.lineTo(w * 0.32, 12);
            ctx.lineTo(-w * 0.32, 12);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            const pool = ctx.createRadialGradient(0, 6, 6, 0, 8, w * 0.4);
            pool.addColorStop(0, `rgba(255, 176, 84, ${0.34 * flicker})`);
            pool.addColorStop(1, "rgba(255, 140, 40, 0)");
            ctx.fillStyle = pool;
            ctx.beginPath();
            ctx.ellipse(0, 8, w * 0.38, 16, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = sim.hasKey ? "#e6a23c" : "#1a120c";
            ctx.beginPath();
            ctx.arc(6, -h * 0.46, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
      } else if (sim.level === 3) {
        if (!sim.hasGun) {
          items.push({
            y: marsh.gunY,
            draw: () => {
              ctx.save();
              ctx.translate(marsh.gunX, marsh.gunY - 6);
              ctx.fillStyle = "#5c3d2e";
              ctx.beginPath();
              ctx.ellipse(0, 10, 18, 6, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#7a5238";
              ctx.fillRect(-14, 0, 28, 12);
              ctx.rotate(-0.08);
              drawShotgun(ctx);
              ctx.restore();
            },
          });
        }
        if (sim.frogAlive) {
          items.push({
            y: sim.frogY,
            draw: () => {
              const air = Math.sin(Math.min(1, Math.max(0, sim.hop) / 0.72) * Math.PI);
              ctx.save();
              ctx.translate(sim.frogX, sim.frogY - air * 20);
              ctx.fillStyle = "rgba(8,16,10,0.28)";
              ctx.beginPath();
              ctx.ellipse(0, 8, 42 * (1 - air * 0.3), 9, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#1f5c2c";
              ctx.beginPath();
              ctx.ellipse(-30, -6, 16, 9, -0.4, 0, Math.PI * 2);
              ctx.ellipse(30, -6, 16, 9, 0.4, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#174a24";
              ctx.beginPath();
              ctx.ellipse(-46, 2 - air * 4, 13, 5, 0, 0, Math.PI * 2);
              ctx.ellipse(46, 2 - air * 4, 13, 5, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#2f7a3a";
              ctx.beginPath();
              ctx.ellipse(0, -16, 28, 20, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#245f2e";
              ctx.beginPath();
              ctx.arc(-10, -24, 5, 0, Math.PI * 2);
              ctx.arc(8, -20, 4, 0, Math.PI * 2);
              ctx.arc(0, -12, 3.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#d7e6a8";
              ctx.beginPath();
              ctx.ellipse(0, -8, 14, 11, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#1f4a32";
              ctx.beginPath();
              ctx.moveTo(-15, -22);
              ctx.quadraticCurveTo(-20, -8, -16, 3);
              ctx.lineTo(-4, 4);
              ctx.lineTo(-3, -16);
              ctx.closePath();
              ctx.moveTo(15, -22);
              ctx.quadraticCurveTo(20, -8, 16, 3);
              ctx.lineTo(4, 4);
              ctx.lineTo(3, -16);
              ctx.closePath();
              ctx.fill();
              ctx.fillStyle = "#e6c36a";
              ctx.beginPath();
              ctx.arc(-9, -10, 1.3, 0, Math.PI * 2);
              ctx.arc(-10, -2, 1.3, 0, Math.PI * 2);
              ctx.arc(9, -10, 1.3, 0, Math.PI * 2);
              ctx.arc(10, -2, 1.3, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#f3ead7";
              ctx.beginPath();
              ctx.moveTo(-4, -22);
              ctx.lineTo(0, -14);
              ctx.lineTo(4, -22);
              ctx.closePath();
              ctx.fill();
              ctx.fillStyle = "#7a2436";
              ctx.beginPath();
              ctx.moveTo(-2.4, -18);
              ctx.lineTo(2.4, -18);
              ctx.lineTo(1.4, -13);
              ctx.lineTo(-1.4, -13);
              ctx.closePath();
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(-2.2, -13);
              ctx.lineTo(2.2, -13);
              ctx.lineTo(4.4, 1);
              ctx.lineTo(0, 6);
              ctx.lineTo(-4.4, 1);
              ctx.closePath();
              ctx.fill();
              ctx.strokeStyle = "#e6c36a";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(-1.4, -11);
              ctx.lineTo(1.6, 3);
              ctx.stroke();
              ctx.fillStyle = "#2f7a3a";
              ctx.beginPath();
              ctx.ellipse(0, -38, 22, 14, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = "#163d20";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(-14, -34);
              ctx.quadraticCurveTo(0, -26, 14, -34);
              ctx.stroke();
              ctx.fillStyle = "#1f5c2c";
              ctx.beginPath();
              ctx.ellipse(-14, -4, 5, 9, 0.3, 0, Math.PI * 2);
              ctx.ellipse(14, -4, 5, 9, -0.3, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#5c3a22";
              ctx.beginPath();
              ctx.ellipse(1, -58, 22, 5.5, -0.05, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#6e4630";
              ctx.beginPath();
              ctx.ellipse(1, -68, 12, 9, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#3d2818";
              ctx.fillRect(-10, -62, 22, 3.2);
              ctx.fillStyle = "#c4a36b";
              ctx.fillRect(-10, -61.2, 22, 1.1);
              ctx.fillStyle = "#f3ead7";
              ctx.beginPath();
              ctx.arc(-7, -46, 6.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#e6a23c";
              ctx.beginPath();
              ctx.arc(-7, -46, 4.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#14261c";
              ctx.beginPath();
              ctx.arc(-6, -46, 1.8, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = "#2a241c";
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.arc(-7, -46, 7.2, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(8, -46, 7.2, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(0.2, -46);
              ctx.lineTo(0.8, -46);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(-14.2, -46);
              ctx.lineTo(-22, -42);
              ctx.moveTo(15.2, -46);
              ctx.lineTo(22, -42);
              ctx.stroke();
              ctx.strokeStyle = "rgba(255,255,255,0.55)";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(-9, -48, 3.2, Math.PI * 1.1, Math.PI * 1.7);
              ctx.stroke();
              ctx.restore();
            },
          });
        }
        items.push({
          y: marsh.doorY,
          draw: () => {
            ctx.save();
            ctx.translate(marsh.doorX, marsh.doorY);
            const img = images.frogdoor;
            const h = HEIGHTS.frogdoor;
            const aspect = img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 0.9;
            const w = h * aspect;
            ctx.fillStyle = "rgba(8, 18, 12, 0.32)";
            ctx.beginPath();
            ctx.ellipse(0, 2, Math.max(18, w * 0.32), 7, 0, 0, Math.PI * 2);
            ctx.fill();
            if (img && img.complete && img.naturalWidth > 0) {
              ctx.drawImage(img, -w / 2, -h, w, h);
            } else {
              ctx.fillStyle = "#2f7a3a";
              ctx.beginPath();
              ctx.ellipse(0, -h * 0.45, w * 0.4, h * 0.4, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = sim.frogAlive ? "#1a120c" : "#e6a23c";
            ctx.beginPath();
            ctx.arc(w * 0.06, -h * 0.42, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
      } else if (sim.level === 4) {
        if (!sim.hasCorn) {
          items.push({
            y: pond.cornY,
            draw: () => {
              ctx.save();
              ctx.translate(pond.cornX, pond.cornY);
              ctx.fillStyle = "#8a5a32";
              ctx.beginPath();
              ctx.ellipse(0, -6, 10, 12, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#f2c14e";
              ctx.beginPath();
              ctx.ellipse(0, -16, 7, 4, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#e6b23c";
              ctx.beginPath();
              ctx.arc(-3, -16, 1.4, 0, Math.PI * 2);
              ctx.arc(2, -15, 1.3, 0, Math.PI * 2);
              ctx.arc(0, -13, 1.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            },
          });
        }
        ducklings.forEach((duck, i) => {
          const fed = sim.fed?.has(duck.id) ?? false;
          items.push({
            y: duck.y,
            draw: () => {
              ctx.save();
              ctx.translate(duck.x, duck.y);
              if (i % 2 === 0) ctx.scale(-1, 1);
              drawDuckling(ctx, fed, (sim.duckT ?? 0) * 3 + i);
              ctx.restore();
            },
          });
        });
        items.push({
          y: pond.doorY,
          draw: () => {
            ctx.save();
            ctx.translate(pond.doorX, pond.doorY);
            const img = images.chickdoor;
            const h = HEIGHTS.chickdoor;
            const aspect = img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 0.86;
            const w = h * aspect;
            ctx.fillStyle = "rgba(8, 18, 12, 0.32)";
            ctx.beginPath();
            ctx.ellipse(0, 2, Math.max(18, w * 0.32), 7, 0, 0, Math.PI * 2);
            ctx.fill();
            if (img && img.complete && img.naturalWidth > 0) {
              ctx.drawImage(img, -w / 2, -h, w, h);
            } else {
              ctx.fillStyle = "#f2c14e";
              ctx.beginPath();
              ctx.ellipse(0, -h * 0.45, w * 0.4, h * 0.4, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = sim.hasKey ? "#e6a23c" : "#1a120c";
            ctx.beginPath();
            ctx.arc(w * 0.08, -h * 0.4, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
      } else if (sim.level === 5) {
        if (!sim.hasRifle) {
          items.push({
            y: den.gunY,
            draw: () => {
              ctx.save();
              ctx.translate(den.gunX, den.gunY - 8);
              ctx.fillStyle = "#5c3d2e";
              ctx.beginPath();
              ctx.ellipse(0, 14, 20, 6, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#7a5238";
              ctx.fillRect(-16, 2, 32, 14);
              const img = images.rifle;
              if (img && img.complete && img.naturalWidth > 0) {
                const h = 16;
                const w = h * (img.naturalWidth / img.naturalHeight);
                ctx.drawImage(img, -w / 2, -h / 2, w, h);
              }
              ctx.restore();
            },
          });
        }
        const paintBear = (x: number, y: number) => {
          items.push({
            y,
            draw: () => drawSprite("bear", x, y, sim.x > x),
          });
        };
        if (sim.bear1Alive) paintBear(sim.bear1X, sim.bear1Y);
        if (sim.bear2Alive) paintBear(sim.bear2X, sim.bear2Y);
        const bearsUp = sim.bear1Alive || sim.bear2Alive;
        items.push({
          y: den.doorY,
          draw: () => {
            ctx.save();
            ctx.translate(den.doorX, den.doorY);
            const img = images.beardoor;
            const h = HEIGHTS.beardoor;
            const aspect = img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 0.86;
            const w = h * aspect;
            ctx.fillStyle = "rgba(8, 18, 12, 0.32)";
            ctx.beginPath();
            ctx.ellipse(0, 2, Math.max(18, w * 0.32), 7, 0, 0, Math.PI * 2);
            ctx.fill();
            if (img && img.complete && img.naturalWidth > 0) {
              ctx.drawImage(img, -w / 2, -h, w, h);
            } else {
              ctx.fillStyle = "#8a5a32";
              ctx.beginPath();
              ctx.ellipse(0, -h * 0.45, w * 0.4, h * 0.4, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = bearsUp ? "#1a120c" : "#e6a23c";
            ctx.beginPath();
            ctx.arc(0, -h * 0.38, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
      } else if (sim.level === 6) {
        if (!sim.hasPistol) {
          items.push({
            y: cove.gunY,
            draw: () => {
              ctx.save();
              ctx.translate(cove.gunX, cove.gunY - 8);
              ctx.fillStyle = "#5c4636";
              ctx.beginPath();
              ctx.ellipse(0, 12, 16, 6, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#7a5a40";
              ctx.fillRect(-12, 2, 24, 12);
              const img = images.pistol;
              if (img && img.complete && img.naturalWidth > 0) {
                const h = 20;
                const w = h * (img.naturalWidth / img.naturalHeight);
                ctx.drawImage(img, -w / 2, -h / 2, w, h);
              }
              ctx.restore();
            },
          });
        }
        if (sim.squidAlive) {
          items.push({
            y: sim.squidY,
            draw: () => drawSprite("squid", sim.squidX, sim.squidY, sim.x > sim.squidX),
          });
        }
        items.push({
          y: cove.doorY,
          draw: () => {
            ctx.save();
            ctx.translate(cove.doorX, cove.doorY);
            const img = images.squiddor;
            const h = HEIGHTS.squiddor;
            const aspect = img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 1;
            const w = h * aspect;
            ctx.fillStyle = "rgba(8, 18, 12, 0.32)";
            ctx.beginPath();
            ctx.ellipse(0, 2, Math.max(18, w * 0.32), 7, 0, 0, Math.PI * 2);
            ctx.fill();
            if (img && img.complete && img.naturalWidth > 0) {
              ctx.drawImage(img, -w / 2, -h, w, h);
            } else {
              ctx.fillStyle = "#5b4a86";
              ctx.beginPath();
              ctx.ellipse(0, -h * 0.45, w * 0.4, h * 0.4, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = sim.squidAlive ? "#1a120c" : "#e6a23c";
            ctx.beginPath();
            ctx.arc(0, -h * 0.4, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
      } else if (sim.level === 7) {
        if (!sim.hasBlaster) {
          items.push({
            y: yard.gunY,
            draw: () => {
              ctx.save();
              ctx.translate(yard.gunX, yard.gunY - 8);
              ctx.fillStyle = "#5c4636";
              ctx.beginPath();
              ctx.ellipse(0, 12, 16, 6, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#7a5a40";
              ctx.fillRect(-12, 2, 24, 12);
              const img = images.blaster;
              if (img && img.complete && img.naturalWidth > 0) {
                const h = 22;
                const w = h * (img.naturalWidth / img.naturalHeight);
                ctx.drawImage(img, -w / 2, -h / 2, w, h);
              }
              ctx.restore();
            },
          });
        }
        if (sim.dogAlive) {
          items.push({
            y: sim.dogY,
            draw: () => drawSprite("cerberus", sim.dogX, sim.dogY, sim.x > sim.dogX),
          });
        }
        items.push({
          y: yard.doorY,
          draw: () => {
            ctx.save();
            ctx.translate(yard.doorX, yard.doorY);
            const img = images.dogdoor;
            const h = HEIGHTS.dogdoor;
            const aspect = img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 0.9;
            const w = h * aspect;
            ctx.fillStyle = "rgba(8, 18, 12, 0.32)";
            ctx.beginPath();
            ctx.ellipse(0, 2, Math.max(18, w * 0.32), 7, 0, 0, Math.PI * 2);
            ctx.fill();
            if (img && img.complete && img.naturalWidth > 0) {
              ctx.drawImage(img, -w / 2, -h, w, h);
            } else {
              ctx.fillStyle = "#6b5344";
              ctx.beginPath();
              ctx.ellipse(0, -h * 0.45, w * 0.4, h * 0.4, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = sim.dogAlive ? "#1a120c" : "#e6a23c";
            ctx.beginPath();
            ctx.arc(0, -h * 0.42, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
      } else if (sim.level === 8) {
        if (!sim.hasStick) {
          items.push({
            y: leaf.stickY,
            draw: () => {
              ctx.save();
              ctx.translate(leaf.stickX, leaf.stickY);
              ctx.fillStyle = "#6b4a28";
              ctx.beginPath();
              ctx.ellipse(0, 2, 16, 6, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#8a6240";
              ctx.fillRect(-12, -6, 24, 10);
              ctx.rotate(-0.4);
              const img = images.stick;
              if (img && img.complete && img.naturalWidth > 0) {
                const h = 48;
                const w = h * (img.naturalWidth / img.naturalHeight);
                ctx.drawImage(img, -w / 2, -h, w, h);
              }
              ctx.restore();
            },
          });
        }
        if (sim.isoAlive) {
          items.push({
            y: sim.isoY,
            draw: () => drawSprite("isopod", sim.isoX, sim.isoY, sim.x > sim.isoX),
          });
        }
        items.push({
          y: leaf.doorY,
          draw: () => {
            ctx.save();
            ctx.translate(leaf.doorX, leaf.doorY);
            const img = images.isodoor;
            const h = HEIGHTS.isodoor;
            const aspect = img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 1.1;
            const w = h * aspect;
            ctx.fillStyle = "rgba(8, 18, 12, 0.32)";
            ctx.beginPath();
            ctx.ellipse(0, 2, Math.max(18, w * 0.32), 7, 0, 0, Math.PI * 2);
            ctx.fill();
            if (img && img.complete && img.naturalWidth > 0) {
              ctx.drawImage(img, -w / 2, -h, w, h);
            } else {
              ctx.fillStyle = "#6a6258";
              ctx.beginPath();
              ctx.ellipse(0, -h * 0.45, w * 0.4, h * 0.28, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = sim.isoAlive ? "#1a120c" : "#e6a23c";
            ctx.beginPath();
            ctx.arc(0, -h * 0.4, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
      } else if (sim.level === 9) {
        if (!sim.hasBow) {
          items.push({
            y: glade.bowY,
            draw: () => {
              ctx.save();
              ctx.translate(glade.bowX, glade.bowY);
              ctx.fillStyle = "#5a3a22";
              ctx.beginPath();
              ctx.ellipse(0, 2, 14, 5, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#8a6240";
              ctx.fillRect(-10, -4, 20, 8);
              ctx.restore();
            },
          });
        }
        if (sim.stagAlive) {
          items.push({
            y: sim.stagY,
            draw: () => drawSprite("fox", sim.stagX, sim.stagY, sim.x > sim.stagX),
          });
        }
        items.push({
          y: glade.doorY,
          draw: () => {
            ctx.save();
            ctx.translate(glade.doorX, glade.doorY);
            const img = images.isodoor;
            const h = HEIGHTS.isodoor;
            const aspect = img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 1.1;
            const w = h * aspect;
            ctx.fillStyle = "rgba(8, 18, 12, 0.32)";
            ctx.beginPath();
            ctx.ellipse(0, 2, Math.max(18, w * 0.32), 7, 0, 0, Math.PI * 2);
            ctx.fill();
            if (img && img.complete && img.naturalWidth > 0) {
              ctx.drawImage(img, -w / 2, -h, w, h);
            } else {
              ctx.fillStyle = "#6a6258";
              ctx.beginPath();
              ctx.ellipse(0, -h * 0.45, w * 0.4, h * 0.28, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = sim.stagAlive ? "#1a120c" : "#e6a23c";
            ctx.beginPath();
            ctx.arc(0, -h * 0.4, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
      }

      const bob = sim.moving && !reduceRef.current ? Math.sin(sim.bob) * 2.4 : 0;
      const body: SpriteKey = sim.facing === "up" ? "up" : sim.facing === "down" ? "down" : "side";
      items.push({
        y: sim.y,
        draw: () => {
          if (sim.hurt > 0 && Math.floor(sim.hurt * 12) % 2 === 0) ctx.globalAlpha = 0.45;
          glowAt(sim.x, sim.y - 20, 70, "rgba(255, 214, 150, 0.16)");
          drawSprite(body, sim.x, sim.y + bob, sim.facing === "left");
          if (sim.hasSword && sim.level === 2) {
            ctx.save();
            const flip = sim.facing === "left" ? -1 : 1;
            ctx.translate(sim.x + flip * 16, sim.y - 30 + bob);
            ctx.scale(flip, 1);
            ctx.rotate(sim.swing > 0 ? -1.2 : -0.42);
            drawSteelSword(ctx);
            ctx.restore();
          }
          if (sim.hasStick && sim.level === 8) {
            ctx.save();
            const flip = sim.facing === "left" ? -1 : 1;
            ctx.translate(sim.x + flip * 14, sim.y - 28 + bob);
            ctx.scale(flip, 1);
            ctx.rotate(sim.swing > 0 ? -1.05 : -0.5);
            const img = images.stick;
            if (img && img.complete && img.naturalWidth > 0) {
              const h = 52;
              const w = h * (img.naturalWidth / img.naturalHeight);
              ctx.drawImage(img, -w / 2, -h, w, h);
            }
            ctx.restore();
          }
          if (sim.hasBow && sim.level === 9) {
            ctx.save();
            const flip = sim.facing === "left" ? -1 : 1;
            ctx.translate(sim.x + flip * 12, sim.y - 26 + bob);
            ctx.scale(flip, 1);
            ctx.rotate(sim.swing > 0 ? -0.8 : -0.3);
            ctx.fillStyle = "#8a6240";
            ctx.fillRect(-8, -4, 16, 8);
            ctx.restore();
          }
          if (sim.level === 4 && sim.hasCorn) {
            ctx.save();
            ctx.translate(sim.x + 12, sim.y - 40 + bob);
            ctx.fillStyle = sim.hasKey ? "#e6a23c" : "#f2c14e";
            ctx.beginPath();
            if (sim.hasKey) {
              ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillRect(3, -1, 8, 2);
              ctx.fillRect(8, -1, 2, 4);
            } else {
              ctx.ellipse(0, 0, 5, 3.5, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }
          if (sim.hasGun && sim.level === 3) {
            ctx.save();
            const flip = sim.facing === "left" ? -1 : 1;
            ctx.translate(sim.x + flip * 8, sim.y - 30 + bob);
            ctx.scale(flip, 1);
            ctx.rotate(sim.swing > 0 ? -0.12 : 0.08);
            drawShotgun(ctx);
            ctx.restore();
          }
          if (sim.hasRifle && sim.level === 5) {
            ctx.save();
            ctx.translate(sim.x, sim.y - 26 + bob);
            const ang =
              sim.facing === "right" ? 0 : sim.facing === "left" ? Math.PI : sim.facing === "up" ? -Math.PI / 2 : Math.PI / 2;
            ctx.rotate(ang + (sim.swing > 0 ? -0.06 : 0));
            const img = images.rifle;
            if (img && img.complete && img.naturalWidth > 0) {
              const h = 14;
              const w = h * (img.naturalWidth / img.naturalHeight);
              ctx.drawImage(img, -w * 0.28, -h / 2, w, h);
            }
            ctx.restore();
          }
          if (sim.hasPistol && sim.level === 6) {
            ctx.save();
            ctx.translate(sim.x, sim.y - 24 + bob);
            const ang =
              sim.facing === "right" ? 0 : sim.facing === "left" ? Math.PI : sim.facing === "up" ? -Math.PI / 2 : Math.PI / 2;
            ctx.rotate(ang + (sim.swing > 0 ? -0.08 : 0));
            const img = images.pistol;
            if (img && img.complete && img.naturalWidth > 0) {
              const h = 18;
              const w = h * (img.naturalWidth / img.naturalHeight);
              ctx.drawImage(img, -w * 0.22, -h / 2, w, h);
            }
            ctx.restore();
          }
          if (sim.hasBlaster && sim.level === 7) {
            ctx.save();
            ctx.translate(sim.x, sim.y - 24 + bob);
            const ang =
              sim.facing === "right" ? 0 : sim.facing === "left" ? Math.PI : sim.facing === "up" ? -Math.PI / 2 : Math.PI / 2;
            ctx.rotate(ang + (sim.swing > 0 ? -0.08 : 0));
            const img = images.blaster;
            if (img && img.complete && img.naturalWidth > 0) {
              const h = 20;
              const w = h * (img.naturalWidth / img.naturalHeight);
              ctx.drawImage(img, -w * 0.2, -h / 2, w, h);
            }
            ctx.restore();
          }
          ctx.globalAlpha = 1;
        },
      });

      items.sort((a, b) => a.y - b.y);
      for (const item of items) item.draw();

      for (const p of sim.particles) {
        const alpha = Math.max(0, p.life / p.max);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.gold ? "#f0c14a" : "#f3ead7";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      for (const shot of sim.shots ?? []) {
        ctx.fillStyle = "#f3ead7";
        ctx.beginPath();
        ctx.arc(shot.x, shot.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
      document.removeEventListener("visibilitychange", clearKeys);
    };
    // The loop closes over refs. look() is recreated each render; the first mount's copy
    // calls simRef and hudApi, which stay current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function moveStick(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const max = rect.width * 0.36;
    const len = Math.hypot(dx, dy);
    if (len > max && len > 0) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    stickRef.current = { x: dx / max, y: dy / max };
    setKnob({ x: dx, y: dy });
  }

  const onCanvasPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (screenRef.current !== "game") return;
    const sim = simRef.current;
    if (!sim || sim.mode !== "play") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const wx = e.clientX - rect.left + camRef.current.x;
    const wy = e.clientY - rect.top + camRef.current.y;
    const hit = nearestPrompt(sim);
    if (hit && Math.hypot(hit.actor.x - wx, hit.actor.y - wy) < 56) look();
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-pine text-parchment select-none" style={{ touchAction: "none" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Fernwood, a forest trail"
        onPointerDown={onCanvasPointer}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,16,12,0.45)_100%)]" />

      {screen === "game" && (
        <>
          <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 md:p-4">
            <div className="pointer-events-auto max-w-sm rounded-card bg-parchment/95 px-3 py-2 text-bark shadow-lg">
              <div className="flex items-center gap-1.5" aria-label={hud.level === 1 ? `${hud.lit} of 5 lanterns lit` : `Level ${hud.level}`}>
                {hud.level === 1 && (
                  <>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      "inline-block h-3.5 w-2.5 rounded-full " +
                      (i < hud.lit ? "bg-gold flame-lit" : "border border-bark/40 bg-bark/10")
                    }
                  />
                ))}
                <span className="ml-1 text-sm font-bold">{hud.lit} of 5</span>
                  </>
                )}
                {hud.level === 2 && (
                  <span className="text-sm font-bold">
                    Hearts {hud.hp}/5
                    {hud.blobAlive ? ` · Blob ${hud.blobHp}/8` : hud.hasKey ? " · Key" : ""}
                  </span>
                )}
                {hud.level === 3 && (
                  <span className="text-sm font-bold">
                    Hearts {hud.hp}/5
                    {hud.frogAlive ? ` · Frog ${Math.max(0, hud.frogHp)}/6` : " · Door"}
                  </span>
                )}
                {hud.level === 4 && (
                  <span className="text-sm font-bold">
                    Ducklings {hud.fed}/5
                    {hud.hasKey ? " · Key" : ""}
                  </span>
                )}
                {hud.level === 5 && (
                  <span className="text-sm font-bold">
                    Hearts {hud.hp}/5
                    {hud.bears > 0 ? ` · Bears ${hud.bears}` : " · Door"}
                  </span>
                )}
                {hud.level === 6 && (
                  <span className="text-sm font-bold">
                    Hearts {hud.hp}/5
                    {hud.squidAlive ? ` · Squid ${Math.max(0, hud.squidHp)}/5` : " · Door"}
                  </span>
                )}
                {hud.level === 7 && (
                  <span className="text-sm font-bold">
                    Hearts {hud.hp}/5
                    {hud.dogAlive ? ` · Dog ${Math.max(0, hud.dogHp)}/6` : " · Door"}
                  </span>
                )}
                {hud.level === 8 && (
                  <span className="text-sm font-bold">
                    Hearts {hud.hp}/5
                    {hud.isoAlive ? ` · Isopod ${Math.max(0, hud.isoHp)}/10` : " · Door"}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-snug" aria-live="polite">
                {hud.note}
              </p>
            </div>
            <div className="pointer-events-auto flex items-center gap-2">
              <div className="rounded-full bg-parchment/95 px-3 py-2 text-sm font-bold text-bark shadow-lg">
                {hud.level === 8
                  ? hud.hasStick
                    ? "Stick"
                    : "No stick"
                  : hud.level === 7
                  ? hud.hasBlaster
                    ? "Blaster"
                    : "No blaster"
                  : hud.level === 6
                    ? hud.hasPistol
                      ? "Gun"
                      : "No gun"
                    : hud.level === 5
                    ? hud.hasRifle
                      ? "Gun"
                      : "No gun"
                    : hud.level === 4
                    ? hud.hasKey
                      ? "Key"
                      : hud.hasCorn
                        ? "Corn"
                        : "No corn"
                    : hud.level === 3
                      ? hud.hasGun
                        ? "Shotgun"
                        : "No gun"
                      : hud.level === 2
                        ? hud.hasKey
                          ? "Key"
                          : "No key"
                        : `${hud.found} / 6 acorns`}
              </div>
              <button
                type="button"
                className="min-h-11 min-w-11 rounded-full bg-parchment px-3 text-sm font-bold text-bark shadow-lg"
                onClick={() => {
                  const sim = simRef.current;
                  if (!sim || sim.mode === "won") return;
                  if (sim.mode === "pause") sim.mode = "play";
                  else if (sim.mode === "play" || sim.mode === "talk") sim.mode = "pause";
                  hudApi.current(sim);
                }}
              >
                {hud.mode === "pause" ? "Back" : "Rest"}
              </button>
            </div>
          </header>

          {hud.mode === "play" && hud.prompt && (
            <div className="pointer-events-none absolute bottom-36 left-1/2 z-20 -translate-x-1/2 rounded-full bg-pine/80 px-4 py-2 text-center text-sm font-bold text-parchment shadow md:bottom-8">
              {hud.prompt}
              <span className="ml-2 hidden font-medium text-gold md:inline">E</span>
            </div>
          )}

          {hud.mode === "play" && (
            <>
              <div
                className="absolute bottom-4 left-4 z-20 h-28 w-28 rounded-full border border-gold/50 bg-pine/70 shadow-lg md:hidden"
                style={{ touchAction: "none" }}
                onPointerDown={(e) => {
                  unlockAudio();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  stickId.current = e.pointerId;
                  moveStick(e);
                }}
                onPointerMove={(e) => {
                  if (stickId.current !== e.pointerId) return;
                  moveStick(e);
                }}
                onPointerUp={(e) => {
                  if (stickId.current !== e.pointerId) return;
                  stickId.current = null;
                  stickRef.current = { x: 0, y: 0 };
                  setKnob({ x: 0, y: 0 });
                }}
                onPointerCancel={(e) => {
                  if (stickId.current !== e.pointerId) return;
                  stickId.current = null;
                  stickRef.current = { x: 0, y: 0 };
                  setKnob({ x: 0, y: 0 });
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 h-11 w-11 rounded-full bg-parchment shadow"
                  style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
                />
              </div>
              <button
                type="button"
                className="absolute right-4 bottom-8 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-sm font-bold text-pine shadow-lg md:hidden"
                onPointerDown={(e) => {
                  e.preventDefault();
                  const sim = simRef.current;
                  if (sim && sim.mode === "play" && !hud.prompt) {
                    if (sim.level === 2 && sim.hasSword) {
                      swing(sim);
                      writeSave(sim);
                      hudApi.current(sim);
                      return;
                    }
                    if (sim.level === 8 && sim.hasStick) {
                      swing(sim);
                      writeSave(sim);
                      hudApi.current(sim);
                      return;
                    }
                    if (sim.level === 7 && sim.hasBlaster) {
                      shoot(sim);
                      writeSave(sim);
                      hudApi.current(sim);
                      return;
                    }
                    if (sim.level === 6 && sim.hasPistol) {
                      shoot(sim);
                      writeSave(sim);
                      hudApi.current(sim);
                      return;
                    }
                    if (sim.level === 5 && sim.hasRifle) {
                      shoot(sim);
                      writeSave(sim);
                      hudApi.current(sim);
                      return;
                    }
                    if (sim.level === 3 && sim.hasGun) {
                      shoot(sim);
                      writeSave(sim);
                      hudApi.current(sim);
                      return;
                    }
                  }
                  look();
                }}
              >
                {hud.level === 7 && hud.hasBlaster && !hud.prompt
                  ? "Fire"
                  : hud.level === 6 && hud.hasPistol && !hud.prompt
                  ? "Fire"
                  : hud.level === 5 && hud.hasRifle && !hud.prompt
                  ? "Fire"
                  : hud.level === 3 && hud.hasGun && !hud.prompt
                    ? "Fire"
                    : hud.level === 8 && hud.hasStick && !hud.prompt
                      ? "Swing"
                      : hud.level === 2 && hud.hasSword && !hud.prompt
                        ? "Swing"
                        : "Look"}
              </button>
            </>
          )}

          {hud.mode === "talk" && (
            <div className="absolute inset-0 z-30 flex items-end justify-center bg-pine/40 p-4 md:items-center" onClick={look}>
              <article
                className="w-full max-w-lg rounded-card bg-parchment p-5 text-bark shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="font-display text-sm tracking-wide text-moss">{hud.speaker}</p>
                <p className="mt-2 text-lg leading-relaxed">{hud.line}</p>
                <button type="button" className="mt-4 min-h-11 rounded-full bg-pine px-5 font-bold text-parchment" onClick={look}>
                  Go on
                </button>
              </article>
            </div>
          )}

          {hud.mode === "pause" && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-pine/70 p-4">
              <article className="w-full max-w-sm rounded-card bg-parchment p-6 text-bark shadow-2xl">
                <h2 className="font-display text-3xl text-pine">The woods wait</h2>
                <p className="mt-2 leading-relaxed">Wren can rest here. The lanterns stay as you left them.</p>
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    className="min-h-11 rounded-full bg-gold px-5 font-bold text-pine"
                    onClick={() => {
                      const sim = simRef.current;
                      if (!sim) return;
                      sim.mode = "play";
                      hudApi.current(sim);
                    }}
                  >
                    Keep walking
                  </button>
                  <button type="button" className="min-h-11 rounded-full bg-pine px-5 font-bold text-parchment" onClick={rest}>
                    Rest at the gate
                  </button>
                  <button type="button" className="min-h-11 rounded-full border border-bark/30 px-5 font-bold" onClick={restart}>
                    Start the trail over
                  </button>
                </div>
              </article>
            </div>
          )}

          {hud.mode === "won" && (
            <div className="absolute inset-0 z-30 flex items-end justify-center bg-pine/55 p-4 md:items-center">
              <article className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-card bg-parchment p-6 text-bark shadow-2xl">
                <p className="font-display text-sm tracking-wide text-moss">Fernwood</p>
                <h2 className="font-display text-3xl text-pine">
                  {hud.level === 8
                    ? "The isopod door"
                    : hud.level === 7
                    ? "The dog door"
                    : hud.level === 6
                    ? "The squid door"
                    : hud.level === 5
                    ? "The far door"
                    : hud.level === 4
                      ? "The door to Level 5"
                    : hud.level === 3
                      ? "The door to Level 4"
                      : hud.level === 2
                        ? "The second door"
                        : "The root-door opens"}
                </h2>
                <p className="mt-3 leading-relaxed">{hud.line}</p>
                {hud.level === 1 && (
                <p className="mt-2 text-sm text-moss">Acorns gathered: {hud.found} of 6. They were never the key — only a kindness along the way.</p>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" className="min-h-11 rounded-full bg-gold px-5 font-bold text-pine" onClick={restart}>
                    Walk it again
                  </button>
                  <button type="button" className="min-h-11 rounded-full bg-pine px-5 font-bold text-parchment" onClick={rest}>
                    Leave the grove
                  </button>
                </div>
              </article>
            </div>
          )}
        </>
      )}

      {screen === "title" && (
        <div className="absolute inset-0 z-40">
          <img src="/art/fernwood.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/75 to-pine/25" />
          <div className="relative flex h-full flex-col items-center justify-end px-5 pb-10 text-center md:pb-16">
            <p className="font-display text-sm tracking-[0.18em] text-gold uppercase">A walk through Fernwood</p>
            <h1 className="mt-2 font-display text-5xl leading-none text-parchment md:text-7xl">Forest Adventure</h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-parchment/90">
              Wren follows a dusky path. Five lanterns open the oak. Inside, a blob that only charges hides the key to the next door.
            </p>
            <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
              <button
                type="button"
                className="min-h-12 rounded-full bg-gold px-6 text-lg font-bold text-pine"
                onClick={() => begin(null)}
              >
                Start the trail
              </button>
              {saved && (
                <button
                  type="button"
                  className="min-h-12 rounded-full bg-parchment px-6 text-lg font-bold text-pine"
                  onClick={() => begin(saved)}
                >
                  Continue the walk
                </button>
              )}
            </div>
            <p className="mt-4 max-w-md text-sm text-parchment/75">
              <span className="hidden md:inline">Arrow keys or W A S D to walk. E to look. Space swings the sword, or fires the shotgun.</span>
              <span className="md:hidden">Drag the stick to walk. Tap Look by a door or sword. Tap Swing when the blob is near.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
