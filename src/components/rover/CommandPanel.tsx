import { memo } from "react";
function CommandPanel() {
  return <aside id="prog" className="panel" aria-label="Programming panel">
    <div className="rv-control-top"><span className="rv-handle" aria-hidden="true"/><div className="rv-top-buttons"><button type="button" className="rv-help-round" title="Show hint" onClick={() => document.querySelector<HTMLButtonElement>('.rv #hintBtn')?.click()}>♧</button><button type="button" className="rv-next-round" title="More mission guidance" onClick={() => document.querySelector<HTMLButtonElement>('.rv #hintBtn')?.click()}>›</button></div></div>
    {/* Engine-required elements are kept hidden to preserve the screenshot layout. */}
    <button type="button" id="hintBtn" hidden aria-hidden="true">Hint</button>
    <div id="hintDots" hidden><i/><i/><i/></div>
    <div id="feedback" className="feedback info" hidden role="status" aria-live="polite"><span className="fi">i</span><span id="fbText"/></div>
    <div className="palette" id="palette">
      <button className="cmd L" data-cmd="L" draggable="true" title="Rotate Left (←)"><span className="ic"></span>Left</button>
      <button className="cmd F" data-cmd="F" draggable="true" title="Move Forward (↑)"><span className="ic"></span>Forward</button>
      <button className="cmd R" data-cmd="R" draggable="true" title="Rotate Right (→)"><span className="ic"></span>Right</button>
    </div>
    <div className="counter" id="counter"><span className="label">My program</span><div className="bar"><i id="barFill"></i></div><b id="countTxt">0 / 6</b></div>
    <div className="seq" id="seq" aria-label="Program sequence"></div>
    <div className="rv-control-spacer"/>
    <div className="runRow"><button className="ci-btn primary" id="runBtn">▶ Run</button><button className="ci-btn small" id="resetBtn" title="Reset rover (R)" aria-label="Reset rover">↶</button><button className="ci-btn small" id="clearBtn" title="Clear program" aria-label="Clear program">♜</button></div>
    <div className="kbdHelp" hidden>↑ ← → ADD · ⌫ UNDO · ENTER RUN · R RESET</div>
  </aside>;
}
export default memo(CommandPanel, () => true);
