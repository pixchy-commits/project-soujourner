/** Static Sojourner mission definitions.
 * Coordinates: row 0 is top; column 0 is left.
 * S = rover start, T = destination, # = blocking rock, Y = named Yogi rock,
 * . = traversable ground. Direction is N/E/S/W.
 * These are game layouts, not surveyed Mars terrain.
 */
export type Direction = 'N' | 'E' | 'S' | 'W';
export type RoverCommand = 'F' | 'L' | 'R';
export type RoverPosition = { r: number; c: number; d: number };
export type MissionDefinition = {
  id: string;
  sol: number;
  title: string;
  targetName: string;
  featureName?: string;
  objective: string;
  tip: string;
  startDir: Direction;
  faceDir?: Direction;
  maxBlocks: number;
  recommended: number;
  seed: number;
  map: readonly string[];
};
export type RoverLevel = MissionDefinition & {
  idx: number;
  rows: number;
  cols: number;
  start: RoverPosition;
  target: { r: number; c: number };
  rocks: Map<string, string>;
  holes: Set<string>;
  face: number;
  optimal: number;
  solution: RoverCommand[];
};

export const MISSION_DATA: readonly MissionDefinition[] = [
  {
    "id": "mission-1-round-1",
    "sol": 1,
    "title": "Pathfinder → Barnacle Bill — Round 1",
    "targetName": "Barnacle Bill",
    "objective": "Reach the target.",
    "tip": "Plan your turns before driving.",
    "startDir": "N",
    "maxBlocks": 8,
    "recommended": 6,
    "seed": 301,
    "map": [
      "....",
      "#T.#",
      "....",
      "#..S"
    ]
  },
  {
    "id": "mission-1-round-2",
    "sol": 1,
    "title": "Pathfinder → Barnacle Bill — Round 2",
    "targetName": "Barnacle Bill",
    "objective": "Reach the target.",
    "tip": "Plan your turns before driving.",
    "startDir": "W",
    "maxBlocks": 9,
    "recommended": 7,
    "seed": 302,
    "map": [
      ".T#.",
      "....",
      "...#",
      ".#S."
    ]
  },
  {
    "id": "mission-1-round-3",
    "sol": 1,
    "title": "Pathfinder → Barnacle Bill — Round 3",
    "targetName": "Barnacle Bill",
    "objective": "Reach the target.",
    "tip": "Plan your turns before driving.",
    "startDir": "N",
    "maxBlocks": 8,
    "recommended": 8,
    "seed": 303,
    "map": [
      ".###",
      "T..#",
      "#.#.",
      "...S"
    ]
  },
  {
    "id": "mission-2-round-1",
    "sol": 2,
    "title": "Barnacle Bill → Yogi Observation Point — Round 1",
    "targetName": "Yogi Observation Point",
    "objective": "Reach the target.",
    "tip": "Look ahead for dead ends and holes.",
    "startDir": "E",
    "maxBlocks": 10,
    "recommended": 8,
    "seed": 304,
    "map": [
      "HH.#T",
      ".....",
      ".##.#",
      "#.#.#",
      "...S."
    ]
  },
  {
    "id": "mission-2-round-2",
    "sol": 2,
    "title": "Barnacle Bill → Yogi Observation Point — Round 2",
    "targetName": "Yogi Observation Point",
    "objective": "Reach the target.",
    "tip": "Look ahead for dead ends and holes.",
    "startDir": "E",
    "maxBlocks": 11,
    "recommended": 9,
    "seed": 305,
    "map": [
      ".T...",
      "H.#.H",
      "#..##",
      ".H.H#",
      ".S..."
    ]
  },
  {
    "id": "mission-2-round-3",
    "sol": 2,
    "title": "Barnacle Bill → Yogi Observation Point — Round 3",
    "targetName": "Yogi Observation Point",
    "objective": "Reach the target.",
    "tip": "Look ahead for dead ends and holes.",
    "startDir": "W",
    "maxBlocks": 10,
    "recommended": 10,
    "seed": 306,
    "map": [
      "##.#.",
      ".....",
      "#.H#T",
      "#.H.H",
      ".S..."
    ]
  },
  {
    "id": "mission-3-round-1",
    "sol": 3,
    "title": "Yogi Observation Point → Yogi — Round 1",
    "targetName": "Yogi inspection position",
    "objective": "Reach the target and face Yogi.",
    "tip": "Reach the target and face Yogi.",
    "startDir": "W",
    "maxBlocks": 11,
    "recommended": 9,
    "seed": 307,
    "map": [
      "#..#.",
      "..HY.",
      "#..T.",
      "#..#.",
      "H.HS."
    ],
    "faceDir": "N",
    "featureName": "Yogi"
  },
  {
    "id": "mission-3-round-2",
    "sol": 3,
    "title": "Yogi Observation Point → Yogi — Round 2",
    "targetName": "Yogi inspection position",
    "objective": "Reach the target and face Yogi.",
    "tip": "Reach the target and face Yogi.",
    "startDir": "E",
    "maxBlocks": 10,
    "recommended": 10,
    "seed": 308,
    "map": [
      "...H.",
      "#H.Y.",
      ".#.T.",
      "...#.",
      "SH..#"
    ],
    "faceDir": "N",
    "featureName": "Yogi"
  },
  {
    "id": "mission-3-round-3",
    "sol": 3,
    "title": "Yogi Observation Point → Yogi — Round 3",
    "targetName": "Yogi inspection position",
    "objective": "Reach the target and face Yogi.",
    "tip": "Reach the target and face Yogi.",
    "startDir": "W",
    "maxBlocks": 11,
    "recommended": 11,
    "seed": 309,
    "map": [
      "##.Y.",
      "##.T.",
      ".H.#.",
      "....H",
      "SH.HH"
    ],
    "faceDir": "N",
    "featureName": "Yogi"
  },
  {
    "id": "mission-4-round-1",
    "sol": 4,
    "title": "Yogi → Other side of Yogi — Round 1",
    "targetName": "Other side of Yogi",
    "objective": "Reach the target and face Yogi.",
    "tip": "Find a safe way around Yogi.",
    "startDir": "N",
    "maxBlocks": 12,
    "recommended": 10,
    "seed": 310,
    "map": [
      "H.H.H",
      ".T...",
      "#Y#..",
      ".S...",
      ".#.H."
    ],
    "faceDir": "S",
    "featureName": "Yogi"
  },
  {
    "id": "mission-4-round-2",
    "sol": 4,
    "title": "Yogi → Other side of Yogi — Round 2",
    "targetName": "Other side of Yogi",
    "objective": "Reach the target and face Yogi.",
    "tip": "Find a safe way around Yogi.",
    "startDir": "E",
    "maxBlocks": 11,
    "recommended": 11,
    "seed": 311,
    "map": [
      ".H.H#",
      ".....",
      ".#TH.",
      "#.Y..",
      "..S.."
    ],
    "faceDir": "S",
    "featureName": "Yogi"
  },
  {
    "id": "mission-4-round-3",
    "sol": 4,
    "title": "Yogi → Other side of Yogi — Round 3",
    "targetName": "Other side of Yogi",
    "objective": "Reach the target and face Yogi.",
    "tip": "Find a safe way around Yogi.",
    "startDir": "N",
    "maxBlocks": 12,
    "recommended": 12,
    "seed": 312,
    "map": [
      ".#.#.",
      "....#",
      "#T#..",
      ".YH.#",
      ".S..."
    ],
    "faceDir": "S",
    "featureName": "Yogi"
  }
];

const DIRECTIONS: Direction[] = ['N', 'E', 'S', 'W'];
const DELTAS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function shortestRoute(level: RoverLevel): RoverCommand[] | null {
  const key = (s: RoverPosition) => `${s.r},${s.c},${s.d}`;
  const startKey = key(level.start);
  const seen = new Set([startKey]);
  const queue: Array<{ state: RoverPosition; route: RoverCommand[] }> = [
    { state: level.start, route: [] },
  ];
  for (let head = 0; head < queue.length; head++) {
    const { state, route } = queue[head];
    if (state.r === level.target.r && state.c === level.target.c &&
        (level.face < 0 || state.d === level.face)) return route;
    for (const cmd of ['F', 'L', 'R'] as const) {
      const next = { ...state };
      if (cmd === 'F') {
        next.r += DELTAS[next.d][0];
        next.c += DELTAS[next.d][1];
        if (next.r < 0 || next.c < 0 || next.r >= level.rows || next.c >= level.cols ||
            level.rocks.has(`${next.r},${next.c}`) || level.holes.has(`${next.r},${next.c}`)) continue;
      } else next.d = (next.d + (cmd === 'R' ? 1 : 3)) % 4;
      const nextKey = key(next);
      if (!seen.has(nextKey)) {
        seen.add(nextKey);
        queue.push({ state: next, route: [...route, cmd] });
      }
    }
  }
  return null;
}

function parseMission(raw: MissionDefinition, idx: number): RoverLevel {
  const rows = raw.map.length;
  const cols = raw.map[0]?.length ?? 0;
  if (!rows || !cols || raw.map.some(row => row.length !== cols)) {
    throw new Error(`Mission ${raw.id}: map must be a nonempty rectangle`);
  }
  const rocks = new Map<string, string>();
  const holes = new Set<string>();
  let start: RoverPosition | undefined;
  let target: { r: number; c: number } | undefined;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const tile = raw.map[r][c];
    if (tile === 'S') {
      if (start) throw new Error(`Mission ${raw.id}: multiple starts`);
      start = { r, c, d: DIRECTIONS.indexOf(raw.startDir) };
    } else if (tile === 'T') {
      if (target) throw new Error(`Mission ${raw.id}: multiple targets`);
      target = { r, c };
    } else if (tile === '#' || tile === 'Y') rocks.set(`${r},${c}`, tile);
    else if (tile === 'H') holes.add(`${r},${c}`);
    else if (tile !== '.') throw new Error(`Mission ${raw.id}: unknown tile ${tile}`);
  }
  if (!start || !target || start.d < 0) throw new Error(`Mission ${raw.id}: missing start, target or valid direction`);
  const face = raw.faceDir ? DIRECTIONS.indexOf(raw.faceDir) : -1;
  if (raw.faceDir && face < 0) throw new Error(`Mission ${raw.id}: invalid face direction`);
  const level: RoverLevel = {
    ...raw, idx, rows, cols, start, target, rocks, holes, face,
    optimal: 0, solution: [],
  };
  const solution = shortestRoute(level);
  if (!solution) throw new Error(`Mission ${raw.id}: unreachable target`);
  if (solution.length > raw.maxBlocks) {
    throw new Error(`Mission ${raw.id}: shortest route (${solution.length}) exceeds maxBlocks (${raw.maxBlocks})`);
  }
  level.optimal = solution.length;
  level.recommended = Math.max(level.optimal, Math.min(raw.recommended, raw.maxBlocks));
  level.solution = solution;
  return level;
}

/** Directly usable by the existing rover engine (LEVELS[i], start, target, rocks, holes, face, optimal). */
export const LEVELS: RoverLevel[] = MISSION_DATA.map(parseMission);
export const levelProblems: string[] = [];
