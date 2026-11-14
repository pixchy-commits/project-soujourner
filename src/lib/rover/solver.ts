// Pure game rules: no DOM, no React. Safe to unit-test.
export const DIRS = ["N", "E", "S", "W"] as const;
export const DR = [-1, 0, 1, 0];
export const DC = [0, 1, 0, -1];
export type Cmd = "F" | "L" | "R";
export type Pose = { r: number; c: number; d: number };
export type Level = {
  idx: number; sol: number; title: string; targetName: string; featureName?: string;
  objective: string; tip: string; startDir: string; faceDir?: string; maxBlocks: number;
  recommended: number; optimal: number; seed: number; map: string[];
  rows: number; cols: number; rocks: Map<string, string>; holes: Set<string>;
  start: Pose; target: { r: number; c: number }; face: number; solution?: Cmd[];
};

export function blocked(L: Level, r: number, c: number): boolean {
  return r < 0 || c < 0 || r >= L.rows || c >= L.cols || L.rocks.has(r + "," + c) || L.holes.has(r + "," + c);
}
export function atGoal(L: Level, s: Pose): boolean {
  return s.r === L.target.r && s.c === L.target.c && (L.face < 0 || s.d === L.face);
}
export function step(s: Pose, cmd: Cmd): Pose {
  return cmd === "F" ? { r: s.r + DR[s.d], c: s.c + DC[s.d], d: s.d } : { r: s.r, c: s.c, d: (s.d + (cmd === "R" ? 1 : 3)) % 4 };
}
/** Shortest program (breadth-first search over position + heading), or null. */
export function solve(L: Level, from: Pose): Cmd[] | null {
  const k = (s: Pose) => `${s.r},${s.c},${s.d}`;
  const prev = new Map<string, [string, Cmd] | null>([[k(from), null]]);
  const q: Pose[] = [from];
  while (q.length) {
    const s = q.shift() as Pose;
    if (atGoal(L, s)) {
      const path: Cmd[] = [];
      let kk = k(s);
      for (let p = prev.get(kk); p; p = prev.get(kk)) { path.unshift(p[1]); kk = p[0]; }
      return path;
    }
    for (const cmd of ["F", "L", "R"] as const) {
      const n = step(s, cmd);
      if (cmd === "F" && blocked(L, n.r, n.c)) continue;
      if (!prev.has(k(n))) { prev.set(k(n), [k(s), cmd]); q.push(n); }
    }
  }
  return null;
}
