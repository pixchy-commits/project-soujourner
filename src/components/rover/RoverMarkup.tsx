import { memo } from "react";
import MissionHud from "./MissionHud";
import MapBoard from "./MapBoard";
import CommandPanel from "./CommandPanel";
import Dialogs from "./Dialogs";

// The whole static page, split by screen area. Ids are kept: engine.ts finds elements by id.
function RoverMarkup() {
  return (
    <>
      <section id="game" className="screen" aria-label="Mission">
        <button id="homeBtn" hidden></button><button id="missionsBtn" hidden></button><button id="musicGame" hidden></button><button id="setBtn" hidden></button>
        <main className="play">
          <MissionHud />
          <MapBoard />
          <CommandPanel />
        </main>
      </section>
      <Dialogs />
    </>
  );
}
export default memo(RoverMarkup, () => true);
