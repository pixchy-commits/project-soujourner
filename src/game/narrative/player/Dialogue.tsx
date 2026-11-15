"use client";
import { useEffect, useRef, useState } from "react";
import type { DialogueLine } from "../types";
import styles from "./Dialogue.module.css";
import { InteractionHint } from "../../ui/InteractionHint";

const voices: Record<string, { name: string; portrait: string; tone: string }> = {
 SOJOURNER: { name: "Sojo", portrait: "/art/portraits/sojo-original-front.svg", tone: "sojo" },
 PATHFINDER: { name: "Pathfinder", portrait: "/art/portraits/pathfinder-placeholder.svg", tone: "pathfinder" },
 "MISSION CONTROL": { name: "Mission Control", portrait: "/art/portraits/control-placeholder.svg", tone: "control" },
};

type Props = { line: DialogueLine; instant: boolean; paused: boolean; onNext: () => void; onType: (character: boolean) => void; className?: string; hideSpeaker?: boolean };
export function Dialogue({ line, instant, paused, onNext, onType, className = "", hideSpeaker = false }: Props) {
 const [revealed, setRevealed] = useState(0);
 const cursor = useRef(0);
 const voice = voices[line.speaker];
 const finished = instant || revealed >= line.text.length;
 useEffect(() => {
  if (instant || paused) return;
  let timer: number;
  const tick = () => {
   cursor.current = Math.min(cursor.current + 1, line.text.length);
   setRevealed(cursor.current);
   const character = line.text[cursor.current - 1] ?? "";
   if (cursor.current < line.text.length) timer = window.setTimeout(tick, /[.!?]/.test(character) ? 190 : /[,;:—]/.test(character) ? 85 : 24);
  };
  timer = window.setTimeout(tick, 24);
  return () => window.clearTimeout(timer);
 }, [line.text, instant, paused]);
 useEffect(() => {
  if (!instant && !paused && revealed > 0 && revealed < line.text.length && /\S/.test(line.text.slice(Math.max(0, revealed - 2), revealed))) onType(line.speaker === "SOJOURNER" || line.speaker === "PATHFINDER");
 }, [revealed, line, instant, paused, onType]);
 function advance() {
  if (finished) onNext();
  else { cursor.current = line.text.length; setRevealed(line.text.length); }
 }
 return <button className={`dialogue-box ${styles.box} ${className}`} data-speaker={line.speaker} data-kind={voice ? "dialogue" : "narrative"} data-tone={voice?.tone ?? "narrator"} disabled={paused} onClick={advance} aria-label={`${voice?.name ?? "Narrator"}: ${line.text}. ${finished ? "Continue" : "Show complete text"}`}>
  {voice && <span className={styles.portrait} aria-hidden="true"><img src={voice.portrait} alt="" width="160" height="160" /></span>}
  {!hideSpeaker && <span className={styles.name}>{voice?.name ?? "Narrator"}</span>}
  <span className={styles.measure} aria-hidden="true">{line.text}</span>
  <span className="dialogue-text" aria-hidden="true">{instant ? line.text : line.text.slice(0, revealed)}<span className={finished ? "type-caret hidden" : "type-caret"}>▍</span></span>
  <span className="dialogue-prompt"><InteractionHint intent={finished ? "continue" : "reveal"} /></span>
 </button>;
}
