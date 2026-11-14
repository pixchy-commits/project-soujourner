// Level data. To add or change a level, edit LEVEL_DATA only.
// Map legend: o open ground, x rock, h sinkhole, s rover start, d target.
import { DIRS, solve, type Level } from "./solver";

type RawLevel = Omit<Level, "idx" | "rows" | "cols" | "rocks" | "holes" | "start" | "target" | "face" | "solution">;

export const LEVEL_DATA: RawLevel[] = [
  {
    "sol": 3,
    "title": "First Steps",
    "targetName": "Barnacle Bill",
    "objective": "Drive Sojourner to Barnacle Bill.",
    "tip": "Forward moves the way the rover's nose (the yellow arrow) points. Turning doesn't move the rover — it only changes where it faces.",
    "startDir": "N",
    "maxBlocks": 6,
    "recommended": 6,
    "optimal": 5,
    "seed": 11,
    "map": [
      "xoho",
      "oodo",
      "ooox",
      "sooo"
    ]
  },
  {
    "sol": 5,
    "title": "Rock Garden",
    "targetName": "Scooby-Doo",
    "objective": "Weave around the rocks to reach Scooby-Doo.",
    "tip": "Rocks and holes block the way. Plan where you need to turn before you start adding blocks.",
    "startDir": "N",
    "maxBlocks": 9,
    "recommended": 9,
    "optimal": 8,
    "seed": 23,
    "map": [
      "ooooh",
      "xoodo",
      "oooox",
      "oxohx",
      "sxooo"
    ]
  },
  {
    "sol": 9,
    "title": "The Long Drive",
    "targetName": "Wedge",
    "objective": "Plan a longer route to the rock called Wedge.",
    "tip": "Sojourner starts facing East this time. Check the compass before you plan!",
    "startDir": "E",
    "maxBlocks": 12,
    "recommended": 11,
    "optimal": 10,
    "seed": 37,
    "map": [
      "oooxoh",
      "xxoodo",
      "oxooxo",
      "xooxoh",
      "ooooox",
      "sooooo"
    ]
  },
  {
    "sol": 14,
    "title": "Boulder Maze",
    "targetName": "Half Dome",
    "objective": "Find a path through the boulder field to Half Dome.",
    "tip": "There's more than one way through. Every turn costs a block, so fewer turns is better.",
    "startDir": "N",
    "maxBlocks": 14,
    "recommended": 13,
    "optimal": 12,
    "seed": 41,
    "map": [
      "ooooooh",
      "ooxxodo",
      "oxxoooo",
      "oxoxxoo",
      "oooxxox",
      "oooohoo",
      "soxoxoo"
    ]
  },
  {
    "sol": 21,
    "title": "Meet Yogi",
    "targetName": "Science spot",
    "featureName": "Yogi",
    "faceDir": "N",
    "objective": "Park on the science spot and face Yogi so the instrument can touch the rock.",
    "tip": "You must finish on the spot AND face North, toward Yogi.",
    "startDir": "E",
    "maxBlocks": 13,
    "recommended": 13,
    "optimal": 12,
    "seed": 53,
    "map": [
      "oxoxxoh",
      "xooodoo",
      "ooxoooo",
      "oooxxxo",
      "hooxxoo",
      "ooooooo",
      "sooxoxo"
    ]
  }
];

function parseLevel(raw: RawLevel, idx: number): Level {
  const L = { ...raw, idx, rows: raw.map.length, cols: raw.map[0].length, rocks: new Map<string, string>(), holes: new Set<string>(),
    start: { r: 0, c: 0, d: 0 }, target: { r: 0, c: 0 }, face: raw.faceDir ? DIRS.indexOf(raw.faceDir as (typeof DIRS)[number]) : -1 } as Level;
  raw.map.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch === "s") L.start = { r, c, d: DIRS.indexOf(raw.startDir as (typeof DIRS)[number]) };
    else if (ch === "d") L.target = { r, c };
    else if (ch === "x") L.rocks.set(r + "," + c, "x");
    else if (ch === "h") L.holes.add(r + "," + c);
  }));
  return L;
}

export const LEVELS: Level[] = LEVEL_DATA.map(parseLevel);

/** Checks every level on load and fills in the real optimal solution. */
export const levelProblems: string[] = [];
LEVELS.forEach((L) => {
  const p = solve(L, L.start);
  if (!p) { levelProblems.push(L.title + ": no solution"); L.optimal = L.maxBlocks; return; }
  if (p.length > L.maxBlocks) levelProblems.push(`${L.title}: needs ${p.length} > limit ${L.maxBlocks}`);
  if (p.length !== L.optimal) L.optimal = p.length;
  L.recommended = Math.max(L.optimal, Math.min(L.recommended, L.maxBlocks));
  L.solution = p;
});
