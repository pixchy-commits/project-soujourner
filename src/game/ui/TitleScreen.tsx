import type { Panel } from "./GamePanels";
export default function TitleScreen({ ready, hasSave, busy, onStart, onOpenPanel }: {
 ready: boolean; hasSave: boolean; busy: boolean; onStart: (resume: boolean) => void; onOpenPanel: (panel: Panel) => void;
}) { return (
<section className="title-screen" aria-labelledby="game-title">
      <div className="title-lockup scene-enter"><h1 id="game-title">SOJOURNER</h1><p>The Little Rover That Never Came Home</p></div>
      <nav className="game-menu scene-enter" aria-label="Game menu" onKeyDown={(event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        buttons[(current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
      }}>
        <button className="painted-button" disabled={busy} onClick={() => onStart(false)}><span>Begin journey</span></button>
        {ready && (hasSave) && <button className="painted-button" disabled={busy} onClick={() => onStart(true)}><span>Resume journey</span></button>}
        <button className="painted-button" disabled={busy} onClick={() => onOpenPanel("settings")}><span>Settings</span></button>
        <button className="painted-button" disabled={busy} onClick={() => onOpenPanel("reports")}><span>Mission journal</span></button>
      </nav>
    </section>
 );
}
