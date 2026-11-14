"use client";
import { useEffect, useRef, useState } from "react";
import type { DialogueLine } from "../types";

type Props = { line: DialogueLine; instant: boolean; paused: boolean; onNext: () => void; onType: (character: boolean) => void; className?: string; hideSpeaker?: boolean };
export function Dialogue({ line, instant, paused, onNext, onType, className = "", hideSpeaker = false }: Props) {
 const [revealed, setRevealed] = useState(0);
 const cursor = useRef(0);
 const finished = instant || revealed >= line.text.length;
 useEffect(() => {
  if (instant || paused) return;
  const timer = window.setInterval(() => {
   cursor.current = Math.min(cursor.current + 2, line.text.length);
   setRevealed(cursor.current);
   if (cursor.current >= line.text.length) window.clearInterval(timer);
  }, 32);
  return () => window.clearInterval(timer);
 }, [line.text, instant, paused]);
 useEffect(() => {
  if (!instant && !paused && revealed > 0 && revealed < line.text.length && /\S/.test(line.text.slice(Math.max(0, revealed - 2), revealed))) onType(line.speaker === "SOJOURNER" || line.speaker === "PATHFINDER");
 }, [revealed, line, instant, paused, onType]);
 function advance() {
  if (finished) onNext();
  else { cursor.current = line.text.length; setRevealed(line.text.length); }
 }
 return <button className={`dialogue-box ${className}`} disabled={paused} onClick={advance} aria-label={finished ? "Continue cutscene" : "Show complete dialogue"}>
  {!hideSpeaker && <span className="speaker">{className && line.speaker === "SOJOURNER" ? "Sojourner" : className && line.speaker === "PATHFINDER" ? "Pathfinder" : line.speaker}</span>}
  <span className="dialogue-text" aria-hidden="true">{instant ? line.text : line.text.slice(0, revealed)}<span className={finished ? "type-caret hidden" : "type-caret"}>▍</span></span>
  <span className="sr-only">{line.text}</span>
  <span className="dialogue-prompt">{finished ? "CONTINUE" : "REVEAL TEXT"}<span className={finished ? "advance-diamond" : ""}>◆</span></span>
 </button>;
}
