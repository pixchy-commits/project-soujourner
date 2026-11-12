export type CraftPhase =
  "entry" | "chute" | "airbags" | "rockets" | "bounce" | "stable";
export type LandingStage = {
  title: string;
  description: string;
  high: number;
  low: number;
  ideal: number;
  winHigh: number;
  winLow: number;
  rate: number;
  unit: "km" | "m";
  icon: string;
  label: string;
  hint: string;
  holdMs: number;
  craft: CraftPhase;
};
export const LAND_TIME = 4.8;
export const OPEN_LIMIT = 25;
export const RESULT_DELAY = 2000;
export const RING_MAX = 2.1;
export const stages: LandingStage[] = [
  {
    title: "Open the parachute!",
    description: "Wait for 10 km, then HOLD the button.",
    high: 11,
    low: 8,
    ideal: 10,
    winHigh: 10.5,
    winLow: 9.5,
    rate: 0.15,
    unit: "km",
    icon: "🪂",
    label: "HOLD",
    hint: "Hold when the ring turns green",
    holdMs: 500,
    craft: "entry",
  },
  {
    title: "Inflate the airbags!",
    description: "Wait for 350 m, then TAP the button.",
    high: 480,
    low: 200,
    ideal: 350,
    winHigh: 400,
    winLow: 300,
    rate: 20,
    unit: "m",
    icon: "🎈",
    label: "TAP",
    hint: "Tap when the ring turns green",
    holdMs: 0,
    craft: "chute",
  },
  {
    title: "Fire the rockets!",
    description: "Wait for 90 m, then TAP the button.",
    high: 140,
    low: 20,
    ideal: 90,
    winHigh: 110,
    winLow: 70,
    rate: 10,
    unit: "m",
    icon: "🔥",
    label: "TAP",
    hint: "Tap when the ring turns green",
    holdMs: 0,
    craft: "airbags",
  },
  {
    title: "Wait for the bounce!",
    description: "When the lander stops, TAP to open it.",
    high: 8,
    low: 0,
    ideal: 0,
    winHigh: 0,
    winLow: 0,
    rate: 8 / LAND_TIME,
    unit: "m",
    icon: "🛬",
    label: "OPEN",
    hint: "Tap when the ring turns green",
    holdMs: 0,
    craft: "bounce",
  },
];
