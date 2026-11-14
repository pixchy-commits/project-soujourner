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
    id: 'binacle-bill', sol: 1, title: 'Go to Binacle Bill',
    targetName: 'Binacle Bill', objective: 'Navigate to Binacle Bill.',
    tip: 'Forward moves in the direction the rover faces. Turns change direction without moving.',
    startDir: 'N', maxBlocks: 10, recommended: 9, seed: 11,
    map: [
      '.....',
      '...T.',
      '.#...',
      '.....',
      'S....',
    ],
  },
  {
    id: 'yogi-observation', sol: 2, title: 'Binacle Bill → Yogi Observation Point',
    targetName: 'Yogi Observation Point',
    objective: 'Drive from Binacle Bill to the Yogi observation point.',
    tip: 'Rocks block movement. Plan your turns to travel around them.',
    startDir: 'E', maxBlocks: 17, recommended: 15, seed: 23,
    map: [
      '......',
      '..##T.',
      '..#...',
      '......',
      '.##...',
      'S.....',
    ],
  },
  {
    id: 'yogi-inspection', sol: 3, title: 'Yogi Observation Point → Yogi',
    targetName: 'Yogi Inspection Position', featureName: 'Yogi',
    objective: 'Reach the inspection position and face Yogi to investigate the problem.',
    tip: 'Arriving is not enough: finish facing north toward Yogi.',
    startDir: 'E', faceDir: 'N', maxBlocks: 23, recommended: 21, seed: 37,
    map: [
      '...Y...',
      '...T...',
      '.###...',
      '...#...',
      '.#...#.',
      '...#...',
      'S......',
    ],
  },
  {
    id: 'rescue-rock-crossing', sol: 4, title: 'Rescued Position → Other Side of Rock',
    targetName: 'Other Side of Rock',
    objective: 'Navigate around the rock formation to reach the opposite side.',
    tip: 'A direct path is blocked. Look for a safe passage around the formation.',
    startDir: 'N', maxBlocks: 30, recommended: 27, seed: 53,
    map: [
      '...#....',
      '...#..T.',
      '.#####..',
      '.#......',
      '.#.####.',
      '.#......',
      '.#####..',
      'S.......',
    ],
  },
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
