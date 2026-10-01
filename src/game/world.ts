export const COLS = 36;
export const ROWS = 26;
export const TILE = 48;

export type Tile = "grass" | "path" | "water" | "tree";
export type Kind = "lantern" | "acorn" | "fox" | "owl" | "oak";
export type Facing = "down" | "up" | "left" | "right";

export interface Actor {
  id: string;
  kind: Kind;
  x: number;
  y: number;
  name: string;
}

const PATH_POINTS: Array<[number, number]> = [
  [18, 23],
  [18, 18],
  [10, 18],
  [10, 13],
  [18, 13],
  [26, 13],
  [26, 8],
  [18, 8],
  [18, 4],
];

const LANTERN_TILES: Array<[number, number]> = [
  [18, 18],
  [10, 13],
  [26, 13],
  [26, 8],
  [18, 6],
];

const ACORN_TILES: Array<[number, number]> = [
  [15, 21],
  [22, 20],
  [8, 15],
  [14, 11],
  [28, 12],
  [21, 5],
];

const FOX_TILE: [number, number] = [7, 16];
const OWL_TILE: [number, number] = [29, 10];
const OAK_TILE: [number, number] = [18, 3];
const START_TILE: [number, number] = [18, 23];

export const FOX_LINE =
  "The storm blew the trail dark. Light the five lanterns, and the old oak will open its root-door for you.";
export const OWL_LINE =
  "Four flames is a story stopped halfway. Five, and Fernwood lets you in.";
export const OAK_SHUT =
  "The bark is warm, but the door stays shut. Somewhere on the trail a lantern is still cold.";
export const ENDING =
  "The root-door sighed open. The grove inside was a bowl of quiet light, and fireflies rose like sparks that had chosen to stay.";

export const GROVE_ENTER =
  "The root-door opened onto a closed grove. A sword leans on a stump. The thing in the moss has no magic — it only runs. When it falls, the key to the far door is yours.";

export const DOOR_SHUT = "The far door is shut. The key is still inside the blob.";
export const DOOR_OPEN =
  "The key turned. Beyond it the ground went soft and wet, and one yellow eye watched from the reeds.";

export const MARSH_ENTER =
  "A one-eyed frog waits in the hollow. It has no tricks but its jump. A shotgun leans on the stump. When the frog falls, the door to Level 4 will open.";

export const FROG_DOOR_SHUT = "The door to Level 4 stays shut while the frog still watches.";
export const POND_ENTER =
  "The reeds open onto a quiet pond. Five ducklings are hiding. Take the corn, find each one, and feed them. When all five are fed, the key to Level 5 is yours.";
export const DUCK_DOOR_SHUT = "The door to Level 5 stays shut. A duckling is still hungry.";
export const LEVEL5_OPEN =
  "The key turned. Past the pond the pines close in, and two bears in hats are waiting.";
export const DEN_ENTER =
  "Two bears stand in the pines, each wearing a hat. They only charge. A gun leans on the stump. When both fall, the far door will open.";
export const BEAR_DOOR_SHUT = "The door stays shut while a bear is still standing.";
export const LEVEL6_OPEN =
  "Both bears are still. Past the door the ground turns to wet stone, and a three-eyed squid is waiting.";
export const COVE_ENTER =
  "A three-eyed squid waits in the cove. It only slides toward you. A gun lies on the rock. Five hits will drop it, and then the squid door will open.";
export const SQUID_DOOR_SHUT = "The squid door stays shut while the squid still watches.";
export const LEVEL7_OPEN =
  "The squid is still. Past the door the trees thin, and a three-headed dog is waiting.";
export const YARD_ENTER =
  "A three-headed dog stands in the yard. It only charges. A blaster rests on the stump. Six hits will drop it, and then the door will open.";
export const DOG_DOOR_SHUT = "The door stays shut while the three-headed dog still stands.";
export const LEVEL8_OPEN =
  "The dog is still. Past the door the leaves pile up, and a great isopod is waiting.";
export const LEAF_ENTER =
  "An isopod waits in the leaves. It only crawls toward you. A stick leans on the stump. Ten hits will drop it, and then the door will open.";
export const ISO_DOOR_SHUT = "The door stays shut while the isopod still crawls.";
export const LEVEL9_OPEN =
  "The isopod is still. The door opens onto a quieter wood. Level 9 is not written yet, but the way through is yours.";

export const GCOLS = 22;
export const GROWS = 16;

function buildGrove() {
  const tiles: Tile[][] = Array.from({ length: GROWS }, () => Array<Tile>(GCOLS).fill("grass"));
  const path = new Set<string>();
  const stamp = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx <= 0 || ty <= 0 || tx >= GCOLS - 1 || ty >= GROWS - 1) continue;
        tiles[ty][tx] = "path";
        path.add(`${tx},${ty}`);
      }
    }
  };
  const pts: Array<[number, number]> = [
    [11, 13],
    [11, 8],
    [11, 3],
  ];
  for (let i = 1; i < pts.length; i++) line(pts[i - 1], pts[i], stamp);
  stamp(11, 13);
  for (let y = 0; y < GROWS; y++) {
    for (let x = 0; x < GCOLS; x++) {
      if (x === 0 || y === 0 || x === GCOLS - 1 || y === GROWS - 1) {
        if (tiles[y][x] !== "path") tiles[y][x] = "tree";
        continue;
      }
      if (tiles[y][x] !== "grass") continue;
      const arena = Math.max(Math.abs(x - 11), Math.abs(y - 8)) <= 3;
      const swordClear = Math.max(Math.abs(x - 6), Math.abs(y - 11)) <= 1;
      if (arena || swordClear) continue;
      let best = 99;
      for (const key of path) {
        const [px, py] = key.split(",").map(Number);
        best = Math.min(best, Math.max(Math.abs(px - x), Math.abs(py - y)));
      }
      if (best >= 2 && hash(x + 9, y + 4) < 55) tiles[y][x] = "tree";
    }
  }
  tiles[2][10] = "path";
  tiles[2][11] = "path";
  tiles[2][12] = "path";
  return tiles;
}

export const groveTiles = buildGrove();

const gfeet = (tx: number, ty: number) => ({
  x: (tx + 0.5) * TILE,
  y: (ty + 0.82) * TILE,
});

export const grove = {
  tiles: groveTiles,
  startX: gfeet(11, 13).x,
  startY: gfeet(11, 13).y,
  swordX: gfeet(6, 11).x,
  swordY: gfeet(6, 11).y,
  doorX: gfeet(11, 2).x,
  doorY: gfeet(11, 2).y,
  blobX: gfeet(11, 7).x,
  blobY: gfeet(11, 7).y,
};

export function blockedOn(tiles: Tile[][], cols: number, rows: number, x: number, y: number) {
  const hw = 11;
  const top = y - 20;
  const points: Array<[number, number]> = [
    [x - hw, top],
    [x + hw, top],
    [x - hw, y - 2],
    [x + hw, y - 2],
  ];
  return points.some(([px, py]) => {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || ty < 0 || tx >= cols || ty >= rows) return true;
    const tile = tiles[ty][tx];
    return tile === "tree" || tile === "water";
  });
}

function hash(x: number, y: number) {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return (n >>> 0) % 100;
}

function buildMarsh() {
  const tiles: Tile[][] = Array.from({ length: GROWS }, () => Array<Tile>(GCOLS).fill("grass"));
  for (let y = 0; y < GROWS; y++) {
    for (let x = 0; x < GCOLS; x++) {
      const dx = (x - 4) / 3.2;
      const dy = (y - 5) / 2.2;
      if (dx * dx + dy * dy <= 1) tiles[y][x] = "water";
    }
  }
  const stamp = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx <= 0 || ty <= 0 || tx >= GCOLS - 1 || ty >= GROWS - 1) continue;
        if (tiles[ty][tx] === "water") continue;
        tiles[ty][tx] = "path";
      }
    }
  };
  const pts: Array<[number, number]> = [
    [11, 13],
    [11, 8],
    [15, 8],
    [15, 4],
    [11, 3],
  ];
  for (let i = 1; i < pts.length; i++) line(pts[i - 1], pts[i], stamp);
  for (let y = 0; y < GROWS; y++) {
    for (let x = 0; x < GCOLS; x++) {
      if ((x === 0 || y === 0 || x === GCOLS - 1 || y === GROWS - 1) && tiles[y][x] !== "path" && tiles[y][x] !== "water") {
        tiles[y][x] = "tree";
      }
    }
  }
  tiles[2][10] = "path";
  tiles[2][11] = "path";
  tiles[2][12] = "path";
  tiles[11][16] = "path";
  return tiles;
}

export const marshTiles = buildMarsh();

export const marsh = {
  tiles: marshTiles,
  startX: gfeet(11, 13).x,
  startY: gfeet(11, 13).y,
  gunX: gfeet(16, 11).x,
  gunY: gfeet(16, 11).y,
  doorX: gfeet(11, 2).x,
  doorY: gfeet(11, 2).y,
  frogX: gfeet(14, 6).x,
  frogY: gfeet(14, 6).y,
};

function buildPond() {
  const tiles: Tile[][] = Array.from({ length: GROWS }, () => Array<Tile>(GCOLS).fill("grass"));
  for (let y = 0; y < GROWS; y++) {
    for (let x = 0; x < GCOLS; x++) {
      const dx = (x + 0.5 - 11.5) / 2.6;
      const dy = (y + 0.5 - 8.5) / 1.8;
      if (dx * dx + dy * dy <= 1) tiles[y][x] = "water";
    }
  }
  const stamp = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx <= 0 || ty <= 0 || tx >= GCOLS - 1 || ty >= GROWS - 1) continue;
        if (tiles[ty][tx] === "water") continue;
        tiles[ty][tx] = "path";
      }
    }
  };
  const pts: Array<[number, number]> = [
    [11, 13],
    [8, 12],
    [4, 10],
    [4, 6],
    [7, 3],
    [11, 2],
    [15, 3],
    [18, 5],
    [17, 11],
    [14, 12],
    [11, 13],
  ];
  for (let i = 1; i < pts.length; i++) line(pts[i - 1], pts[i], stamp);
  for (let y = 0; y < GROWS; y++) {
    for (let x = 0; x < GCOLS; x++) {
      if ((x === 0 || y === 0 || x === GCOLS - 1 || y === GROWS - 1) && tiles[y][x] !== "path" && tiles[y][x] !== "water") {
        tiles[y][x] = "tree";
      }
    }
  }
  tiles[2][10] = "path";
  tiles[2][11] = "path";
  tiles[2][12] = "path";
  return tiles;
}

export const pondTiles = buildPond();

export const ducklings = [
  { id: "pip", name: "Pip", x: gfeet(4, 10).x, y: gfeet(4, 10).y },
  { id: "quill", name: "Quill", x: gfeet(17, 11).x, y: gfeet(17, 11).y },
  { id: "nib", name: "Nib", x: gfeet(3, 6).x, y: gfeet(3, 6).y },
  { id: "downy", name: "Downy", x: gfeet(18, 5).x, y: gfeet(18, 5).y },
  { id: "pebble", name: "Pebble", x: gfeet(7, 3).x, y: gfeet(7, 3).y },
];

export const pond = {
  tiles: pondTiles,
  startX: gfeet(11, 13).x,
  startY: gfeet(11, 13).y,
  cornX: gfeet(14, 12).x,
  cornY: gfeet(14, 12).y,
  doorX: gfeet(11, 2).x,
  doorY: gfeet(11, 2).y,
};

function buildDen() {
  const tiles: Tile[][] = Array.from({ length: GROWS }, () => Array<Tile>(GCOLS).fill("grass"));
  const stamp = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx <= 0 || ty <= 0 || tx >= GCOLS - 1 || ty >= GROWS - 1) continue;
        tiles[ty][tx] = "path";
      }
    }
  };
  const pts: Array<[number, number]> = [
    [11, 13],
    [11, 8],
    [11, 3],
    [5, 12],
    [11, 13],
  ];
  for (let i = 1; i < pts.length; i++) line(pts[i - 1], pts[i], stamp);
  for (let y = 0; y < GROWS; y++) {
    for (let x = 0; x < GCOLS; x++) {
      if (x === 0 || y === 0 || x === GCOLS - 1 || y === GROWS - 1) {
        if (tiles[y][x] !== "path") tiles[y][x] = "tree";
      }
    }
  }
  tiles[2][10] = "path";
  tiles[2][11] = "path";
  tiles[2][12] = "path";
  return tiles;
}

export const denTiles = buildDen();

export const den = {
  tiles: denTiles,
  startX: gfeet(11, 13).x,
  startY: gfeet(11, 13).y,
  gunX: gfeet(5, 12).x,
  gunY: gfeet(5, 12).y,
  doorX: gfeet(11, 2).x,
  doorY: gfeet(11, 2).y,
  bear1X: gfeet(7, 7).x,
  bear1Y: gfeet(7, 7).y,
  bear2X: gfeet(15, 6).x,
  bear2Y: gfeet(15, 6).y,
};

function buildCove() {
  const tiles: Tile[][] = Array.from({ length: GROWS }, () => Array<Tile>(GCOLS).fill("grass"));
  const stamp = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx <= 0 || ty <= 0 || tx >= GCOLS - 1 || ty >= GROWS - 1) continue;
        tiles[ty][tx] = "path";
      }
    }
  };
  const pts: Array<[number, number]> = [
    [11, 13],
    [11, 8],
    [11, 3],
    [5, 12],
    [11, 13],
  ];
  for (let i = 1; i < pts.length; i++) line(pts[i - 1], pts[i], stamp);
  for (let y = 0; y < GROWS; y++) {
    for (let x = 0; x < GCOLS; x++) {
      if (x === 0 || y === 0 || x === GCOLS - 1 || y === GROWS - 1) {
        if (tiles[y][x] !== "path") tiles[y][x] = "tree";
      }
    }
  }
  tiles[2][10] = "path";
  tiles[2][11] = "path";
  tiles[2][12] = "path";
  return tiles;
}

export const coveTiles = buildCove();

export const cove = {
  tiles: coveTiles,
  startX: gfeet(11, 13).x,
  startY: gfeet(11, 13).y,
  gunX: gfeet(5, 12).x,
  gunY: gfeet(5, 12).y,
  doorX: gfeet(11, 2).x,
  doorY: gfeet(11, 2).y,
  squidX: gfeet(11, 7).x,
  squidY: gfeet(11, 7).y,
};

function buildYard() {
  const tiles: Tile[][] = Array.from({ length: GROWS }, () => Array<Tile>(GCOLS).fill("grass"));
  const stamp = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx <= 0 || ty <= 0 || tx >= GCOLS - 1 || ty >= GROWS - 1) continue;
        tiles[ty][tx] = "path";
      }
    }
  };
  const pts: Array<[number, number]> = [
    [11, 13],
    [11, 8],
    [11, 3],
    [5, 12],
    [11, 13],
  ];
  for (let i = 1; i < pts.length; i++) line(pts[i - 1], pts[i], stamp);
  for (let y = 0; y < GROWS; y++) {
    for (let x = 0; x < GCOLS; x++) {
      if (x === 0 || y === 0 || x === GCOLS - 1 || y === GROWS - 1) {
        if (tiles[y][x] !== "path") tiles[y][x] = "tree";
      }
    }
  }
  tiles[2][10] = "path";
  tiles[2][11] = "path";
  tiles[2][12] = "path";
  return tiles;
}

export const yardTiles = buildYard();

export const yard = {
  tiles: yardTiles,
  startX: gfeet(11, 13).x,
  startY: gfeet(11, 13).y,
  gunX: gfeet(5, 12).x,
  gunY: gfeet(5, 12).y,
  doorX: gfeet(11, 2).x,
  doorY: gfeet(11, 2).y,
  dogX: gfeet(11, 7).x,
  dogY: gfeet(11, 7).y,
};

function buildLeaf() {
  const tiles: Tile[][] = Array.from({ length: GROWS }, () => Array<Tile>(GCOLS).fill("grass"));
  const stamp = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx <= 0 || ty <= 0 || tx >= GCOLS - 1 || ty >= GROWS - 1) continue;
        tiles[ty][tx] = "path";
      }
    }
  };
  const pts: Array<[number, number]> = [
    [11, 13],
    [11, 8],
    [11, 3],
    [5, 12],
    [11, 13],
  ];
  for (let i = 1; i < pts.length; i++) line(pts[i - 1], pts[i], stamp);
  for (let y = 0; y < GROWS; y++) {
    for (let x = 0; x < GCOLS; x++) {
      if (x === 0 || y === 0 || x === GCOLS - 1 || y === GROWS - 1) {
        if (tiles[y][x] !== "path") tiles[y][x] = "tree";
      }
    }
  }
  tiles[2][10] = "path";
  tiles[2][11] = "path";
  tiles[2][12] = "path";
  return tiles;
}

export const leafTiles = buildLeaf();

export const leaf = {
  tiles: leafTiles,
  startX: gfeet(11, 13).x,
  startY: gfeet(11, 13).y,
  stickX: gfeet(5, 12).x,
  stickY: gfeet(5, 12).y,
  doorX: gfeet(11, 2).x,
  doorY: gfeet(11, 2).y,
  isoX: gfeet(11, 7).x,
  isoY: gfeet(11, 7).y,
};

function line(a: [number, number], b: [number, number], plot: (x: number, y: number) => void) {
  let x0 = a[0];
  let y0 = a[1];
  const x1 = b[0];
  const y1 = b[1];
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  for (;;) {
    plot(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function ellipse(cx: number, cy: number, rx: number, ry: number, x: number, y: number) {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function chebyshev(ax: number, ay: number, bx: number, by: number) {
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
}

function build() {
  const tiles: Tile[][] = Array.from({ length: ROWS }, () => Array<Tile>(COLS).fill("grass"));

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (ellipse(6, 6, 4.2, 3.1, x, y) || ellipse(29, 6, 4.2, 3.1, x, y)) tiles[y][x] = "water";
    }
  }

  const path = new Set<string>();
  const stampPath = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx <= 0 || ty <= 0 || tx >= COLS - 1 || ty >= ROWS - 1) continue;
        if (tiles[ty][tx] === "water") continue;
        tiles[ty][tx] = "path";
        path.add(`${tx},${ty}`);
      }
    }
  };
  for (let i = 1; i < PATH_POINTS.length; i++) line(PATH_POINTS[i - 1], PATH_POINTS[i], stampPath);
  stampPath(START_TILE[0], START_TILE[1]);

  const clearOf = (x: number, y: number) => {
    const spots: Array<[number, number]> = [FOX_TILE, OWL_TILE, OAK_TILE, ...ACORN_TILES, ...LANTERN_TILES];
    return spots.some(([sx, sy]) => chebyshev(sx, sy, x, y) <= 2);
  };

  const distPath = (x: number, y: number) => {
    let best = 99;
    for (const key of path) {
      const [px, py] = key.split(",").map(Number);
      const d = chebyshev(px, py, x, y);
      if (d < best) best = d;
    }
    return best;
  };

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const edge = x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1;
      if (edge && tiles[y][x] !== "path") {
        tiles[y][x] = "tree";
        continue;
      }
      if (tiles[y][x] !== "grass") continue;
      if (clearOf(x, y)) continue;
      if (distPath(x, y) >= 2 && hash(x, y) < 64) tiles[y][x] = "tree";
    }
  }

  const feet = (tx: number, ty: number) => ({
    x: (tx + 0.5) * TILE,
    y: (ty + 0.82) * TILE,
  });

  const actors: Actor[] = [
    ...LANTERN_TILES.map(([tx, ty], i) => ({
      id: `lantern-${i}`,
      kind: "lantern" as const,
      name: "Lantern",
      ...feet(tx, ty),
    })),
    ...ACORN_TILES.map(([tx, ty], i) => ({
      id: `acorn-${i}`,
      kind: "acorn" as const,
      name: "Acorn",
      ...feet(tx, ty),
    })),
    { id: "fox", kind: "fox", name: "Bramble", ...feet(FOX_TILE[0], FOX_TILE[1]) },
    { id: "owl", kind: "owl", name: "Nell", ...feet(OWL_TILE[0], OWL_TILE[1]) },
    { id: "oak", kind: "oak", name: "The old oak", ...feet(OAK_TILE[0], OAK_TILE[1]) },
  ];

  return {
    tiles,
    actors,
    startX: (START_TILE[0] + 0.5) * TILE,
    startY: (START_TILE[1] + 0.82) * TILE,
  };
}

export const world = build();

export function solidAt(px: number, py: number) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return true;
  const tile = world.tiles[ty][tx];
  return tile === "tree" || tile === "water";
}

export function bodyBlocked(x: number, y: number) {
  return blockedOn(world.tiles, COLS, ROWS, x, y);
}
