import { memo } from "react";

// Static markup. The engine fills it in (see engine.ts), so React must never re-render it.
function MissionHud() {
  return (
    <>
<aside id="mission" className="panel" aria-label="Mission information">
      <span className="solTag" id="mSol">SOL 3</span>
      <h1 id="mTitle">First Steps</h1>
      <div className="objective" id="mObj"></div>
      <svg id="compass" style={{ "display": "none" }} aria-hidden="true"></svg><span id="facingTxt" hidden></span>
      <div className="stats">
        <div className="stat"><div className="label">Blocks</div><div className="v" id="mBlocks">0/6</div></div>
        <div className="stat"><div className="label">Best ★★★</div><div className="v" id="mBest">5</div></div>
      </div>

    </aside><aside id="tipsHud" aria-label="Tips and hints">
      <div className="tipsLabel">Mission tips</div>
      <div className="feedback info" id="feedback" role="status" aria-live="polite"><span className="fi">i</span><span id="fbText"></span></div>
      <div className="hintRow">
        <button className="ci-btn small" id="hintBtn">💡 Hint</button>
        <div className="hintDots" id="hintDots"><i></i><i></i><i></i></div>
      </div>
    </aside>
    </>
  );
}
export default memo(MissionHud, () => true);
