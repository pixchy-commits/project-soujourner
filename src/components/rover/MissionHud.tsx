import { memo } from "react";
function MissionHud() {
  return <>
    <aside id="mission" className="panel" aria-label="Mission information">
      <span className="solTag" id="mSol">SOL 3</span><h1 id="mTitle">First Steps</h1>
      <div className="objective" id="mObj" hidden></div>
      <svg id="compass" style={{display:"none"}} aria-hidden="true"/><span id="facingTxt" hidden></span>
      <div className="stats" hidden><div className="stat"><div className="label">Blocks</div><div className="v" id="mBlocks">0/6</div></div><div className="stat"><div className="label">Best</div><div className="v" id="mBest">5</div></div></div>
    </aside>
  </>;
}
export default memo(MissionHud, () => true);
