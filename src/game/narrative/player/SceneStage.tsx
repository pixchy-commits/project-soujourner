"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { NarrativeScene, SceneShot } from "../types";
import { Artwork, type ArtOverrides } from "./Artwork";
import { Dialogue } from "./Dialogue";
import { ArchiveMontage } from "./ArchiveMontage";
import { ChapterTelevision } from "./ChapterTelevision";
import { chapterPhotos } from "../art/chapter-photos";
import styles from "./SceneStage.module.css";
import manifest from "../art/manifest.json";
import { LegacyTelevision } from "../../ui/LegacyTelevision";
import { InteractionHint } from "../../ui/InteractionHint";

type Props = {
 scene: NarrativeScene; shot: SceneShot; paused: boolean; instant: boolean; artOverrides?: ArtOverrides;
 onNext: () => void; onBack: () => void; onHome: () => void; onType: (character: boolean) => void;
 onMontageSound?: (cue: "montage-in" | "montage-shuffle") => void;
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

export default function SceneStage({ scene, shot, paused, instant, artOverrides, onNext, onBack, onHome, onType, onMontageSound }: Props) {
 const art = (id: SceneShot["art"], className?: string) => <Artwork id={id} key={id} overrides={artOverrides} className={className} />;
 const motion = !instant ? styles[shot.motion ?? "still"] : "";
 const waitingForArt = Boolean(shot.placeholder && !artOverrides?.[shot.art] && !manifest[shot.art].src);
 const advanceCue = <button data-scene-advance className="story-advance" disabled={paused} onClick={onNext}><InteractionHint /></button>;
 if (scene.id === "legacy-return-to-tv") return <LegacyTelevision key={shot.id} mode="archive" archiveArt={shot.art} paused={paused} instant={instant} onNext={onNext} onBack={onBack} onHome={onHome} />;
 return <section className={`cinematic-stage ${styles.stage} ${!shot.dialogue ? styles.silent : ""} ${paused ? styles.paused : ""}`} aria-label={`${scene.title}: ${shot.id}`} onClick={event => {
  if (!shot.dialogue && !paused && !(event.target as Element).closest("button, a, input, select, textarea")) onNext();
 }}>
  <div className="letterbox top" aria-hidden="true" /><div className="letterbox bottom" aria-hidden="true" />
  {shot.kind === "archive" ? <div className="archive-stage scene-enter"><div className="tv-aerial" aria-hidden="true"><i /><i /></div><div className="monitor-housing" data-archive-monitor>
   <span className="monitor-screw screw-a" /><span className="monitor-screw screw-b" />
   <div className="monitor-screen" data-archive-screen><div className="monitor-topline"><span className="record-light" />{shot.label}<span>REC</span></div>
    <div className={styles.screenPicture} data-archive-picture><PictureDissolve visualKey={`${shot.art}/${shot.montage?.join(",") ?? "single"}/${JSON.stringify(artOverrides ?? {})}`} instant={instant}>{shot.montage ? <ArchiveMontage onSound={onMontageSound} images={shot.montage} instant={instant} paused={paused} overrides={artOverrides} /> : art(shot.art)}</PictureDissolve></div><div className="crt-shutdown-line" aria-hidden="true" />
    <span className="monitor-location">{shot.date}</span><div className="scanlines" aria-hidden="true" />
   </div><div className="monitor-base"><div className="tv-speaker"><span /><span /><span /><span /><span /></div><span className="tv-brand">MISSION ARCHIVE</span><div className="tv-knobs" aria-hidden="true"><i /><i /></div><span className="tv-power" aria-hidden="true" /></div>
  </div>{shot.caption && <p className="rewind-caption">{shot.caption}</p>}</div>
  : shot.kind === "chapter" ? <div className="chapter-card scene-enter"><ChapterTelevision>{art(chapterPhotos[shot.number] ?? shot.art)}</ChapterTelevision><p className="chapter-date">{shot.date}</p><div className="chapter-rule" /><h1><span>CHAPTER {shot.number}</span>{shot.title}</h1><div className={styles.chapterAdvance}>{advanceCue}</div></div>
  : <div data-illustration data-memory-eyes={scene.id === "ch02-earth-flashback" && shot.id === "blink" ? "true" : undefined} className={`${styles.illustration} ${styles[shot.framing ?? "wide"]} scene-enter`}>
    <div className={shot.overlay || shot.screenGallery ? styles.opticalCanvas : styles.shotCanvas}>
     <PictureDissolve visualKey={`${shot.art}/${JSON.stringify(artOverrides ?? {})}`} instant={instant}><div className={`${styles.shotArt} ${motion}`}><Artwork id={shot.art} overrides={artOverrides} fit={shot.overlay ? "cover" : undefined} /></div></PictureDissolve>
     {shot.overlay && <div className={styles.opticalOverlay} style={{ transform: `scale(${shot.overlayScale ?? 1})` }} aria-hidden="true"><Artwork id={shot.overlay} overrides={artOverrides} fit="cover" decorative /></div>}
     {shot.screenGallery?.map((screen,index) => <div key={`${screen.art}/${index}`} className={styles.galleryScreen} style={{left:`${screen.x}%`,top:`${screen.y}%`,width:`${screen.width}%`,height:`${screen.height}%`}}><Artwork id={screen.art} overrides={artOverrides} fit="cover" decorative /></div>)}
     {shot.terrainNotes && <div className={styles.terrainNotes} onClick={event => event.stopPropagation()}>
      <svg className={styles.terrainPointers} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{shot.terrainNotes.map(note => <g key={note.id}><path d={`M ${note.x} ${note.y + 7} L ${note.targetX} ${note.targetY}`} /><ellipse cx={note.targetX} cy={note.targetY} rx=".55" ry=".95" /></g>)}</svg>
      {shot.terrainNotes.map(note => <details key={note.id} open className={styles.terrainNote} style={{ left: `${note.x}%`, top: `${note.y}%` }}><summary tabIndex={paused ? -1 : 0}>{note.title}</summary><p>{note.text}</p></details>)}
     </div>}
    </div><div className={styles.shade} />
    {shot.hotspot && <div className={styles.hotspotSurface}><button
      className={styles.roverHotspot} disabled={paused} onClick={onNext}
      aria-label={shot.hotspot.label}
      style={{ left: `${shot.hotspot.x}%`, top: `${shot.hotspot.y}%`, width: `${shot.hotspot.width}%`, height: `${shot.hotspot.height}%` }}
    ><span>{shot.hotspot.label}</span></button></div>}
    {shot.caption && <p className={styles.caption}>{shot.caption}</p>}
    {waitingForArt && <div className={styles.pendingArt}>
      <span>STORYBOARD PLACEHOLDER · PDF {scene.sourcePages.join(", ")}</span>
      <h1>{scene.title}</h1><h2>{shot.id.replaceAll("-", " ")}</h2>
      <p>{shot.placeholder}</p>
      <small>{shot.dialogue ? "Script available · artwork pending" : "No approved spoken line · this beat is silent"}</small>
      <code>public{manifest[shot.art].expectedPath}</code>
    </div>}
    {shot.missionSheet && <aside className={styles.missionSheet} aria-label={shot.missionSheet.title}>
      <h2>{shot.missionSheet.title}</h2>
      <p>{shot.missionSheet.duration}</p>
      {shot.missionSheet.note && <p>{shot.missionSheet.note}</p>}
      <ul>{shot.missionSheet.items.map(item => <li key={item}>{item}</li>)}</ul>
    </aside>}
    {shot.confetti && !instant && <div className={styles.confetti} aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{left:`${(i * 37) % 100}%`,animationDelay:`${(i % 7) * -.4}s`,background:i%2 ? "#d4a66b" : "#e1d5b4"}} />)}</div>}
   </div>}
  {shot.dialogue ? <Dialogue key={`${scene.id}/${shot.id}`} line={shot.dialogue} instant={instant} paused={paused} onNext={onNext} onType={onType} />
   : shot.kind !== "chapter" ? advanceCue : null}
  <nav className="cutscene-controls" aria-label="Story navigation">
   <button className="game-button game-button-small" disabled={paused} onClick={onBack} aria-label="Previous scene" title="Previous scene"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m13 5-7 7 7 7M6 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="control-label">Back</span></button>
   <button className="game-button game-button-small" disabled={paused} onClick={onHome} aria-label="Return to title screen" title="Return to title screen"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3 11 9-8 9 8M6 9v12h5v-7h3v7h4V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="control-label">Title screen</span></button>
  </nav>
 </section>;
}
