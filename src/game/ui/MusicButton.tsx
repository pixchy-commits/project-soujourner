import { useState } from "react";

function MusicIcon({ muted }: { muted: boolean }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M12 23V8l14-3v15M12 12l14-3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><ellipse cx="8" cy="24" rx="4" ry="3" fill="currentColor"/><ellipse cx="22" cy="21" rx="4" ry="3" fill="currentColor"/>{muted && <path d="M5 4l23 24" stroke="currentColor" strokeWidth="2.5"/>}</svg>;
}

export default function MusicButton({ muted, onClick, showHint = false }: { muted: boolean; onClick: () => void; showHint?: boolean }) {
 const [dismissed, setDismissed] = useState(false);
 const toggle = () => { setDismissed(true); onClick(); };
 return <>
  <button className="music-button" onClick={toggle} aria-label={muted ? "Enable music" : "Mute music"} aria-pressed={!muted}><MusicIcon muted={muted} /></button>
  {showHint && muted && !dismissed && <aside className="music-invitation" aria-label="Music tip">
   <button className="music-invitation-enable" onClick={toggle}>Turn on the music<span>Our journey sounds better with it</span></button>
   <button className="music-invitation-close" onClick={() => setDismissed(true)} aria-label="Dismiss music tip">×</button>
  </aside>}
 </>;
}
