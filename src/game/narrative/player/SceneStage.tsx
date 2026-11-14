"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { NarrativeScene, SceneShot } from "../types";
import { Artwork, type ArtOverrides } from "./Artwork";
import { Dialogue } from "./Dialogue";
import styles from "./SceneStage.module.css";

type Props = {
 scene: NarrativeScene; shot: SceneShot; paused: boolean; instant: boolean; artOverrides?: ArtOverrides;
 onNext: () => void; onBack: () => void; onHome: () => void; onType: (character: boolean) => void;
};
function PictureDissolve({ visualKey, children, instant }: { visualKey: string; children: ReactNode; instant: boolean }) {
 const [frames, setFrames] = useState<{ key: string; current: ReactNode; previous: ReactNode | null }>({ key: visualKey, current: children, previous: null });
 if (frames.key !== visualKey) setFrames({ key: visualKey, current: children, previous: instant ? null : frames.current });
 useEffect(() => {
  const timer = window.setTimeout(() => setFrames((state) => state.previous ? { ...state, previous: null } : state), 650);
  return () => window.clearTimeout(timer);
 }, [visualKey]);
 return <>{frames.previous && <div className={styles.screenLayer} aria-hidden="true">{frames.previous}</div>}<div key={visualKey} className={`${styles.screenLayer} ${!instant && frames.previous ? styles.screenDissolve : ""}`}>{children}</div></>;
}

export default function SceneStage({ scene, shot, paused, instant, artOverrides, onNext, onBack, onHome, onType }: Props) {
 const art = (id: SceneShot["art"], className?: string) => <Artwork id={id} key={id} overrides={artOverrides} className={className} />;
 const motion = !instant ? styles[shot.motion ?? "still"] : "";
 return <section className={`cinematic-stage ${styles.stage} ${!shot.dialogue ? styles.silent : ""} ${paused ? styles.paused : ""}`} aria-label={`${scene.title}: ${shot.id}`}>
  <div className="letterbox top" aria-hidden="true" /><div className="letterbox bottom" aria-hidden="true" />
  {shot.kind === "archive" ? <div className="archive-stage scene-enter"><div className="tv-aerial" aria-hidden="true"><i /><i /></div><div className="monitor-housing" data-archive-monitor>
   <span className="monitor-screw screw-a" /><span className="monitor-screw screw-b" />
   <div className="monitor-screen" data-archive-screen><div className="monitor-topline"><span className="record-light" />{shot.label}<span>REC</span></div>
    <div className={styles.screenPicture} data-archive-picture><PictureDissolve visualKey={`${shot.art}/${shot.montage?.join(",") ?? "single"}/${JSON.stringify(artOverrides ?? {})}`} instant={instant}>{shot.montage ? <div className={`archive-montage ${styles.archiveGrid}`}>{shot.montage.map((id, index) => <div key={id} className={`archive-frame ${index === 0 ? styles.montageLead : ""}`}>{art(id)}</div>)}</div> : art(shot.art)}</PictureDissolve></div><div className="crt-shutdown-line" aria-hidden="true" />
    <span className="monitor-location">{shot.date}</span><div className="scanlines" aria-hidden="true" />
   </div><div className="monitor-base"><div className="tv-speaker"><span /><span /><span /><span /><span /></div><span className="tv-brand">MISSION ARCHIVE</span><div className="tv-knobs" aria-hidden="true"><i /><i /></div><span className="tv-power" aria-hidden="true" /></div>
  </div>{shot.caption && <p className="rewind-caption">{shot.caption}</p>}</div>
  : shot.kind === "chapter" ? <div className="chapter-card scene-enter"><div className="chapter-photo">{art(shot.art)}</div><p className="chapter-date">{shot.date}</p><div className="chapter-rule" /><h1><span>CHAPTER {shot.number}</span>{shot.title}</h1></div>
  : <div data-illustration className={`${styles.illustration} ${styles[shot.framing ?? "wide"]} scene-enter`}>
    <PictureDissolve visualKey={`${shot.art}/${JSON.stringify(artOverrides ?? {})}`} instant={instant}><div className={`${styles.shotArt} ${motion}`}>{art(shot.art)}</div></PictureDissolve><div className={styles.shade} />
    {shot.caption && <p className={styles.caption}>{shot.caption}</p>}
    {shot.confetti && !instant && <div className={styles.confetti} aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{left:`${(i * 37) % 100}%`,animationDelay:`${(i % 7) * -.4}s`,background:i%2 ? "#d4a66b" : "#e1d5b4"}} />)}</div>}
   </div>}
  {shot.dialogue ? <Dialogue key={`${scene.id}/${shot.id}`} line={shot.dialogue} instant={instant} paused={paused} onNext={onNext} onType={onType} />
   : <button data-scene-advance className={`game-button ${styles.silentContinue}`} disabled={paused} onClick={onNext}>CONTINUE <span aria-hidden="true">◆</span></button>}
  <div className="cutscene-controls"><button className="game-button game-button-small" disabled={paused} onClick={onBack}>‹ BACK</button><button className="game-button game-button-small" disabled={paused} onClick={onHome}>RETURN TO TITLE</button></div>
 </section>;
}
