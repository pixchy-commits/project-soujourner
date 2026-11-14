import { memo } from "react";

// Static markup. The engine fills it in (see engine.ts), so React must never re-render it.
function CommandPanel() {
  return (
    <>
<aside id="prog" className="panel" aria-label="Programming panel">
      <div className="label">Command blocks — click to add</div>
      <div className="palette" id="palette">
        <button className="cmd L" data-cmd="L" draggable="true" title="Rotate Left (←)"><span className="ic"></span>Turn Left<kbd>←</kbd></button>
        <button className="cmd F" data-cmd="F" draggable="true" title="Move Forward (↑)"><span className="ic"></span>Forward<kbd>↑</kbd></button>
        <button className="cmd R" data-cmd="R" draggable="true" title="Rotate Right (→)"><span className="ic"></span>Turn Right<kbd>→</kbd></button>
      </div>
      <div className="counter" id="counter"><span className="label">Blocks used</span><div className="bar"><i id="barFill"></i></div><b id="countTxt">0 / 6</b></div>
      <div className="label">Your program</div>
      <div className="seq" id="seq" aria-label="Program sequence"></div>
      <div className="runRow">
        <button className="ci-btn primary" id="runBtn">▶ Run Program</button>
        <button className="ci-btn small" id="resetBtn" title="Put the rover back at the start (R)">↺ Reset Rover</button>
        <button className="ci-btn small" id="clearBtn" title="Remove all blocks">Clear</button>
      </div>
      <div className="kbdHelp">Hover a block to remove (✕) or move it (‹ ›). You can also drag blocks to reorder.<br />
        Keys: <kbd>↑</kbd> <kbd>←</kbd> <kbd>→</kbd> add · <kbd>⌫</kbd> undo · <kbd>Enter</kbd> run · <kbd>R</kbd> reset</div>
    </aside>
    </>
  );
}
export default memo(CommandPanel, () => true);
