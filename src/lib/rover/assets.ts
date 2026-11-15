// ART SLOTS. Drop a PNG into public/rover/ and set its path here; null = built-in artwork.
// rover.png must face UP (north). Rock/hole/rover should be transparent top-down PNGs.
// background.png should be a seamless bird's-eye sand texture.
export type RoverAssets = Record<"rock" | "hole" | "rover" | "background", string | null>;

export const ROVER_ASSETS: RoverAssets = {
  rock: null, // e.g. "/rover/rock.png"
  hole: null, // e.g. "/rover/hole.png"
  rover: null, // e.g. "/rover/rover.png"
  background: null, // e.g. "/rover/background.png"
};
