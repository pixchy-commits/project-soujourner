function MusicIcon({ muted }: { muted: boolean }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M12 23V8l14-3v15M12 12l14-3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><ellipse cx="8" cy="24" rx="4" ry="3" fill="currentColor"/><ellipse cx="22" cy="21" rx="4" ry="3" fill="currentColor"/>{muted && <path d="M5 4l23 24" stroke="currentColor" strokeWidth="2.5"/>}</svg>;
}

export default function MusicButton({ muted, onClick }: { muted: boolean; onClick: () => void }) {
 return <button className="music-button" onClick={onClick} aria-label={muted ? "Enable music" : "Mute music"} aria-pressed={!muted}><MusicIcon muted={muted} /></button>;
}
