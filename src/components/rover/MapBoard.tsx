import { memo } from "react";

// Static markup. The engine fills it in (see engine.ts), so React must never re-render it.
function MapBoard() {
  return (
    <>
<section id="mapPanel" aria-label="Mars surface map">
      <span id="gridSize" hidden></span>
      <div id="mapWrap"><div id="board">
        <canvas id="terrain"></canvas>
        <canvas id="tracks"></canvas>
        <svg id="gridSvg"></svg>
        <div className="layer" id="marks"></div>
        <div className="layer" id="objs"></div>
        <div id="rover"></div>
        <div className="layer" id="fx"></div>
      </div></div>
</section>
    </>
  );
}
export default memo(MapBoard, () => true);
