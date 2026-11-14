import { memo } from "react";
import MissionHud from "./MissionHud";
import MapBoard from "./MapBoard";
import CommandPanel from "./CommandPanel";
import Dialogs from "./Dialogs";

function RoverMarkup() {
  return <>
    <section id="game" className="screen" aria-label="Mission">
      <button id="homeBtn" hidden></button><button id="missionsBtn" hidden></button><button id="musicGame" hidden></button><button id="setBtn" hidden></button>
      <main className="play rv-reference-ui">
        <div className="rv-reference-header">
          <button type="button" className="rv-circle rv-home" title="Restart from first mission" onClick={() => document.querySelector<HTMLButtonElement>('.rv #homeBtn')?.click()} aria-label="Home">⌂</button>
          <div className="rv-mission-pill"><MissionHud /><div className="rv-milestone-dots" aria-hidden="true"><i/><i/><i/><i/><i/></div></div>
          <div className="rv-header-actions">
            <button type="button" className="rv-circle rv-music" title="Toggle music" onClick={() => document.querySelector<HTMLButtonElement>('.rv #musicGame')?.click()} aria-label="Toggle music">♫</button>
            <button type="button" className="rv-circle rv-settings" title="Settings" onClick={() => document.querySelector<HTMLButtonElement>('.rv #setBtn')?.click()} aria-label="Settings">☼</button>
          </div>
        </div>
        <div className="rv-map-area"><div className="rv-objective-banner" aria-label="Mission objective"><span className="rv-objective-icon">▣</span><span className="rv-objective-arrow">···›</span><span className="rv-objective-flag">⚑</span><span className="rv-objective-text">Reach the flag!</span></div><MapBoard /><div className="rv-facing-badge"><span className="rv-facing-arrow">➤</span><span>Facing <b id="rvFacingDisplay">up</b></span></div></div>
        <CommandPanel />
      </main>
    </section>
    <Dialogs />
  </>;
}
export default memo(RoverMarkup, () => true);
