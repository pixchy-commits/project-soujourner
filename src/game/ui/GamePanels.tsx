"use client";
import { useEffect, useRef } from "react";
import { useGameStore } from "../state/game-store";
import type { useNarration } from "../audio/use-narration";
export type Panel = "settings" | "reports" | null;
const missionReports = [
 { id: "companion", title: "A trusted companion", fact: "Sojourner communicated with Earth through its companion, the Mars Pathfinder lander." },
 { id: "landing", title: "An extraordinary landing", fact: "Pathfinder used a parachute, retrorockets, and airbags to reach the Martian surface." },
 { id: "rover", title: "A little explorer", fact: "At about 10.6 kilograms, Sojourner was roughly the size of a microwave oven." },
];
export default function GamePanels({ panel, onClose, muted, onToggleMusic: toggleAudio, narration }: {
 panel: Panel; onClose: () => void; muted: boolean; onToggleMusic: () => void; narration: ReturnType<typeof useNarration>;
}) {
 const data = useGameStore();
 const dialog = useRef<HTMLDialogElement>(null);
 useEffect(() => { if (panel && !dialog.current?.open) dialog.current?.showModal(); else if (!panel) dialog.current?.close(); }, [panel]);
 return (
    <dialog ref={dialog} className={`game-dialog ${panel === "reports" ? "report-folder" : ""}`} onCancel={() => onClose()} onClose={() => onClose()} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="panel-title">
      <button className="close-button" onClick={() => onClose()} aria-label="Close menu">×</button>
      <span className="panel-ornament" aria-hidden="true">— ✦ —</span><h2 id="panel-title">{panel === "settings" ? "SETTINGS" : "MISSION REPORTS"}</h2>
      {panel === "settings" ? <div className="settings"><label htmlFor="volume">Music volume<span>{Math.round(data.volume * 100)}%</span></label><input id="volume" type="range" min="0" max="1" step="0.05" value={data.volume} onChange={(event) => data.setVolume(Number(event.target.value))} /><label className="effects-volume" htmlFor="effects-volume">Sound effects<span>{Math.round(data.soundVolume * 100)}%</span></label><input id="effects-volume" type="range" min="0" max="1" step="0.05" value={data.soundVolume} onChange={(event) => data.setSoundVolume(Number(event.target.value))} /><button className="setting-row" onClick={toggleAudio}>Music<span>{muted ? "OFF" : "ON"}</span></button><button className="setting-row" disabled={!narration.supported} onClick={() => {
        const enabled = !data.narrationEnabled;
        data.setNarrationEnabled(enabled);
        if (enabled) narration.speak("A little rover. An extraordinary journey."); else narration.stop();
      }}>Free voice narration<span>{!narration.supported ? "UNAVAILABLE" : data.narrationEnabled ? "ON" : "OFF"}</span></button>
      {data.narrationEnabled && <div className="narration-settings"><label htmlFor="narration-voice">Voice</label><select id="narration-voice" value={data.narrationVoice} onChange={(event) => data.setNarrationVoice(event.target.value)}><option value="">Automatic English voice</option>{narration.voices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>)}</select><label htmlFor="narration-volume">Voice volume</label><input id="narration-volume" type="range" min="0" max="1" step="0.05" value={data.narrationVolume} onChange={(event) => data.setNarrationVolume(Number(event.target.value))} /><p>Free device voices. Available voices vary by browser.</p></div>}
      <label className="setting-row" htmlFor="motion">Reduced motion<input id="motion" type="checkbox" checked={data.reducedMotion} onChange={(event) => data.setReducedMotion(event.target.checked)} /></label></div> : <div className="reports">{missionReports.map((chapter, index) => <article key={chapter.id}><span className="report-number">0{index + 1}</span><div><h3>{chapter.title}</h3><p>{chapter.fact}</p></div></article>)}<p className="report-note">The mission was real. Character dialogue is fictional.</p><a href="https://science.nasa.gov/mission/mars-pathfinder/" target="_blank" rel="noreferrer">NASA MISSION ARCHIVE ↗</a></div>}
      <button className="painted-button panel-back" onClick={() => onClose()}><span>BACK</span></button>
    </dialog>
 );
}
