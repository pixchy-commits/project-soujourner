"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Game from "../../Game";
import { firstShot, getStep, story, type Checkpoint } from "../../flow/story";
import { getScene } from "../catalog";
import manifest from "../art/manifest.json";
import type { ArtId } from "../types";
import type { ArtOverrides } from "../player/Artwork";
import styles from "./SceneWorkspace.module.css";

export default function SceneWorkspace() {
 const [selected, setSelected] = useState<string>(story[0].id);
 const [position, setPosition] = useState<Checkpoint>(firstShot(story[0]));
 const [overrides, setOverrides] = useState<ArtOverrides>({});
 const [fileError, setFileError] = useState("");
 const objectUrls = useRef(new Map<ArtId, string>());
 const step = getStep(position.stepId);
 const scene = step.kind === "narrative" ? getScene(step.sceneId) : null;
 const shot = scene?.shots.find((shot) => shot.id === position.shotId) ?? scene?.shots[0];
 const assets: readonly ArtId[] = shot ? (shot.kind === "archive" && shot.montage ? shot.montage : [shot.art]) : [];
 const onPosition = useCallback((checkpoint: Checkpoint) => setPosition(checkpoint), []);
 useEffect(() => {
  const urls = objectUrls.current;
  return () => { urls.forEach((url) => URL.revokeObjectURL(url)); };
 }, []);
 function choose(id: string) { setSelected(id); setPosition(firstShot(getStep(id))); }
 function useImage(id: ArtId, file?: File) {
  if (!file) return;
  if (!file.type.startsWith("image/")) { setFileError("Choose an image file."); return; }
  if (file.size > 25 * 1024 * 1024) { setFileError("Choose an image under 25 MB."); return; }
  setFileError("");
  const previous = objectUrls.current.get(id);
  if (previous) URL.revokeObjectURL(previous);
  const url = URL.createObjectURL(file);
  objectUrls.current.set(id, url);
  setOverrides((current) => ({ ...current, [id]: url }));
 }
 return <div className={styles.workspace}>
  <aside className={styles.inspector}>
   <a className={styles.back} href="/">← Game title</a><h1>Narrative workspace</h1>
   <p className={styles.intro}>Scene-by-scene reference and local artwork preview. Game progress is not changed here.</p>
   <label htmlFor="scene-select">Jump to a scene or handoff</label>
   <select id="scene-select" value={selected.split("#")[0]} onChange={(event) => choose(event.target.value)}>
    {story.map((entry) => <option key={entry.id} value={entry.id}>{entry.kind === "narrative" ? `PDF ${getScene(entry.sceneId).sourcePages.join(", ")} · ${getScene(entry.sceneId).title}` : `PDF ${entry.sourcePage} · ${entry.title} [mechanic]`}</option>)}
   </select>
   <div className={styles.current}><small>NOW SHOWING</small><strong>{scene?.title ?? (step.kind === "activity" ? step.title : "")}</strong><code>{step.id}{shot ? ` / ${shot.id}` : ""}</code></div>
   {(scene?.sourcePages ?? (step.kind === "activity" ? [step.sourcePage] : [])).map((page) => <figure key={page} className={styles.source}>
    <a href={`/storyboards/page-${String(page).padStart(2,"0")}.png`} target="_blank" rel="noreferrer"><Image src={`/storyboards/page-${String(page).padStart(2,"0")}.png`} alt={`Storyboard PDF page ${page}`} width={720} height={405} unoptimized /></a>
    <figcaption>PDF PAGE {page} — click to enlarge</figcaption>
   </figure>)}
   {scene && <><h2>Shot order</h2><ol className={styles.shots}>{scene.shots.map((candidate) => <li key={candidate.id}><button aria-current={shot?.id === candidate.id ? "step" : undefined} onClick={() => {
     const checkpoint = { stepId: step.id, shotId: candidate.id };
     setPosition(checkpoint); setSelected(`${step.id}#${candidate.id}`);
    }}>{candidate.id}{!candidate.dialogue && <small>Silent</small>}</button></li>)}</ol></>}
   {shot && <section className={styles.script}><h2>Dialogue</h2>{shot.dialogue ? <><strong>{shot.dialogue.speaker}</strong><p>{shot.dialogue.text}</p></> : <p>No spoken line. This shot plays silently.</p>}{shot.notes && <p className={styles.note}>{shot.notes}</p>}</section>}
   {assets.map((id) => <section key={id} className={styles.asset}><h2>Artwork slot</h2><code>{id}</code><p>{manifest[id].alt}</p><label>Try a local image<input type="file" accept="image/*" onChange={(event) => useImage(id,event.target.files?.[0])} /></label><small>Local preview only; the file is not uploaded.</small><h3>Permanent file path</h3><code>public{manifest[id].expectedPath}</code><p>Copy the file there, then set this slot’s <code>src</code> in <code>art/manifest.json</code> to the path without <code>public</code>.</p></section>)}
   {fileError && <p role="alert">{fileError}</p>}
  </aside>
  <div className={styles.stage}><Game key={selected} initialCheckpoint={selected.includes("#") ? { stepId: selected.split("#")[0], shotId: selected.split("#")[1] } : firstShot(getStep(selected))} previewMode artOverrides={overrides} onCheckpointChange={onPosition} /></div>
 </div>;
}
