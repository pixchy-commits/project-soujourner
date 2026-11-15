import { memo } from "react";

// Static markup. The engine fills it in (see engine.ts), so React must never re-render it.
function Dialogs() {
  return (
    <>
<section id="reports" className="screen" aria-label="Mission reports">
  <div className="repWrap">
    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
      <button className="ci-btn small" id="repBack">← Game</button>
      <span className="serif" style={{ "color": "var(--cream)", "fontSize": "20px" }} id="repTotal"></span>
    </div>
    <div className="wordmark">MISSION REPORTS</div>
    <div className="repList" id="repList"></div>
  </div>
</section><div className="overlay" id="howto"><div className="modal panel">
  <h2>Welcome, Mission Engineer!</h2>
  <p className="serif" style={{ "fontSize": "18px", "margin": "0" }}>Mars is too far away to drive Sojourner with a joystick — so you send it a program.</p>
  <div className="steps3">
    <div><span className="big">👀 1</span>Look at the map. Where is the rover facing?</div>
    <div><span className="big">🧩 2</span>Add command blocks to build your route.</div>
    <div><span className="big">▶ 3</span>Press Run and watch. Fix it and try again!</div>
  </div>
  <div className="row"><button className="ci-btn primary" id="howtoGo">Let&apos;s drive!</button></div>
</div></div><div className="overlay" id="result"><div className="modal panel">
  <h2 id="resTitle">Mission Complete!</h2>
  <p className="serif" id="resSub" style={{ "fontSize": "18px", "margin": "0" }}>Great job!</p>
  <div className="stars" id="resStars"></div>
  <div className="resGrid">
    <div className="stat"><div className="label">Blocks used</div><div className="v" id="resUsed">5</div></div>
    <div className="stat"><div className="label">Best possible</div><div className="v" id="resBest">5</div></div>
  </div>
  <p id="resTip" style={{ "fontWeight": "800", "margin": "14px 0 0" }}></p>
  <div className="row"><button className="ci-btn" id="resRetry">Improve program</button><button className="ci-btn primary" id="resNext">Next Mission ▶</button></div>
</div></div><div className="overlay" id="settings"><div className="modal panel" style={{ "textAlign": "left" }}>
  <button className="closeX" id="setClose" aria-label="Close">✕</button>
  <h2 style={{ "textAlign": "center" }}>Settings</h2>
  <div className="setRow">Rover speed<div className="seg" data-set="speed"><button data-v="slow">Slow</button><button data-v="normal">Normal</button><button data-v="fast">Fast</button></div></div>
  <div className="setRow">Sound effects<div className="seg" data-set="sfx"><button data-v="on">On</button><button data-v="off">Off</button></div></div>
  <div className="setRow">Music<div className="seg" data-set="music"><button data-v="on">On</button><button data-v="off">Off</button></div></div>
  <div className="setRow">Grid lines<div className="seg" data-set="grid"><button data-v="soft">Soft</button><button data-v="bold">Bold</button></div></div>
  <div className="setRow" style={{ "border": "0" }}>Progress<button className="ci-btn small" id="resetProg">Erase stars</button></div>
  <div className="row"><button className="ci-btn primary" id="setDone">Done</button></div>
</div></div><div className="devNote" id="devNote"></div>
    </>
  );
}
export default memo(Dialogs, () => true);
