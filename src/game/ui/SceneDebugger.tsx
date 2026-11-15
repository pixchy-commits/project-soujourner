"use client";
import { useEffect, useRef, useState } from "react";
import { firstShot, story, type Checkpoint, type StoryStep } from "../flow/story";
import { getScene } from "../narrative/catalog";
import styles from "./SceneDebugger.module.css";

type Props = { open: boolean; busy: boolean; checkpoint: Checkpoint; reviewing: boolean; onToggle: () => void; onJump: (checkpoint: Checkpoint) => void };
export function SceneDebugger({ open, busy, checkpoint, reviewing, onToggle, onJump }: Props) {
 const [query, setQuery] = useState("");
 const input = useRef<HTMLInputElement>(null);
 const toggle = useRef<HTMLButtonElement>(null);
 useEffect(() => { if (open) input.current?.focus(); }, [open]);
 useEffect(() => {
  const key = (event: KeyboardEvent) => {
   if ((event.key === "F2" || (open && event.key === "Escape")) && !busy) { event.preventDefault(); onToggle(); if (open) toggle.current?.focus(); }
  };
  document.addEventListener("keydown", key);
  return () => document.removeEventListener("keydown", key);
 }, [open, busy, onToggle]);
 const filter = query.trim().toLowerCase();
 return <>
  <button ref={toggle} className={styles.toggle} disabled={busy} onClick={onToggle} aria-expanded={open} aria-controls="scene-debugger" aria-label={open ? "Close scene navigator" : "Open scene navigator (F2)"} title="Scene navigator · F2"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="18" r="2" fill="currentColor"/></svg><span>{open ? "Close" : "Scenes · F2"}</span></button>
  {open && <aside id="scene-debugger" className={styles.panel} role="dialog" aria-label="Narrative scene debugger">
   <header><h2>Story navigator</h2><p>Home narrative preview · PDF edition shown per scene</p><p>{reviewing ? "Review mode · story save is protected" : "Jumping starts review mode; it does not replace your story save."}</p></header>
   <label htmlFor="debug-search">Find a scene, shot, handoff, or PDF page</label>
   <input ref={input} id="debug-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="e.g. 50, Yogi, Earth…" />
   <div className={styles.list}>
    {story.map((step: StoryStep,index) => {
     const scene = step.kind === "narrative" ? getScene(step.sceneId) : null;
     const title = scene?.title ?? (step.kind === "activity" ? step.title : "");
     const pages = scene?.sourcePages ?? (step.kind === "activity" ? [step.sourcePage,...(step.references ?? [])] : []);
     const shots = scene?.shots ?? [];
     const haystack = `${step.id} ${title} ${pages.join(" ")} ${shots.map(s => `${s.id} ${s.notes ?? ""} ${s.placeholder ?? ""}`).join(" ")}`.toLowerCase();
     if (filter && !haystack.includes(filter)) return null;
     const current = checkpoint.stepId === step.id;
     return <section key={step.id} className={styles.entry} data-current={current}>
      <button disabled={busy} onClick={() => onJump(firstShot(step))} aria-current={current ? "step" : undefined}><small>{String(index+1).padStart(2,"0")} · PDF {pages.join(", ")} · {step.kind === "activity" ? step.category ?? "gameplay" : scene?.chapter === 5 ? "Legacy" : `Chapter ${scene?.chapter}`}</small><strong>{title}</strong></button>
      {!!shots.length && <div className={styles.shots}>{shots.map(shot => <button key={shot.id} disabled={busy} aria-current={current && checkpoint.shotId === shot.id ? "step" : undefined} onClick={() => onJump({stepId:step.id,shotId:shot.id})}>{shot.id}<span>{shot.placeholder ? "ART PENDING" : !shot.dialogue && shot.kind !== "chapter" ? "SILENT" : ""}</span></button>)}</div>}
      <div className={styles.sources}>{pages.map(page => <a key={page} href={`/storyboards/${scene?.sourceEdition ?? "v7"}/page-${String(page).padStart(2,"0")}.png`} target="_blank" rel="noreferrer">View PDF {scene?.sourceEdition ?? "v7"} · {page} ↗</a>)}</div>
     </section>;
    })}
   </div>
   <footer>References/research-only pages are attached to their relevant scenes; they are not extra spoken scenes.</footer>
  </aside>}
 </>;
}
