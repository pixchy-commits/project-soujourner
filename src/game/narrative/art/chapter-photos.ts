import type { ArtId } from "../types";

export const chapterPhotos: Readonly<Record<number, ArtId>> = {
  1: "chapter-photo-1",
  2: "chapter-photo-2",
  3: "chapter-photo-3",
  4: "chapter-photo-4",
};

export const openingMontage = ["chapter-photo-1", "chapter-photo-2", "chapter-photo-3", "chapter-photo-4"] as const satisfies readonly ArtId[];
