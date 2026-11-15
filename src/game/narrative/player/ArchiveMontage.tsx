"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Artwork, type ArtOverrides } from "./Artwork";
import type { ArtId } from "../types";
import styles from "./SceneStage.module.css";

export function ArchiveMontage({ images, instant, paused, overrides, onSound }: { images: readonly ArtId[]; instant: boolean; paused: boolean; overrides?: ArtOverrides; onSound?: (cue: "montage-in" | "montage-shuffle") => void }) {
  const container = useRef<HTMLDivElement>(null);
  const playback = useRef<gsap.core.Timeline | null>(null);
  const sound = useRef(onSound);
  sound.current = onSound;
  const pausedAtStart = useRef(paused);
  pausedAtStart.current = paused;
  const sequenceKey = images.join("/");

  useEffect(() => {
    const context = gsap.context(() => {
      const frames = container.current?.querySelectorAll<HTMLElement>("[data-montage-photo]");
      if (!frames?.length || !container.current) return;
      if (instant) { gsap.set(frames, { opacity: 1, x: 0, y: 0, rotation: 0 }); return; }
      const width = container.current.clientWidth;
      const height = container.current.clientHeight;
      const timeline = gsap.timeline({ paused: pausedAtStart.current });
      playback.current = timeline;
      frames.forEach((frame, index) => {
        gsap.set(frame, { opacity: 0, x: (width - frame.offsetWidth) / 2 - frame.offsetLeft + index * 10, y: (height - frame.offsetHeight) / 2 - frame.offsetTop + index * 5, rotation: [-4, 3, -2, 2][index % 4], scale: 1.06, zIndex: index + 1 });
        timeline.to(frame, { opacity: 1, duration: .65, ease: "power2.out" }, index * 1.1);
        timeline.call(() => { sound.current?.("montage-in"); }, [], index * 1.1);
      });
      timeline.to(frames, { x: 0, y: 0, scale: 1, rotation: 0, duration: .9, stagger: .08, ease: "power2.inOut" }, images.length * 1.1);
      timeline.call(() => { sound.current?.("montage-shuffle"); }, [], images.length * 1.1);
    }, container);
    return () => { playback.current = null; context.revert(); };
  }, [sequenceKey, instant, images.length]);

  useEffect(() => { if (paused) playback.current?.pause(); else playback.current?.resume(); }, [paused]);

  return <div ref={container} className={styles.photoMontage} aria-label="Archival photos from Chapters 1 to 4">
    {images.map((id, index) => <div key={id} data-montage-photo className={styles.montagePhoto} style={{ left: index % 2 ? "52%" : "4%", top: index < 2 ? "5%" : "52%", opacity: instant ? 1 : 0 }}><Artwork id={id} overrides={overrides} /></div>)}
  </div>;
}
