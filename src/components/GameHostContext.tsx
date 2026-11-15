"use client";

import { createContext, useContext } from "react";

/** Present only when a mission is played inside the narrative shell. */
export const GameHostContext = createContext<{ soundVolume: number } | null>(null);
export function useGameHost() {
  return useContext(GameHostContext);
}
