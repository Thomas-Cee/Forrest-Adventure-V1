import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bbh8_SQq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PATH_POINTS = [
	[18, 23],
	[18, 18],
	[10, 18],
	[10, 13],
	[18, 13],
	[26, 13],
	[26, 8],
	[18, 8],
	[18, 4]
];
var LANTERN_TILES = [
	[18, 18],
	[10, 13],
	[26, 13],
	[26, 8],
	[18, 6]
];
var ACORN_TILES = [
	[15, 21],
	[22, 20],
	[8, 15],
	[14, 11],
	[28, 12],
	[21, 5]
];
var FOX_TILE = [7, 16];
var OWL_TILE = [29, 10];
var OAK_TILE = [18, 3];
var START_TILE = [18, 23];
var FOX_LINE = "The storm blew the trail dark. Light the five lanterns, and the old oak will open its root-door for you.";
var OWL_LINE = "Four flames is a story stopped halfway. Five, and Fernwood lets you in.";
var OAK_SHUT = "The bark is warm, but the door stays shut. Somewhere on the trail a lantern is still cold.";
var ENDING = "The root-door sighed open. The grove inside was a bowl of quiet light, and fireflies rose like sparks that had chosen to stay. Wren sat on the root, opened the little book, and wrote the path down so the next walker would not lose it.";
function hash(x, y) {
	let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
	n = Math.imul(n ^ n >>> 13, 1274126177);
	return (n >>> 0) % 100;
}
function line(a, b, plot) {
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
function ellipse(cx, cy, rx, ry, x, y) {
	const dx = (x - cx) / rx;
	const dy = (y - cy) / ry;
	return dx * dx + dy * dy <= 1;
}
function chebyshev(ax, ay, bx, by) {
	return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
}
function build() {
	const tiles = Array.from({ length: 26 }, () => Array(36).fill("grass"));
	for (let y = 0; y < 26; y++) for (let x = 0; x < 36; x++) if (ellipse(6, 6, 4.2, 3.1, x, y) || ellipse(29, 6, 4.2, 3.1, x, y)) tiles[y][x] = "water";
	const path = /* @__PURE__ */ new Set();
	const stampPath = (x, y) => {
		for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
			const tx = x + dx;
			const ty = y + dy;
			if (tx <= 0 || ty <= 0 || tx >= 35 || ty >= 25) continue;
			if (tiles[ty][tx] === "water") continue;
			tiles[ty][tx] = "path";
			path.add(`${tx},${ty}`);
		}
	};
	for (let i = 1; i < PATH_POINTS.length; i++) line(PATH_POINTS[i - 1], PATH_POINTS[i], stampPath);
	stampPath(START_TILE[0], START_TILE[1]);
	const clearOf = (x, y) => {
		return [
			FOX_TILE,
			OWL_TILE,
			OAK_TILE,
			...ACORN_TILES,
			...LANTERN_TILES
		].some(([sx, sy]) => chebyshev(sx, sy, x, y) <= 2);
	};
	const distPath = (x, y) => {
		let best = 99;
		for (const key of path) {
			const [px, py] = key.split(",").map(Number);
			const d = chebyshev(px, py, x, y);
			if (d < best) best = d;
		}
		return best;
	};
	for (let y = 0; y < 26; y++) for (let x = 0; x < 36; x++) {
		if ((x === 0 || y === 0 || x === 35 || y === 25) && tiles[y][x] !== "path") {
			tiles[y][x] = "tree";
			continue;
		}
		if (tiles[y][x] !== "grass") continue;
		if (clearOf(x, y)) continue;
		if (distPath(x, y) >= 2 && hash(x, y) < 64) tiles[y][x] = "tree";
	}
	const feet = (tx, ty) => ({
		x: (tx + .5) * 48,
		y: (ty + .82) * 48
	});
	return {
		tiles,
		actors: [
			...LANTERN_TILES.map(([tx, ty], i) => ({
				id: `lantern-${i}`,
				kind: "lantern",
				name: "Lantern",
				...feet(tx, ty)
			})),
			...ACORN_TILES.map(([tx, ty], i) => ({
				id: `acorn-${i}`,
				kind: "acorn",
				name: "Acorn",
				...feet(tx, ty)
			})),
			{
				id: "fox",
				kind: "fox",
				name: "Bramble",
				...feet(FOX_TILE[0], FOX_TILE[1])
			},
			{
				id: "owl",
				kind: "owl",
				name: "Nell",
				...feet(OWL_TILE[0], OWL_TILE[1])
			},
			{
				id: "oak",
				kind: "oak",
				name: "The old oak",
				...feet(OAK_TILE[0], OAK_TILE[1])
			}
		],
		startX: (START_TILE[0] + .5) * 48,
		startY: (START_TILE[1] + .82) * 48
	};
}
var world = build();
function solidAt(px, py) {
	const tx = Math.floor(px / 48);
	const ty = Math.floor(py / 48);
	if (tx < 0 || ty < 0 || tx >= 36 || ty >= 26) return true;
	const tile = world.tiles[ty][tx];
	return tile === "tree" || tile === "water";
}
function bodyBlocked(x, y) {
	const hw = 11;
	const top = y - 20;
	return [
		[x - hw, top],
		[x + hw, top],
		[x - hw, y - 2],
		[x + hw, y - 2]
	].some(([px, py]) => solidAt(px, py));
}
var forced = null;
function setForcedKeys(codes) {
	forced = codes.length === 0 ? null : new Set(codes);
}
function freshSim() {
	return {
		x: world.startX,
		y: world.startY,
		facing: "up",
		moving: false,
		bob: 0,
		speed: 0,
		lit: /* @__PURE__ */ new Set(),
		found: /* @__PURE__ */ new Set(),
		talked: /* @__PURE__ */ new Set(),
		mode: "play",
		speaker: "",
		line: "",
		note: "Five lanterns mark the trail to the old oak.",
		particles: []
	};
}
function simFromSave(save) {
	const sim = freshSim();
	sim.x = save.x;
	sim.y = save.y;
	sim.facing = save.facing;
	sim.lit = new Set(save.lit);
	sim.found = new Set(save.found);
	sim.talked = new Set(save.talked);
	if (save.won) {
		sim.mode = "won";
		sim.speaker = "Fernwood";
		sim.line = ENDING;
		sim.note = "The grove is open.";
	}
	return sim;
}
function toSave(sim) {
	return {
		version: 1,
		x: sim.x,
		y: sim.y,
		facing: sim.facing,
		lit: [...sim.lit],
		found: [...sim.found],
		talked: [...sim.talked],
		won: sim.mode === "won"
	};
}
function moveVector(keys, stick) {
	const src = forced ?? keys;
	let mx = forced ? 0 : stick.x;
	let my = forced ? 0 : stick.y;
	if (src.has("KeyA") || src.has("ArrowLeft")) mx -= 1;
	if (src.has("KeyD") || src.has("ArrowRight")) mx += 1;
	if (src.has("KeyW") || src.has("ArrowUp")) my -= 1;
	if (src.has("KeyS") || src.has("ArrowDown")) my += 1;
	const len = Math.hypot(mx, my);
	if (!(src.has("KeyA") || src.has("KeyD") || src.has("KeyW") || src.has("KeyS") || src.has("ArrowLeft") || src.has("ArrowRight") || src.has("ArrowUp") || src.has("ArrowDown")) && len > 0 && len < .18) return {
		mx: 0,
		my: 0
	};
	if (len > 1) {
		mx /= len;
		my /= len;
	}
	return {
		mx,
		my
	};
}
function burst(sim, x, y, count) {
	for (let i = 0; i < count; i++) {
		const a = Math.PI * 2 * i / count;
		sim.particles.push({
			x,
			y: y - 20,
			vx: Math.cos(a) * 36,
			vy: Math.sin(a) * 28 - 20,
			life: .7,
			max: .7,
			gold: true
		});
	}
}
function step(sim, dt, keys, stick) {
	sim.speed = 0;
	if (sim.mode === "play") {
		const { mx, my } = moveVector(keys, stick);
		if (mx !== 0 || my !== 0) {
			sim.moving = true;
			sim.bob += dt * 7;
			if (Math.abs(mx) > Math.abs(my)) sim.facing = mx < 0 ? "left" : "right";
			else sim.facing = my < 0 ? "up" : "down";
			const nx = sim.x + mx * 168 * dt;
			if (!bodyBlocked(nx, sim.y)) sim.x = nx;
			const ny = sim.y + my * 168 * dt;
			if (!bodyBlocked(sim.x, ny)) sim.y = ny;
			sim.speed = Math.hypot(mx, my) * 168;
			collectAcorns(sim);
		} else sim.moving = false;
	} else sim.moving = false;
	if (sim.mode === "won" && sim.particles.length < 48 && Math.random() < dt * 6) sim.particles.push({
		x: sim.x + (Math.random() - .5) * 220,
		y: sim.y + (Math.random() - .5) * 140,
		vx: (Math.random() - .5) * 12,
		vy: -18 - Math.random() * 16,
		life: 1.6,
		max: 1.6,
		gold: true
	});
	for (const p of sim.particles) {
		p.x += p.vx * dt;
		p.y += p.vy * dt;
		p.life -= dt;
	}
	if (sim.particles.length > 80) sim.particles.splice(0, sim.particles.length - 80);
	sim.particles = sim.particles.filter((p) => p.life > 0);
}
function collectAcorns(sim) {
	for (const actor of world.actors) {
		if (actor.kind !== "acorn" || sim.found.has(actor.id)) continue;
		if (Math.hypot(actor.x - sim.x, actor.y - sim.y) < 34) {
			sim.found.add(actor.id);
			burst(sim, actor.x, actor.y, 10);
		}
	}
}
function nearestPrompt(sim) {
	if (sim.mode !== "play") return null;
	let best = null;
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
	if (best.kind === "lantern") return {
		actor: best,
		label: "Light the lantern"
	};
	if (best.kind === "fox") return {
		actor: best,
		label: "Speak with Bramble"
	};
	if (best.kind === "owl") return {
		actor: best,
		label: "Speak with Nell"
	};
	return {
		actor: best,
		label: sim.lit.size >= 5 ? "Open the root-door" : "Listen to the oak"
	};
}
function interact(sim) {
	if (sim.mode === "talk") {
		sim.mode = "play";
		return;
	}
	if (sim.mode !== "play") return;
	const hit = nearestPrompt(sim);
	if (!hit) return;
	const { actor } = hit;
	if (actor.kind === "lantern") {
		sim.lit.add(actor.id);
		burst(sim, actor.x, actor.y, 14);
		sim.note = sim.lit.size >= 5 ? "Every lantern burns. The oak is listening." : `${sim.lit.size} of 5 lanterns lit.`;
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
		sim.mode = "won";
		sim.speaker = "Fernwood";
		sim.line = ENDING;
		sim.note = "The grove is open.";
		burst(sim, actor.x, actor.y - 40, 18);
		return;
	}
	sim.mode = "talk";
	sim.speaker = "The old oak";
	sim.line = OAK_SHUT;
}
var SAVE_KEY = "forest-adventure-v1";
var SPRITES = {
	down: "/sprites/wren-down.png",
	up: "/sprites/wren-up.png",
	side: "/sprites/wren-side.png",
	tree: "/sprites/tree.png",
	fox: "/sprites/fox.png",
	owl: "/sprites/owl.png",
	lantern: "/sprites/lantern.png",
	acorn: "/sprites/acorn.png",
	oak: "/sprites/oak.png"
};
var HEIGHTS = {
	down: 86,
	up: 86,
	side: 86,
	tree: 132,
	fox: 68,
	owl: 64,
	lantern: 50,
	acorn: 32,
	oak: 176
};
function readSave() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		if (!data || data.version !== 1 || typeof data.x !== "number" || typeof data.y !== "number") return null;
		if (!Array.isArray(data.lit) || !Array.isArray(data.found)) return null;
		return data;
	} catch {
		return null;
	}
}
function writeSave(sim) {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(toSave(sim)));
	} catch {}
}
function tileHash(x, y) {
	let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
	n = Math.imul(n ^ n >>> 13, 1274126177);
	return (n >>> 0) % 100;
}
function facingYaw(facing) {
	if (facing === "right") return 0;
	if (facing === "left") return Math.PI;
	if (facing === "up") return -Math.PI / 2;
	return Math.PI / 2;
}
function emptyHud() {
	return {
		lit: 0,
		found: 0,
		note: "Five lanterns mark the trail to the old oak.",
		prompt: null,
		mode: "play",
		speaker: "",
		line: ""
	};
}
function ForestAdventure() {
	const canvasRef = (0, import_react.useRef)(null);
	const simRef = (0, import_react.useRef)(null);
	const screenRef = (0, import_react.useRef)("title");
	const keysRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const stickRef = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const stickId = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	const reduceRef = (0, import_react.useRef)(false);
	const [screen, setScreen] = (0, import_react.useState)("title");
	const [hud, setHud] = (0, import_react.useState)(emptyHud);
	const [saved, setSaved] = (0, import_react.useState)(null);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const meters = (0, import_react.useRef)({
		lit: 0,
		found: 0,
		mode: "play",
		sig: ""
	});
	const lookRef = (0, import_react.useRef)(() => {});
	const camRef = (0, import_react.useRef)({
		x: 0,
		y: 0,
		ready: false
	});
	const hudApi = (0, import_react.useRef)(() => {});
	hudApi.current = (sim) => {
		const prompt = nearestPrompt(sim);
		setHud({
			lit: sim.lit.size,
			found: sim.found.size,
			note: sim.note,
			prompt: prompt?.label ?? null,
			mode: sim.mode,
			speaker: sim.speaker,
			line: sim.line
		});
	};
	function unlockAudio() {
		const AC = window.AudioContext;
		if (!audioRef.current) audioRef.current = new AC();
		audioRef.current.resume();
	}
	function chime(freq, extra) {
		const ctx = audioRef.current;
		if (!ctx || reduceRef.current) return;
		const play = (f, delay) => {
			const o = ctx.createOscillator();
			const g = ctx.createGain();
			o.type = "sine";
			o.frequency.value = f;
			const t = ctx.currentTime + delay;
			g.gain.setValueAtTime(1e-4, t);
			g.gain.exponentialRampToValueAtTime(.045, t + .02);
			g.gain.exponentialRampToValueAtTime(1e-4, t + .32);
			o.connect(g);
			g.connect(ctx.destination);
			o.start(t);
			o.stop(t + .34);
		};
		play(freq, 0);
		if (extra) play(extra, .08);
	}
	function begin(save) {
		unlockAudio();
		const sim = save ? simFromSave(save) : freshSim();
		simRef.current = sim;
		meters.current = {
			lit: sim.lit.size,
			found: sim.found.size,
			mode: sim.mode,
			sig: ""
		};
		camRef.current.ready = false;
		screenRef.current = "game";
		setScreen("game");
		setForcedKeys([]);
		keysRef.current.clear();
		stickRef.current = {
			x: 0,
			y: 0
		};
		setKnob({
			x: 0,
			y: 0
		});
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
		} catch {}
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
	(0, import_react.useEffect)(() => {
		setSaved(readSave());
		reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const images = {};
		for (const key of Object.keys(SPRITES)) {
			const img = new Image();
			img.src = SPRITES[key];
			images[key] = img;
		}
		const keys = keysRef.current;
		const onKeyDown = (e) => {
			const target = e.target;
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
			if ((e.code === "Space" || e.code === "KeyE") && !onButton) lookRef.current();
		};
		const onKeyUp = (e) => {
			keys.delete(e.code);
		};
		const clearKeys = () => {
			keys.clear();
			stickRef.current = {
				x: 0,
				y: 0
			};
			setKnob({
				x: 0,
				y: 0
			});
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
		const drawSprite = (key, x, y, flip = false, alpha = 1) => {
			const img = images[key];
			const h = HEIGHTS[key];
			const w = h * (img && img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : .6);
			ctx.save();
			ctx.translate(x, y);
			ctx.globalAlpha = alpha;
			ctx.fillStyle = "rgba(8, 18, 12, 0.32)";
			ctx.beginPath();
			ctx.ellipse(0, 0, Math.max(10, w * .28), 5.5, 0, 0, Math.PI * 2);
			ctx.fill();
			if (flip) ctx.scale(-1, 1);
			if (img && img.complete && img.naturalWidth > 0) ctx.drawImage(img, -w / 2, -h, w, h);
			else {
				ctx.fillStyle = key === "lantern" ? "#e6a23c" : "#3d6b45";
				ctx.fillRect(-w / 2, -h, w, h * .8);
			}
			ctx.restore();
		};
		const frame = (now) => {
			raf = requestAnimationFrame(frame);
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			if (!simRef.current) simRef.current = freshSim();
			const sim = simRef.current;
			let gx = 0;
			let gy = 0;
			let padDown = false;
			const pads = navigator.getGamepads?.();
			if (pads) for (const pad of pads) {
				if (!pad) continue;
				const ax = pad.axes[0] ?? 0;
				const ay = pad.axes[1] ?? 0;
				if (Math.hypot(ax, ay) > Math.hypot(gx, gy)) {
					gx = ax;
					gy = ay;
				}
				if (pad.buttons[0]?.pressed) padDown = true;
			}
			const touch = stickRef.current;
			const stick = Math.hypot(touch.x, touch.y) > .05 ? touch : {
				x: gx,
				y: gy
			};
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
				setKeys: (codes) => setForcedKeys(codes)
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
				prompt?.label ?? ""
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
			const mapW = 1728;
			const mapH = 1248;
			const pad = viewW < 820 ? Math.min(220, viewH * .2) : 0;
			const clamp = (target, map, view) => map <= view ? (map - view) / 2 : Math.max(-pad, Math.min(map - view + pad, target));
			const tx = clamp(sim.x - viewW / 2, mapW, viewW);
			const ty = clamp(sim.y - viewH / 2, mapH, viewH);
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
			const x0 = Math.max(0, Math.floor(cam.x / 48) - 2);
			const y0 = Math.max(0, Math.floor(cam.y / 48) - 2);
			const x1 = Math.min(35, Math.floor((cam.x + viewW) / 48) + 2);
			const y1 = Math.min(25, Math.floor((cam.y + viewH) / 48) + 2);
			for (let tyi = y0; tyi <= y1; tyi++) for (let txi = x0; txi <= x1; txi++) {
				const tile = world.tiles[tyi][txi];
				const px = txi * 48;
				const py = tyi * 48;
				const h = tileHash(txi, tyi);
				ctx.fillStyle = h < 33 ? "#1b3c2c" : h < 66 ? "#234833" : "#2a523b";
				ctx.fillRect(px, py, 49, 49);
				if (tile === "grass" && h % 19 === 0) {
					ctx.fillStyle = h % 2 ? "#e6b84a" : "#f3ead7";
					ctx.beginPath();
					ctx.arc(px + 24, py + 48 * .55, 2.1, 0, Math.PI * 2);
					ctx.fill();
				}
			}
			const pond = (cx, cy, rx, ry) => {
				ctx.beginPath();
				ctx.ellipse(cx * 48, cy * 48, rx * 48, ry * 48, 0, 0, Math.PI * 2);
				ctx.fillStyle = "#102f38";
				ctx.fill();
				ctx.beginPath();
				ctx.ellipse(cx * 48 - 6, cy * 48 - 4, rx * 48 * .72, ry * 48 * .62, 0, 0, Math.PI * 2);
				ctx.fillStyle = "#1c5562";
				ctx.fill();
				if (!reduceRef.current) {
					ctx.strokeStyle = "rgba(214, 236, 232, 0.28)";
					ctx.lineWidth = 1.5;
					ctx.beginPath();
					ctx.ellipse(cx * 48, cy * 48 + Math.sin(now / 700) * 3, rx * 48 * .45, ry * 48 * .22, 0, 0, Math.PI * 2);
					ctx.stroke();
				}
			};
			pond(6.5, 6.5, 4.15, 3.05);
			pond(29.5, 6.5, 4.15, 3.05);
			for (let tyi = y0; tyi <= y1; tyi++) for (let txi = x0; txi <= x1; txi++) {
				if (world.tiles[tyi][txi] !== "path") continue;
				const cx = (txi + .5) * 48;
				const cy = (tyi + .5) * 48;
				ctx.fillStyle = "#8d6840";
				ctx.beginPath();
				ctx.ellipse(cx, cy, 48 * .62, 24, 0, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = tileHash(txi, tyi) % 2 ? "#d4b27a" : "#c4a36b";
				ctx.beginPath();
				ctx.ellipse(cx, cy, 23.04, 17.28, 0, 0, Math.PI * 2);
				ctx.fill();
			}
			const glowAt = (x, y, radius, inner) => {
				const g = ctx.createRadialGradient(x, y, 4, x, y, radius);
				g.addColorStop(0, inner);
				g.addColorStop(1, "rgba(255, 170, 60, 0)");
				ctx.fillStyle = g;
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				ctx.fill();
			};
			const items = [];
			for (let tyi = y0; tyi <= y1; tyi++) for (let txi = x0; txi <= x1; txi++) {
				if (world.tiles[tyi][txi] !== "tree") continue;
				const fx = (txi + .5) * 48;
				const fy = (tyi + .92) * 48;
				items.push({
					y: fy,
					draw: () => drawSprite("tree", fx, fy)
				});
			}
			for (const actor of world.actors) {
				if (actor.kind === "acorn" && sim.found.has(actor.id)) continue;
				const bob = reduceRef.current || actor.kind === "oak" || actor.kind === "lantern" ? 0 : Math.sin(now / 420 + actor.x * .01) * 1.6;
				items.push({
					y: actor.y,
					draw: () => {
						if (actor.kind === "lantern" && sim.lit.has(actor.id)) glowAt(actor.x, actor.y - 24, 78, "rgba(255, 196, 90, 0.55)");
						if (actor.kind === "oak" && sim.mode === "won") glowAt(actor.x, actor.y - 70, 120, "rgba(255, 214, 140, 0.4)");
						const key = actor.kind === "lantern" ? "lantern" : actor.kind === "acorn" ? "acorn" : actor.kind === "fox" ? "fox" : actor.kind === "owl" ? "owl" : "oak";
						const unlit = actor.kind === "lantern" && !sim.lit.has(actor.id);
						drawSprite(key, actor.x, actor.y + bob, false, unlit ? .78 : 1);
					}
				});
			}
			const bob = sim.moving && !reduceRef.current ? Math.sin(sim.bob) * 2.4 : 0;
			const body = sim.facing === "up" ? "up" : sim.facing === "down" ? "down" : "side";
			items.push({
				y: sim.y,
				draw: () => {
					glowAt(sim.x, sim.y - 20, 70, "rgba(255, 214, 150, 0.16)");
					drawSprite(body, sim.x, sim.y + bob, sim.facing === "left");
				}
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
	}, []);
	function moveStick(e) {
		const rect = e.currentTarget.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		let dx = e.clientX - cx;
		let dy = e.clientY - cy;
		const max = rect.width * .36;
		const len = Math.hypot(dx, dy);
		if (len > max && len > 0) {
			dx = dx / len * max;
			dy = dy / len * max;
		}
		stickRef.current = {
			x: dx / max,
			y: dy / max
		};
		setKnob({
			x: dx,
			y: dy
		});
	}
	const onCanvasPointer = (e) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 overflow-hidden bg-pine text-parchment select-none",
		style: { touchAction: "none" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 h-full w-full",
				role: "img",
				"aria-label": "Fernwood, a forest trail",
				onPointerDown: onCanvasPointer,
				onContextMenu: (e) => e.preventDefault()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,16,12,0.45)_100%)]" }),
			screen === "game" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 md:p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto max-w-sm rounded-card bg-parchment/95 px-3 py-2 text-bark shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							"aria-label": `${hud.lit} of 5 lanterns lit`,
							children: [Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-3.5 w-2.5 rounded-full " + (i < hud.lit ? "bg-gold flame-lit" : "border border-bark/40 bg-bark/10") }, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 text-sm font-bold",
								children: [hud.lit, " of 5"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-snug",
							"aria-live": "polite",
							children: hud.note
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-full bg-parchment/95 px-3 py-2 text-sm font-bold text-bark shadow-lg",
							"aria-label": `${hud.found} of 6 acorns`,
							children: [hud.found, " / 6 acorns"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 min-w-11 rounded-full bg-parchment px-3 text-sm font-bold text-bark shadow-lg",
							onClick: () => {
								const sim = simRef.current;
								if (!sim || sim.mode === "won") return;
								if (sim.mode === "pause") sim.mode = "play";
								else if (sim.mode === "play" || sim.mode === "talk") sim.mode = "pause";
								hudApi.current(sim);
							},
							children: hud.mode === "pause" ? "Back" : "Rest"
						})]
					})]
				}),
				hud.mode === "play" && hud.prompt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute bottom-36 left-1/2 z-20 -translate-x-1/2 rounded-full bg-pine/80 px-4 py-2 text-center text-sm font-bold text-parchment shadow md:bottom-8",
					children: [hud.prompt, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 hidden font-medium text-gold md:inline",
						children: "E"
					})]
				}),
				hud.mode === "play" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-4 left-4 z-20 h-28 w-28 rounded-full border border-gold/50 bg-pine/70 shadow-lg md:hidden",
					style: { touchAction: "none" },
					onPointerDown: (e) => {
						unlockAudio();
						e.currentTarget.setPointerCapture(e.pointerId);
						stickId.current = e.pointerId;
						moveStick(e);
					},
					onPointerMove: (e) => {
						if (stickId.current !== e.pointerId) return;
						moveStick(e);
					},
					onPointerUp: (e) => {
						if (stickId.current !== e.pointerId) return;
						stickId.current = null;
						stickRef.current = {
							x: 0,
							y: 0
						};
						setKnob({
							x: 0,
							y: 0
						});
					},
					onPointerCancel: (e) => {
						if (stickId.current !== e.pointerId) return;
						stickId.current = null;
						stickRef.current = {
							x: 0,
							y: 0
						};
						setKnob({
							x: 0,
							y: 0
						});
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-1/2 left-1/2 h-11 w-11 rounded-full bg-parchment shadow",
						style: { transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute right-4 bottom-8 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-sm font-bold text-pine shadow-lg md:hidden",
					onPointerDown: (e) => {
						e.preventDefault();
						look();
					},
					children: "Look"
				})] }),
				hud.mode === "talk" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 z-30 flex items-end justify-center bg-pine/40 p-4 md:items-center",
					onClick: look,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "w-full max-w-lg rounded-card bg-parchment p-5 text-bark shadow-2xl",
						onClick: (e) => e.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm tracking-wide text-moss",
								children: hud.speaker
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-lg leading-relaxed",
								children: hud.line
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-4 min-h-11 rounded-full bg-pine px-5 font-bold text-parchment",
								onClick: look,
								children: "Go on"
							})
						]
					})
				}),
				hud.mode === "pause" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 z-30 flex items-center justify-center bg-pine/70 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "w-full max-w-sm rounded-card bg-parchment p-6 text-bark shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl text-pine",
								children: "The woods wait"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 leading-relaxed",
								children: "Wren can rest here. The lanterns stay as you left them."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-full bg-gold px-5 font-bold text-pine",
										onClick: () => {
											const sim = simRef.current;
											if (!sim) return;
											sim.mode = "play";
											hudApi.current(sim);
										},
										children: "Keep walking"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-full bg-pine px-5 font-bold text-parchment",
										onClick: rest,
										children: "Rest at the gate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-full border border-bark/30 px-5 font-bold",
										onClick: restart,
										children: "Start the trail over"
									})
								]
							})
						]
					})
				}),
				hud.mode === "won" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 z-30 flex items-end justify-center bg-pine/55 p-4 md:items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "max-h-[80vh] w-full max-w-lg overflow-auto rounded-card bg-parchment p-6 text-bark shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm tracking-wide text-moss",
								children: "Fernwood"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl text-pine",
								children: "The root-door opens"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 leading-relaxed",
								children: hud.line
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-moss",
								children: [
									"Acorns gathered: ",
									hud.found,
									" of 6. They were never the key — only a kindness along the way."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-full bg-gold px-5 font-bold text-pine",
									onClick: restart,
									children: "Walk it again"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-full bg-pine px-5 font-bold text-parchment",
									onClick: rest,
									children: "Leave the grove"
								})]
							})
						]
					})
				})
			] }),
			screen === "title" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/art/fernwood.jpg",
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-pine via-pine/75 to-pine/25" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex h-full flex-col items-center justify-end px-5 pb-10 text-center md:pb-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm tracking-[0.18em] text-gold uppercase",
								children: "A walk through Fernwood"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 font-display text-5xl leading-none text-parchment md:text-7xl",
								children: "Forest Adventure"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-md text-base leading-relaxed text-parchment/90",
								children: "Wren follows a dusky path. Five lanterns are dark. Light them, and the old oak will open its root-door."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex w-full max-w-sm flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-12 rounded-full bg-gold px-6 text-lg font-bold text-pine",
									onClick: () => begin(null),
									children: "Start the trail"
								}), saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-12 rounded-full bg-parchment px-6 text-lg font-bold text-pine",
									onClick: () => begin(saved),
									children: "Continue the walk"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 max-w-md text-sm text-parchment/75",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden md:inline",
									children: "Arrow keys or W A S D to walk. E to look, light a lantern, or talk. Acorns gather themselves."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "md:hidden",
									children: "Drag the stick to walk. Tap Look to light a lantern or talk."
								})]
							})
						]
					})
				]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForestAdventure, {});
}
//#endregion
export { Home as component };
