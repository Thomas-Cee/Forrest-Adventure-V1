import {
  type Actor,
  type Facing,
  bodyBlocked,
  blockedOn,
  DOOR_SHUT,
  ENDING,
  FOX_LINE,
  FROG_DOOR_SHUT,
  GCOLS,
  GROVE_ENTER,
  GROWS,
  MARSH_ENTER,
  OAK_SHUT,
  OWL_LINE,
  POND_ENTER,
  DUCK_DOOR_SHUT,
  DEN_ENTER,
  BEAR_DOOR_SHUT,
  COVE_ENTER,
  SQUID_DOOR_SHUT,
  YARD_ENTER,
  DOG_DOOR_SHUT,
  LEAF_ENTER,
  ISO_DOOR_SHUT,
  LEVEL9_OPEN,
  ducklings,
  den,
  cove,
  yard,
  leaf,
  grove,
  marsh,
  pond,
  world,
} from "@/game/world";

export const SPEED = 168;

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  gold: boolean;
}

export interface Shot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface Sim {
  x: number;
  y: number;
  facing: Facing;
  moving: boolean;
  bob: number;
  speed: number;
  lit: Set<string>;
  found: Set<string>;
  talked: Set<string>;
  mode: "play" | "talk" | "won" | "pause";
  speaker: string;
  line: string;
  note: string;
  particles: Particle[];
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  hasSword: boolean;
  hasKey: boolean;
  hasGun: boolean;
  hasRifle: boolean;
  hasPistol: boolean;
  hasBlaster: boolean;
  hasStick: boolean;
  hasCorn: boolean;
  fed: Set<string>;
  duckT: number;
  hp: number;
  hurt: number;
  swing: number;
  blobX: number;
  blobY: number;
  blobHp: number;
  blobAlive: boolean;
  frogX: number;
  frogY: number;
  frogHp: number;
  frogAlive: boolean;
  hop: number;
  shots: Shot[];
  bear1X: number;
  bear1Y: number;
  bear1Hp: number;
  bear1Alive: boolean;
  bear2X: number;
  bear2Y: number;
  bear2Hp: number;
  bear2Alive: boolean;
  squidX: number;
  squidY: number;
  squidHp: number;
  squidAlive: boolean;
  dogX: number;
  dogY: number;
  dogHp: number;
  dogAlive: boolean;
  isoX: number;
  isoY: number;
  isoHp: number;
  isoAlive: boolean;
}

export interface SaveData {
  version: 1 | 2;
  x: number;
  y: number;
  facing: Facing;
  lit: string[];
  found: string[];
  talked: string[];
  won: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  hasSword?: boolean;
  hasKey?: boolean;
  hasGun?: boolean;
  hasRifle?: boolean;
  hasPistol?: boolean;
  hasBlaster?: boolean;
  hasStick?: boolean;
  hasCorn?: boolean;
  fed?: string[];
  hp?: number;
  blobX?: number;
  blobY?: number;
  blobHp?: number;
  blobAlive?: boolean;
  frogX?: number;
  frogY?: number;
  frogHp?: number;
  frogAlive?: boolean;
  bear1X?: number;
  bear1Y?: number;
  bear1Hp?: number;
  bear1Alive?: boolean;
  bear2X?: number;
  bear2Y?: number;
  bear2Hp?: number;
  bear2Alive?: boolean;
  squidX?: number;
  squidY?: number;
  squidHp?: number;
  squidAlive?: boolean;
  dogX?: number;
  dogY?: number;
  dogHp?: number;
  dogAlive?: boolean;
  isoX?: number;
  isoY?: number;
  isoHp?: number;
  isoAlive?: boolean;
}

let forced: Set<string> | null = null;

export function setForcedKeys(codes: string[]) {
  forced = codes.length === 0 ? null : new Set(codes);
}

export function freshSim(): Sim {
  return {
    x: world.startX,
    y: world.startY,
    facing: "up",
    moving: false,
    bob: 0,
    speed: 0,
    lit: new Set(),
    found: new Set(),
    talked: new Set(),
    mode: "play",
    speaker: "",
    line: "",
    note: "Five lanterns mark the trail to the old oak.",
    particles: [],
    level: 1,
    hasSword: false,
    hasKey: false,
    hasGun: false,
    hasRifle: false,
    hasPistol: false,
    hasBlaster: false,
    hasStick: false,
    hasCorn: false,
    fed: new Set(),
    duckT: 0,
    hp: 5,
    hurt: 0,
    swing: 0,
    blobX: grove.blobX,
    blobY: grove.blobY,
    blobHp: 8,
    blobAlive: true,
    frogX: marsh.frogX,
    frogY: marsh.frogY,
    frogHp: 6,
    frogAlive: true,
    hop: 0,
    shots: [],
    bear1X: den.bear1X,
    bear1Y: den.bear1Y,
    bear1Hp: 4,
    bear1Alive: true,
    bear2X: den.bear2X,
    bear2Y: den.bear2Y,
    bear2Hp: 4,
    bear2Alive: true,
    squidX: cove.squidX,
    squidY: cove.squidY,
    squidHp: 5,
    squidAlive: true,
    dogX: yard.dogX,
    dogY: yard.dogY,
    dogHp: 6,
    dogAlive: true,
    isoX: leaf.isoX,
    isoY: leaf.isoY,
    isoHp: 10,
    isoAlive: true,
  };
}

export function simFromSave(save: SaveData): Sim {
  const sim = freshSim();
  sim.x = save.x;
  sim.y = save.y;
  sim.facing = save.facing;
  sim.lit = new Set(save.lit);
  sim.found = new Set(save.found);
  sim.talked = new Set(save.talked);
  sim.level = save.level === 8 ? 8 : save.level === 7 ? 7 : save.level === 6 ? 6 : save.level === 5 ? 5 : save.level === 4 ? 4 : save.level === 3 ? 3 : save.level === 2 ? 2 : 1;
  sim.hasSword = sim.level === 2 && !!save.hasSword;
  sim.hasGun = sim.level === 3 && !!save.hasGun;
  sim.hasRifle = sim.level === 5 && !!save.hasRifle;
  sim.hasPistol = sim.level === 6 && !!save.hasPistol;
  sim.hasBlaster = sim.level === 7 && !!save.hasBlaster;
  sim.hasStick = sim.level === 8 && !!save.hasStick;
  sim.hasCorn = !!save.hasCorn;
  sim.fed = new Set(save.fed ?? []);
  sim.hasKey = (sim.level === 2 || sim.level === 4) && !!save.hasKey;
  if (sim.level === 4 && sim.fed.size >= ducklings.length) sim.hasKey = true;
  sim.hp = save.hp ?? 5;
  sim.blobAlive = save.blobAlive !== false;
  sim.blobHp = save.blobHp ?? 8;
  if (typeof save.blobX === "number") sim.blobX = save.blobX;
  if (typeof save.blobY === "number") sim.blobY = save.blobY;
  sim.frogAlive = save.frogAlive !== false;
  sim.frogHp = save.frogHp ?? 6;
  if (typeof save.frogX === "number") sim.frogX = save.frogX;
  if (typeof save.frogY === "number") sim.frogY = save.frogY;
  sim.bear1Alive = save.bear1Alive !== false;
  sim.bear2Alive = save.bear2Alive !== false;
  sim.bear1Hp = save.bear1Hp ?? 4;
  sim.bear2Hp = save.bear2Hp ?? 4;
  if (typeof save.bear1X === "number") sim.bear1X = save.bear1X;
  if (typeof save.bear1Y === "number") sim.bear1Y = save.bear1Y;
  if (typeof save.bear2X === "number") sim.bear2X = save.bear2X;
  if (typeof save.bear2Y === "number") sim.bear2Y = save.bear2Y;
  sim.squidAlive = save.squidAlive !== false;
  sim.squidHp = save.squidHp ?? 5;
  if (typeof save.squidX === "number") sim.squidX = save.squidX;
  if (typeof save.squidY === "number") sim.squidY = save.squidY;
  sim.dogAlive = save.dogAlive !== false;
  sim.dogHp = save.dogHp ?? 6;
  if (typeof save.dogX === "number") sim.dogX = save.dogX;
  if (typeof save.dogY === "number") sim.dogY = save.dogY;
  sim.isoAlive = save.isoAlive !== false;
  sim.isoHp = save.isoHp ?? 10;
  if (typeof save.isoX === "number") sim.isoX = save.isoX;
  if (typeof save.isoY === "number") sim.isoY = save.isoY;
  if (save.won) {
    sim.mode = "won";
    sim.speaker = "Fernwood";
    sim.line = ENDING;
    sim.note = "The grove is open.";
  }
  return sim;
}

export function toSave(sim: Sim): SaveData {
  return {
    version: 2,
    x: sim.x,
    y: sim.y,
    facing: sim.facing,
    lit: [...sim.lit],
    found: [...sim.found],
    talked: [...sim.talked],
    won: sim.mode === "won",
    level: sim.level,
    hasSword: sim.hasSword,
    hasKey: sim.hasKey,
    hasGun: sim.hasGun,
    hasRifle: sim.hasRifle,
    hasPistol: sim.hasPistol,
    hasBlaster: sim.hasBlaster,
    hasStick: sim.hasStick,
    hasCorn: sim.hasCorn,
    fed: [...(sim.fed ?? [])],
    hp: sim.hp,
    blobX: sim.blobX,
    blobY: sim.blobY,
    blobHp: sim.blobHp,
    blobAlive: sim.blobAlive,
    frogX: sim.frogX,
    frogY: sim.frogY,
    frogHp: sim.frogHp,
    frogAlive: sim.frogAlive,
    bear1X: sim.bear1X,
    bear1Y: sim.bear1Y,
    bear1Hp: sim.bear1Hp,
    bear1Alive: sim.bear1Alive,
    bear2X: sim.bear2X,
    bear2Y: sim.bear2Y,
    bear2Hp: sim.bear2Hp,
    bear2Alive: sim.bear2Alive,
    squidX: sim.squidX,
    squidY: sim.squidY,
    squidHp: sim.squidHp,
    squidAlive: sim.squidAlive,
    dogX: sim.dogX,
    dogY: sim.dogY,
    dogHp: sim.dogHp,
    dogAlive: sim.dogAlive,
    isoX: sim.isoX,
    isoY: sim.isoY,
    isoHp: sim.isoHp,
    isoAlive: sim.isoAlive,
  };
}

function moveVector(keys: Set<string>, stick: { x: number; y: number }) {
  const src = forced ?? keys;
  let mx = forced ? 0 : stick.x;
  let my = forced ? 0 : stick.y;
  if (src.has("KeyA") || src.has("ArrowLeft")) mx -= 1;
  if (src.has("KeyD") || src.has("ArrowRight")) mx += 1;
  if (src.has("KeyW") || src.has("ArrowUp")) my -= 1;
  if (src.has("KeyS") || src.has("ArrowDown")) my += 1;
  const len = Math.hypot(mx, my);
  const keyed =
    src.has("KeyA") ||
    src.has("KeyD") ||
    src.has("KeyW") ||
    src.has("KeyS") ||
    src.has("ArrowLeft") ||
    src.has("ArrowRight") ||
    src.has("ArrowUp") ||
    src.has("ArrowDown");
  if (!keyed && len > 0 && len < 0.18) return { mx: 0, my: 0 };
  if (len > 1) {
    mx /= len;
    my /= len;
  }
  return { mx, my };
}

function feetBlocked(sim: Sim, x: number, y: number) {
  if (sim.level === 8) return blockedOn(leaf.tiles, GCOLS, GROWS, x, y);
  if (sim.level === 7) return blockedOn(yard.tiles, GCOLS, GROWS, x, y);
  if (sim.level === 6) return blockedOn(cove.tiles, GCOLS, GROWS, x, y);
  if (sim.level === 5) return blockedOn(den.tiles, GCOLS, GROWS, x, y);
  if (sim.level === 4) return blockedOn(pond.tiles, GCOLS, GROWS, x, y);
  if (sim.level === 3) return blockedOn(marsh.tiles, GCOLS, GROWS, x, y);
  if (sim.level === 2) return blockedOn(grove.tiles, GCOLS, GROWS, x, y);
  return bodyBlocked(x, y);
}

export function enterGrove(sim: Sim) {
  sim.level = 2;
  sim.x = grove.startX;
  sim.y = grove.startY;
  sim.facing = "up";
  sim.hasSword = false;
  sim.hasKey = false;
  sim.hp = 5;
  sim.hurt = 0;
  sim.swing = 0;
  sim.blobX = grove.blobX;
  sim.blobY = grove.blobY;
  sim.blobHp = 8;
  sim.blobAlive = true;
  sim.mode = "talk";
  sim.speaker = "Fernwood";
  sim.line = GROVE_ENTER;
  sim.note = "Take the sword. The blob only runs at you.";
  burst(sim, sim.x, sim.y, 16);
}

export function enterMarsh(sim: Sim) {
  sim.level = 3;
  sim.x = marsh.startX;
  sim.y = marsh.startY;
  sim.facing = "up";
  sim.hasSword = false;
  sim.hasGun = false;
  sim.hp = 5;
  sim.hurt = 0;
  sim.swing = 0;
  sim.frogX = marsh.frogX;
  sim.frogY = marsh.frogY;
  sim.frogHp = 6;
  sim.frogAlive = true;
  sim.hop = 0.4;
  sim.shots = [];
  sim.mode = "talk";
  sim.speaker = "Fernwood";
  sim.line = MARSH_ENTER;
  sim.note = "Take the shotgun. The frog only jumps at you.";
  burst(sim, sim.x, sim.y, 14);
}

export function enterPond(sim: Sim) {
  sim.level = 4;
  sim.x = pond.startX;
  sim.y = pond.startY;
  sim.facing = "up";
  sim.hasSword = false;
  sim.hasGun = false;
  sim.hasKey = false;
  sim.hasCorn = false;
  sim.fed = new Set();
  sim.duckT = 0;
  sim.hp = 5;
  sim.hurt = 0;
  sim.swing = 0;
  sim.shots = [];
  sim.mode = "talk";
  sim.speaker = "Fernwood";
  sim.line = POND_ENTER;
  sim.note = "Take the corn. Five ducklings are hiding around the pond.";
  burst(sim, sim.x, sim.y, 14);
}

export function enterDen(sim: Sim) {
  sim.level = 5;
  sim.x = den.startX;
  sim.y = den.startY;
  sim.facing = "up";
  sim.hasSword = false;
  sim.hasGun = false;
  sim.hasRifle = false;
  sim.hasKey = false;
  sim.hasCorn = false;
  sim.hp = 5;
  sim.hurt = 0;
  sim.swing = 0;
  sim.shots = [];
  sim.bear1X = den.bear1X;
  sim.bear1Y = den.bear1Y;
  sim.bear1Hp = 4;
  sim.bear1Alive = true;
  sim.bear2X = den.bear2X;
  sim.bear2Y = den.bear2Y;
  sim.bear2Hp = 4;
  sim.bear2Alive = true;
  sim.mode = "talk";
  sim.speaker = "Fernwood";
  sim.line = DEN_ENTER;
  sim.note = "Take the gun. The bears only charge.";
  burst(sim, sim.x, sim.y, 14);
}

export function enterCove(sim: Sim) {
  sim.level = 6;
  sim.x = cove.startX;
  sim.y = cove.startY;
  sim.facing = "up";
  sim.hasSword = false;
  sim.hasGun = false;
  sim.hasRifle = false;
  sim.hasPistol = false;
  sim.hasKey = false;
  sim.hasCorn = false;
  sim.hp = 5;
  sim.hurt = 0;
  sim.swing = 0;
  sim.shots = [];
  sim.squidX = cove.squidX;
  sim.squidY = cove.squidY;
  sim.squidHp = 5;
  sim.squidAlive = true;
  sim.mode = "talk";
  sim.speaker = "Fernwood";
  sim.line = COVE_ENTER;
  sim.note = "Take the gun. The squid takes five hits.";
  burst(sim, sim.x, sim.y, 14);
}

export function enterYard(sim: Sim) {
  sim.level = 7;
  sim.x = yard.startX;
  sim.y = yard.startY;
  sim.facing = "up";
  sim.hasSword = false;
  sim.hasGun = false;
  sim.hasRifle = false;
  sim.hasPistol = false;
  sim.hasBlaster = false;
  sim.hasKey = false;
  sim.hasCorn = false;
  sim.hp = 5;
  sim.hurt = 0;
  sim.swing = 0;
  sim.shots = [];
  sim.dogX = yard.dogX;
  sim.dogY = yard.dogY;
  sim.dogHp = 6;
  sim.dogAlive = true;
  sim.mode = "talk";
  sim.speaker = "Fernwood";
  sim.line = YARD_ENTER;
  sim.note = "Take the blaster. The dog takes six hits.";
  burst(sim, sim.x, sim.y, 14);
}

export function enterLeaf(sim: Sim) {
  sim.level = 8;
  sim.x = leaf.startX;
  sim.y = leaf.startY;
  sim.facing = "up";
  sim.hasSword = false;
  sim.hasGun = false;
  sim.hasRifle = false;
  sim.hasPistol = false;
  sim.hasBlaster = false;
  sim.hasStick = false;
  sim.hasKey = false;
  sim.hasCorn = false;
  sim.hp = 5;
  sim.hurt = 0;
  sim.swing = 0;
  sim.shots = [];
  sim.isoX = leaf.isoX;
  sim.isoY = leaf.isoY;
  sim.isoHp = 10;
  sim.isoAlive = true;
  sim.mode = "talk";
  sim.speaker = "Fernwood";
  sim.line = LEAF_ENTER;
  sim.note = "Take the stick. The isopod has ten lives.";
  burst(sim, sim.x, sim.y, 14);
}

function facingStep(facing: Sim["facing"]) {
  if (facing === "left") return { x: -1, y: 0 };
  if (facing === "right") return { x: 1, y: 0 };
  if (facing === "up") return { x: 0, y: -1 };
  return { x: 0, y: 1 };
}

export function shoot(sim: Sim) {
  const blaster = sim.level === 7 && sim.hasBlaster;
  const pistol = sim.level === 6 && sim.hasPistol;
  const rifle = sim.level === 5 && sim.hasRifle;
  const gun = sim.level === 3 && sim.hasGun;
  if ((!blaster && !pistol && !rifle && !gun) || sim.mode !== "play" || sim.swing > 0) return;
  sim.swing = blaster || pistol || rifle ? 0.48 : 0.42;
  const dir = facingStep(sim.facing);
  if (blaster || pistol || rifle) {
    sim.shots.push({
      x: sim.x + dir.x * 20,
      y: sim.y - 22 + dir.y * 16,
      vx: dir.x * (blaster ? 760 : pistol ? 700 : 640),
      vy: dir.y * (blaster ? 760 : pistol ? 700 : 640),
      life: 0.4,
    });
    return;
  }
  for (let i = -2; i <= 2; i++) {
    const spread = i * 0.16;
    const vx = dir.x * Math.cos(spread) - dir.y * Math.sin(spread);
    const vy = dir.x * Math.sin(spread) + dir.y * Math.cos(spread);
    sim.shots.push({
      x: sim.x + dir.x * 18,
      y: sim.y - 24 + dir.y * 18,
      vx: vx * 460,
      vy: vy * 460,
      life: 0.32,
    });
  }
}

export function swing(sim: Sim) {
  const sword = sim.level === 2 && sim.hasSword;
  const stick = sim.level === 8 && sim.hasStick;
  if ((!sword && !stick) || sim.mode !== "play" || sim.swing > 0) return;
  sim.swing = 0.28;
  if (stick) {
    if (!sim.isoAlive) return;
    const dx = sim.isoX - sim.x;
    const dy = sim.isoY - sim.y;
    if (Math.hypot(dx, dy) > 82) return;
    sim.isoHp -= 1;
    const ang = Math.atan2(dy, dx);
    const bx = sim.isoX + Math.cos(ang) * 18;
    const by = sim.isoY + Math.sin(ang) * 18;
    if (!blockedOn(leaf.tiles, GCOLS, GROWS, bx, sim.isoY)) sim.isoX = bx;
    if (!blockedOn(leaf.tiles, GCOLS, GROWS, sim.isoX, by)) sim.isoY = by;
    burst(sim, sim.isoX, sim.isoY, 6);
    if (sim.isoHp <= 0) {
      sim.isoAlive = false;
      sim.isoHp = 0;
      sim.note = "The isopod is down. The door will open.";
      burst(sim, sim.isoX, sim.isoY, 16);
    }
    return;
  }
  if (!sim.blobAlive) return;
  const dx = sim.blobX - sim.x;
  const dy = sim.blobY - sim.y;
  if (Math.hypot(dx, dy) > 78) return;
  sim.blobHp -= 1;
  const ang = Math.atan2(dy, dx);
  const bx = sim.blobX + Math.cos(ang) * 22;
  const by = sim.blobY + Math.sin(ang) * 22;
  if (!blockedOn(grove.tiles, GCOLS, GROWS, bx, sim.blobY)) sim.blobX = bx;
  if (!blockedOn(grove.tiles, GCOLS, GROWS, sim.blobX, by)) sim.blobY = by;
  burst(sim, sim.blobX, sim.blobY, 8);
  if (sim.blobHp <= 0) {
    sim.blobAlive = false;
    sim.hasKey = true;
    sim.note = "The key was inside the blob. Take it to the far door.";
    burst(sim, sim.blobX, sim.blobY, 18);
  }
}

function burst(sim: Sim, x: number, y: number, count: number) {
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count;
    sim.particles.push({
      x,
      y: y - 20,
      vx: Math.cos(a) * 36,
      vy: Math.sin(a) * 28 - 20,
      life: 0.7,
      max: 0.7,
      gold: true,
    });
  }
}

export function step(sim: Sim, dt: number, keys: Set<string>, stick: { x: number; y: number }) {
  sim.speed = 0;
  if (sim.hurt > 0) sim.hurt -= dt;
  if (sim.swing > 0) sim.swing -= dt;
  if (sim.mode === "play") {
    const { mx, my } = moveVector(keys, stick);
    if (mx !== 0 || my !== 0) {
      sim.moving = true;
      sim.bob += dt * 7;
      if (Math.abs(mx) > Math.abs(my)) sim.facing = mx < 0 ? "left" : "right";
      else sim.facing = my < 0 ? "up" : "down";
      const nx = sim.x + mx * SPEED * dt;
      if (!feetBlocked(sim, nx, sim.y)) sim.x = nx;
      const ny = sim.y + my * SPEED * dt;
      if (!feetBlocked(sim, sim.x, ny)) sim.y = ny;
      sim.speed = Math.hypot(mx, my) * SPEED;
      if (sim.level === 1) collectAcorns(sim);
    } else {
      sim.moving = false;
    }
    if (sim.level === 2) chaseBlob(sim, dt);
    if (sim.level === 3) {
      if (!sim.shots) sim.shots = [];
      hopFrog(sim, dt);
      flyShots(sim, dt);
    }
    if (sim.level === 4) {
      if (!sim.fed) sim.fed = new Set();
      sim.duckT = (sim.duckT ?? 0) + dt;
    }
    if (sim.level === 5) {
      if (!sim.shots) sim.shots = [];
      chaseBears(sim, dt);
      flyShots(sim, dt);
    }
    if (sim.level === 6) {
      if (!sim.shots) sim.shots = [];
      chaseSquid(sim, dt);
      flyShots(sim, dt);
    }
    if (sim.level === 7) {
      if (!sim.shots) sim.shots = [];
      chaseDog(sim, dt);
      flyShots(sim, dt);
    }
    if (sim.level === 8) chaseIso(sim, dt);
  } else {
    sim.moving = false;
  }

  if (sim.mode === "won" && sim.particles.length < 48 && Math.random() < dt * 6) {
    sim.particles.push({
      x: sim.x + (Math.random() - 0.5) * 220,
      y: sim.y + (Math.random() - 0.5) * 140,
      vx: (Math.random() - 0.5) * 12,
      vy: -18 - Math.random() * 16,
      life: 1.6,
      max: 1.6,
      gold: true,
    });
  }

  for (const p of sim.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
  }
  if (sim.particles.length > 80) sim.particles.splice(0, sim.particles.length - 80);
  sim.particles = sim.particles.filter((p) => p.life > 0);
}

function restartTrail(sim: Sim, note: string) {
  const next = freshSim();
  Object.assign(sim, next);
  sim.hurt = 1.2;
  sim.note = note;
}

function chaseBlob(sim: Sim, dt: number) {
  if (!sim.blobAlive) return;
  const dx = sim.x - sim.blobX;
  const dy = sim.y - sim.blobY;
  const dist = Math.hypot(dx, dy) || 1;
  const spd = 92;
  const nx = sim.blobX + (dx / dist) * spd * dt;
  const ny = sim.blobY + (dy / dist) * spd * dt;
  if (!blockedOn(grove.tiles, GCOLS, GROWS, nx, sim.blobY)) sim.blobX = nx;
  if (!blockedOn(grove.tiles, GCOLS, GROWS, sim.blobX, ny)) sim.blobY = ny;
  if (dist < 42 && sim.hurt <= 0) {
    sim.hp -= 1;
    sim.hurt = 0.85;
    const ang = Math.atan2(sim.y - sim.blobY, sim.x - sim.blobX);
    const px = sim.x + Math.cos(ang) * 26;
    const py = sim.y + Math.sin(ang) * 26;
    if (!feetBlocked(sim, px, sim.y)) sim.x = px;
    if (!feetBlocked(sim, sim.x, py)) sim.y = py;
    sim.note = "It has no tricks. It only runs into you.";
    if (sim.hp <= 0) {
      restartTrail(sim, "The blob caught Wren. The trail must be walked again from the start.");
    }
  }
}

function chaseBears(sim: Sim, dt: number) {
  const stepBear = (which: 1 | 2) => {
    if (sim.level !== 5) return;
    const alive = which === 1 ? sim.bear1Alive : sim.bear2Alive;
    if (!alive) return;
    let x = which === 1 ? sim.bear1X : sim.bear2X;
    let y = which === 1 ? sim.bear1Y : sim.bear2Y;
    const dx = sim.x - x;
    const dy = sim.y - y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = x + (dx / dist) * 74 * dt;
    const ny = y + (dy / dist) * 74 * dt;
    if (!blockedOn(den.tiles, GCOLS, GROWS, nx, y)) x = nx;
    if (!blockedOn(den.tiles, GCOLS, GROWS, x, ny)) y = ny;
    if (which === 1) {
      sim.bear1X = x;
      sim.bear1Y = y;
    } else {
      sim.bear2X = x;
      sim.bear2Y = y;
    }
    if (dist < 56 && sim.hurt <= 0) {
      sim.hp -= 1;
      sim.hurt = 0.85;
      const ang = Math.atan2(sim.y - y, sim.x - x);
      const px = sim.x + Math.cos(ang) * 30;
      const py = sim.y + Math.sin(ang) * 30;
      if (!feetBlocked(sim, px, sim.y)) sim.x = px;
      if (!feetBlocked(sim, sim.x, py)) sim.y = py;
      sim.note = "The bear in the hat only charges.";
      if (sim.hp <= 0) {
        restartTrail(sim, "A bear caught Wren. The trail must be walked again from the start.");
      }
    }
  };
  stepBear(1);
  stepBear(2);
}

function chaseSquid(sim: Sim, dt: number) {
  if (sim.level !== 6 || !sim.squidAlive) return;
  const dx = sim.x - sim.squidX;
  const dy = sim.y - sim.squidY;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = sim.squidX + (dx / dist) * 80 * dt;
  const ny = sim.squidY + (dy / dist) * 80 * dt;
  if (!blockedOn(cove.tiles, GCOLS, GROWS, nx, sim.squidY)) sim.squidX = nx;
  if (!blockedOn(cove.tiles, GCOLS, GROWS, sim.squidX, ny)) sim.squidY = ny;
  if (dist < 52 && sim.hurt <= 0) {
    sim.hp -= 1;
    sim.hurt = 0.85;
    const ang = Math.atan2(sim.y - sim.squidY, sim.x - sim.squidX);
    const px = sim.x + Math.cos(ang) * 28;
    const py = sim.y + Math.sin(ang) * 28;
    if (!feetBlocked(sim, px, sim.y)) sim.x = px;
    if (!feetBlocked(sim, sim.x, py)) sim.y = py;
    sim.note = "The squid only slides into you.";
    if (sim.hp <= 0) {
      restartTrail(sim, "The squid caught Wren. The trail must be walked again from the start.");
    }
  }
}

function chaseDog(sim: Sim, dt: number) {
  if (sim.level !== 7 || !sim.dogAlive) return;
  const dx = sim.x - sim.dogX;
  const dy = sim.y - sim.dogY;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = sim.dogX + (dx / dist) * 88 * dt;
  const ny = sim.dogY + (dy / dist) * 88 * dt;
  if (!blockedOn(yard.tiles, GCOLS, GROWS, nx, sim.dogY)) sim.dogX = nx;
  if (!blockedOn(yard.tiles, GCOLS, GROWS, sim.dogX, ny)) sim.dogY = ny;
  if (dist < 58 && sim.hurt <= 0) {
    sim.hp -= 1;
    sim.hurt = 0.85;
    const ang = Math.atan2(sim.y - sim.dogY, sim.x - sim.dogX);
    const px = sim.x + Math.cos(ang) * 30;
    const py = sim.y + Math.sin(ang) * 30;
    if (!feetBlocked(sim, px, sim.y)) sim.x = px;
    if (!feetBlocked(sim, sim.x, py)) sim.y = py;
    sim.note = "The three-headed dog only charges.";
    if (sim.hp <= 0) {
      restartTrail(sim, "The dog caught Wren. The trail must be walked again from the start.");
    }
  }
}

function chaseIso(sim: Sim, dt: number) {
  if (sim.level !== 8 || !sim.isoAlive) return;
  const dx = sim.x - sim.isoX;
  const dy = sim.y - sim.isoY;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = sim.isoX + (dx / dist) * 62 * dt;
  const ny = sim.isoY + (dy / dist) * 62 * dt;
  if (!blockedOn(leaf.tiles, GCOLS, GROWS, nx, sim.isoY)) sim.isoX = nx;
  if (!blockedOn(leaf.tiles, GCOLS, GROWS, sim.isoX, ny)) sim.isoY = ny;
  if (dist < 54 && sim.hurt <= 0) {
    sim.hp -= 1;
    sim.hurt = 0.85;
    const ang = Math.atan2(sim.y - sim.isoY, sim.x - sim.isoX);
    const px = sim.x + Math.cos(ang) * 26;
    const py = sim.y + Math.sin(ang) * 26;
    if (!feetBlocked(sim, px, sim.y)) sim.x = px;
    if (!feetBlocked(sim, sim.x, py)) sim.y = py;
    sim.note = "The isopod only crawls into you.";
    if (sim.hp <= 0) {
      restartTrail(sim, "The isopod caught Wren. The trail must be walked again from the start.");
    }
  }
}

function hopFrog(sim: Sim, dt: number) {
  if (!sim.frogAlive) return;
  sim.hop -= dt;
  const dx = sim.x - sim.frogX;
  const dy = sim.y - sim.frogY;
  const dist = Math.hypot(dx, dy) || 1;
  if (sim.hop <= 0) {
    const leap = 78;
    const nx = sim.frogX + (dx / dist) * leap;
    const ny = sim.frogY + (dy / dist) * leap;
    if (!blockedOn(marsh.tiles, GCOLS, GROWS, nx, sim.frogY)) sim.frogX = nx;
    if (!blockedOn(marsh.tiles, GCOLS, GROWS, sim.frogX, ny)) sim.frogY = ny;
    sim.hop = 0.72;
  }
  if (dist < 46 && sim.hurt <= 0) {
    sim.hp -= 1;
    sim.hurt = 0.85;
    const ang = Math.atan2(sim.y - sim.frogY, sim.x - sim.frogX);
    const px = sim.x + Math.cos(ang) * 28;
    const py = sim.y + Math.sin(ang) * 28;
    if (!feetBlocked(sim, px, sim.y)) sim.x = px;
    if (!feetBlocked(sim, sim.x, py)) sim.y = py;
    sim.note = "The frog only jumps. It has just the one eye.";
    if (sim.hp <= 0) {
      restartTrail(sim, "The frog caught Wren. The trail must be walked again from the start.");
    }
  }
}

function flyShots(sim: Sim, dt: number) {
  let tagged = false;
  for (const shot of sim.shots) {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
    if (sim.level === 3 && sim.frogAlive && !tagged) {
      if (Math.hypot(shot.x - sim.frogX, shot.y - (sim.frogY - 28)) < 46) {
        tagged = true;
        shot.life = 0;
        sim.frogHp -= 1;
        burst(sim, sim.frogX, sim.frogY, 6);
        if (sim.frogHp <= 0) {
          sim.frogAlive = false;
          sim.frogHp = 0;
          sim.note = "The frog is down. The door to Level 4 will open.";
          burst(sim, sim.frogX, sim.frogY, 16);
        }
      }
    }
    if (sim.level === 5 && !tagged) {
      const bears = [
        { x: sim.bear1X, y: sim.bear1Y, alive: sim.bear1Alive, which: 1 as const },
        { x: sim.bear2X, y: sim.bear2Y, alive: sim.bear2Alive, which: 2 as const },
      ];
      for (const bear of bears) {
        if (!bear.alive) continue;
        if (Math.hypot(shot.x - bear.x, shot.y - (bear.y - 46)) < 58) {
          tagged = true;
          shot.life = 0;
          if (bear.which === 1) sim.bear1Hp -= 1;
          else sim.bear2Hp -= 1;
          const hp = bear.which === 1 ? sim.bear1Hp : sim.bear2Hp;
          burst(sim, bear.x, bear.y, 6);
          if (hp <= 0) {
            if (bear.which === 1) {
              sim.bear1Alive = false;
              sim.bear1Hp = 0;
            } else {
              sim.bear2Alive = false;
              sim.bear2Hp = 0;
            }
            if (!sim.bear1Alive && !sim.bear2Alive) {
              sim.note = "Both bears are down. The far door will open.";
              burst(sim, bear.x, bear.y, 16);
            } else {
              sim.note = "One bear is down. The other still wears its hat.";
            }
          }
          break;
        }
      }
    }
    if (sim.level === 6 && sim.squidAlive && !tagged) {
      if (Math.hypot(shot.x - sim.squidX, shot.y - (sim.squidY - 40)) < 54) {
        tagged = true;
        shot.life = 0;
        sim.squidHp -= 1;
        burst(sim, sim.squidX, sim.squidY, 6);
        if (sim.squidHp <= 0) {
          sim.squidAlive = false;
          sim.squidHp = 0;
          sim.note = "The squid is down. The door will open.";
          burst(sim, sim.squidX, sim.squidY, 16);
        }
      }
    }
    if (sim.level === 7 && sim.dogAlive && !tagged) {
      if (Math.hypot(shot.x - sim.dogX, shot.y - (sim.dogY - 48)) < 62) {
        tagged = true;
        shot.life = 0;
        sim.dogHp -= 1;
        burst(sim, sim.dogX, sim.dogY, 6);
        if (sim.dogHp <= 0) {
          sim.dogAlive = false;
          sim.dogHp = 0;
          sim.note = "The three-headed dog is down. The door will open.";
          burst(sim, sim.dogX, sim.dogY, 16);
        }
      }
    }
  }
  sim.shots = sim.shots.filter((shot) => shot.life > 0);
}

function collectAcorns(sim: Sim) {
  for (const actor of world.actors) {
    if (actor.kind !== "acorn" || sim.found.has(actor.id)) continue;
    if (Math.hypot(actor.x - sim.x, actor.y - sim.y) < 34) {
      sim.found.add(actor.id);
      burst(sim, actor.x, actor.y, 10);
    }
  }
}

export function nearestPrompt(sim: Sim): { actor: Actor; label: string } | null {
  if (sim.mode !== "play") return null;
  if (sim.level === 2) {
    const spots: Array<{ actor: Actor; label: string }> = [];
    if (!sim.hasSword) {
      spots.push({
        actor: { id: "sword", kind: "oak", x: grove.swordX, y: grove.swordY, name: "Sword" },
        label: "Take the wooden sword",
      });
    }
    spots.push({
      actor: { id: "door", kind: "oak", x: grove.doorX, y: grove.doorY, name: "Door" },
      label: sim.hasKey ? "Open the door with the key" : "The door is locked",
    });
    let pick: { actor: Actor; label: string } | null = null;
    let bestD = 70;
    for (const spot of spots) {
      const d = Math.hypot(spot.actor.x - sim.x, spot.actor.y - sim.y);
      if (d < bestD) {
        bestD = d;
        pick = spot;
      }
    }
    return pick;
  }
  if (sim.level === 3) {
    const spots: Array<{ actor: Actor; label: string }> = [];
    if (!sim.hasGun) {
      spots.push({
        actor: { id: "gun", kind: "oak", x: marsh.gunX, y: marsh.gunY, name: "Shotgun" },
        label: "Take the shotgun",
      });
    }
    spots.push({
      actor: { id: "door", kind: "oak", x: marsh.doorX, y: marsh.doorY, name: "Door" },
      label: sim.frogAlive ? "The door to Level 4 is shut" : "Open the door to Level 4",
    });
    let pick: { actor: Actor; label: string } | null = null;
    let bestD = 70;
    for (const spot of spots) {
      const d = Math.hypot(spot.actor.x - sim.x, spot.actor.y - sim.y);
      if (d < bestD) {
        bestD = d;
        pick = spot;
      }
    }
    return pick;
  }
  if (sim.level === 4) {
    if (!sim.fed) sim.fed = new Set();
    const spots: Array<{ actor: Actor; label: string }> = [];
    if (!sim.hasCorn) {
      spots.push({
        actor: { id: "corn", kind: "oak", x: pond.cornX, y: pond.cornY, name: "Corn" },
        label: "Take the corn",
      });
    }
    for (const duck of ducklings) {
      if (sim.fed.has(duck.id)) continue;
      spots.push({
        actor: { id: duck.id, kind: "oak", x: duck.x, y: duck.y, name: duck.name },
        label: sim.hasCorn ? `Feed ${duck.name}` : `${duck.name} is hungry`,
      });
    }
    spots.push({
      actor: { id: "door", kind: "oak", x: pond.doorX, y: pond.doorY, name: "Door" },
      label: sim.hasKey ? "Open the door with the key" : "The door is locked",
    });
    let pick: { actor: Actor; label: string } | null = null;
    let bestD = 70;
    for (const spot of spots) {
      const d = Math.hypot(spot.actor.x - sim.x, spot.actor.y - sim.y);
      if (d < bestD) {
        bestD = d;
        pick = spot;
      }
    }
    return pick;
  }
  if (sim.level === 5) {
    const spots: Array<{ actor: Actor; label: string }> = [];
    const bearsUp = sim.bear1Alive || sim.bear2Alive;
    if (!sim.hasRifle) {
      spots.push({
        actor: { id: "rifle", kind: "oak", x: den.gunX, y: den.gunY, name: "Gun" },
        label: "Take the gun",
      });
    }
    spots.push({
      actor: { id: "door", kind: "oak", x: den.doorX, y: den.doorY, name: "Door" },
      label: bearsUp ? "The door is shut" : "Open the door",
    });
    let pick: { actor: Actor; label: string } | null = null;
    let bestD = 70;
    for (const spot of spots) {
      const d = Math.hypot(spot.actor.x - sim.x, spot.actor.y - sim.y);
      if (d < bestD) {
        bestD = d;
        pick = spot;
      }
    }
    return pick;
  }
  if (sim.level === 6) {
    const spots: Array<{ actor: Actor; label: string }> = [];
    if (!sim.hasPistol) {
      spots.push({
        actor: { id: "pistol", kind: "oak", x: cove.gunX, y: cove.gunY, name: "Gun" },
        label: "Take the gun",
      });
    }
    spots.push({
      actor: { id: "door", kind: "oak", x: cove.doorX, y: cove.doorY, name: "Door" },
      label: sim.squidAlive ? "The door is shut" : "Open the door",
    });
    let pick: { actor: Actor; label: string } | null = null;
    let bestD = 70;
    for (const spot of spots) {
      const d = Math.hypot(spot.actor.x - sim.x, spot.actor.y - sim.y);
      if (d < bestD) {
        bestD = d;
        pick = spot;
      }
    }
    return pick;
  }
  if (sim.level === 7) {
    const spots: Array<{ actor: Actor; label: string }> = [];
    if (!sim.hasBlaster) {
      spots.push({
        actor: { id: "blaster", kind: "oak", x: yard.gunX, y: yard.gunY, name: "Blaster" },
        label: "Take the blaster",
      });
    }
    spots.push({
      actor: { id: "door", kind: "oak", x: yard.doorX, y: yard.doorY, name: "Door" },
      label: sim.dogAlive ? "The door is shut" : "Open the door",
    });
    let pick: { actor: Actor; label: string } | null = null;
    let bestD = 70;
    for (const spot of spots) {
      const d = Math.hypot(spot.actor.x - sim.x, spot.actor.y - sim.y);
      if (d < bestD) {
        bestD = d;
        pick = spot;
      }
    }
    return pick;
  }
  if (sim.level === 8) {
    const spots: Array<{ actor: Actor; label: string }> = [];
    if (!sim.hasStick) {
      spots.push({
        actor: { id: "stick", kind: "oak", x: leaf.stickX, y: leaf.stickY, name: "Stick" },
        label: "Take the stick",
      });
    }
    spots.push({
      actor: { id: "door", kind: "oak", x: leaf.doorX, y: leaf.doorY, name: "Door" },
      label: sim.isoAlive ? "The door is shut" : "Open the door",
    });
    let pick: { actor: Actor; label: string } | null = null;
    let bestD = 70;
    for (const spot of spots) {
      const d = Math.hypot(spot.actor.x - sim.x, spot.actor.y - sim.y);
      if (d < bestD) {
        bestD = d;
        pick = spot;
      }
    }
    return pick;
  }
  let best: Actor | null = null;
  let bestD = 62;
  for (const actor of world.actors) {
    if (actor.kind === "acorn") continue;
    if (actor.kind === "lantern" && sim.lit.has(actor.id)) continue;
    const d = Math.hypot(actor.x - sim.x, actor.y - sim.y);
    if (d < bestD) {
      best = actor;
      bestD = d;
    }
  }
  if (!best) return null;
  if (best.kind === "lantern") return { actor: best, label: "Light the lantern" };
  if (best.kind === "fox") return { actor: best, label: "Speak with Bramble" };
  if (best.kind === "owl") return { actor: best, label: "Speak with Nell" };
  return {
    actor: best,
    label: sim.lit.size >= 5 ? "Open the root-door" : "Listen to the oak",
  };
}

export function interact(sim: Sim) {
  if (sim.mode === "talk") {
    sim.mode = "play";
    return;
  }
  if (sim.mode !== "play") return;
  if (sim.level === 2) {
    const hit = nearestPrompt(sim);
    if (!hit) return;
    if (hit.actor.id === "sword") {
      sim.hasSword = true;
      burst(sim, grove.swordX, grove.swordY, 12);
      sim.note = "Space swings the sword. The blob only charges.";
      return;
    }
    if (hit.actor.id === "door") {
      if (!sim.hasKey) {
        sim.mode = "talk";
        sim.speaker = "The far door";
        sim.line = DOOR_SHUT;
        return;
      }
      enterMarsh(sim);
      return;
    }
    return;
  }
  if (sim.level === 3) {
    const hit = nearestPrompt(sim);
    if (!hit) return;
    if (hit.actor.id === "gun") {
      sim.hasGun = true;
      burst(sim, marsh.gunX, marsh.gunY, 10);
      sim.note = "Space fires the shotgun. Face the frog, then fire.";
      return;
    }
    if (hit.actor.id === "door") {
      if (sim.frogAlive) {
        sim.mode = "talk";
        sim.speaker = "The Level 4 door";
        sim.line = FROG_DOOR_SHUT;
        return;
      }
      enterPond(sim);
      return;
    }
    return;
  }
  if (sim.level === 4) {
    const hit = nearestPrompt(sim);
    if (!hit) return;
    if (hit.actor.id === "corn") {
      sim.hasCorn = true;
      burst(sim, pond.cornX, pond.cornY, 10);
      sim.note = "The corn is yours. Find the five ducklings and feed them.";
      return;
    }
    if (hit.actor.id === "door") {
      if (!sim.hasKey) {
        sim.mode = "talk";
        sim.speaker = "The Level 5 door";
        sim.line = DUCK_DOOR_SHUT;
        return;
      }
      enterDen(sim);
      return;
    }
    const duck = ducklings.find((item) => item.id === hit.actor.id);
    if (!duck || sim.fed.has(duck.id)) return;
    if (!sim.hasCorn) {
      sim.note = `${duck.name} is hungry. The corn is still by the path.`;
      return;
    }
    sim.fed.add(duck.id);
    burst(sim, duck.x, duck.y, 8);
    if (sim.fed.size >= ducklings.length) {
      sim.hasKey = true;
      sim.note = "All five ducklings are fed. The key to Level 5 is yours.";
      burst(sim, sim.x, sim.y, 14);
    } else {
      sim.note = `${duck.name} is fed. ${sim.fed.size} of 5 ducklings.`;
    }
    return;
  }
  if (sim.level === 5) {
    const hit = nearestPrompt(sim);
    if (!hit) return;
    if (hit.actor.id === "rifle") {
      sim.hasRifle = true;
      burst(sim, den.gunX, den.gunY, 10);
      sim.note = "Space fires the gun. Face a bear, then fire.";
      return;
    }
    if (hit.actor.id === "door") {
      if (sim.bear1Alive || sim.bear2Alive) {
        sim.mode = "talk";
        sim.speaker = "The far door";
        sim.line = BEAR_DOOR_SHUT;
        return;
      }
      enterCove(sim);
      return;
    }
    return;
  }
  if (sim.level === 6) {
    const hit = nearestPrompt(sim);
    if (!hit) return;
    if (hit.actor.id === "pistol") {
      sim.hasPistol = true;
      burst(sim, cove.gunX, cove.gunY, 10);
      sim.note = "Space fires the gun. Face the squid, then fire.";
      return;
    }
    if (hit.actor.id === "door") {
      if (sim.squidAlive) {
        sim.mode = "talk";
        sim.speaker = "The squid door";
        sim.line = SQUID_DOOR_SHUT;
        return;
      }
      enterYard(sim);
      return;
    }
    return;
  }
  if (sim.level === 7) {
    const hit = nearestPrompt(sim);
    if (!hit) return;
    if (hit.actor.id === "blaster") {
      sim.hasBlaster = true;
      burst(sim, yard.gunX, yard.gunY, 10);
      sim.note = "Space fires the blaster. Face the dog, then fire.";
      return;
    }
    if (hit.actor.id === "door") {
      if (sim.dogAlive) {
        sim.mode = "talk";
        sim.speaker = "The dog door";
        sim.line = DOG_DOOR_SHUT;
        return;
      }
      enterLeaf(sim);
      return;
    }
    return;
  }
  if (sim.level === 8) {
    const hit = nearestPrompt(sim);
    if (!hit) return;
    if (hit.actor.id === "stick") {
      sim.hasStick = true;
      burst(sim, leaf.stickX, leaf.stickY, 10);
      sim.note = "Space swings the stick. Stand close, then swing.";
      return;
    }
    if (hit.actor.id === "door") {
      if (sim.isoAlive) {
        sim.mode = "talk";
        sim.speaker = "The isopod door";
        sim.line = ISO_DOOR_SHUT;
        return;
      }
      sim.mode = "won";
      sim.speaker = "Fernwood";
      sim.line = LEVEL9_OPEN;
      sim.note = "The door is open.";
      burst(sim, leaf.doorX, leaf.doorY, 16);
    }
    return;
  }
  const hit = nearestPrompt(sim);
  if (!hit) return;
  const { actor } = hit;
  if (actor.kind === "lantern") {
    sim.lit.add(actor.id);
    burst(sim, actor.x, actor.y, 14);
    sim.note =
      sim.lit.size >= 5
        ? "Every lantern burns. The oak is listening."
        : `${sim.lit.size} of 5 lanterns lit.`;
    return;
  }
  if (actor.kind === "fox") {
    sim.talked.add("fox");
    sim.mode = "talk";
    sim.speaker = "Bramble the fox";
    sim.line = FOX_LINE;
    return;
  }
  if (actor.kind === "owl") {
    sim.talked.add("owl");
    sim.mode = "talk";
    sim.speaker = "Nell the owl";
    sim.line = OWL_LINE;
    return;
  }
  if (sim.lit.size >= 5) {
    enterGrove(sim);
    return;
  }
  sim.mode = "talk";
  sim.speaker = "The old oak";
  sim.line = OAK_SHUT;
}

export type ControlsProbe = {
  getX: () => number;
  getY: () => number;
  getSpeed: () => number;
  getYaw: () => number;
  setKeys: (codes: string[]) => void;
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
  }
}
