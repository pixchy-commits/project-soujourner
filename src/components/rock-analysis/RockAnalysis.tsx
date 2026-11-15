"use client";
import { useGameHost } from "../GameHostContext";
import { useState } from "react";
import MissionAccomplished from "../MissionAccomplished";
import styles from "./RockAnalysis.module.css";
import Calculation from "./Calculation";
import Position, { type RoverProgram } from "./Position";
import Run from "./Run";

export type RockMission = "yogi" | "barnacle-bill";
export default function RockAnalysis({ onNext, paused = false, mission = "yogi" }: { onNext?: () => void; paused?: boolean; mission?: RockMission }) {
  const host = useGameHost();
  const [accomplished, setAccomplished] = useState(false);
  const [screen, setScreen] = useState<"calculate" | "position" | "run">("calculate");
  const [program, setProgram] = useState<RoverProgram>({ turn: 0, back: 0 });
  const [muted, setMuted] = useState(true);
  const [bright, setBright] = useState(false);
  return <main data-hosted={host ? "true" : undefined} className={`${styles.root} ${bright ? styles.bright : ""}`}>
    <div className={styles.shell}>
      <header className={styles.header}>
        <button className={styles.circle} aria-label="Home" onClick={() => setScreen("calculate")}>⌂</button>
        <nav className={styles.nav} aria-label="Mission stages">
          <span className={styles.mission}>Mission</span><strong className={styles.navTitle}>{mission === "yogi" ? "Yogi Rock" : "Barnacle Bill"}</strong>
          <span className={screen === "calculate" ? styles.active : styles.inactive}><b>1</b> Calculate</span>
          <span className={screen === "position" ? styles.active : styles.inactive}><b>2</b> Position</span>
          <span className={screen === "run" ? styles.active : styles.inactive}><b>3</b> Run</span>
        </nav>
        <div className={styles.headerRight}>{!host && <button className={styles.circle} onClick={() => setMuted(x => !x)} aria-label={muted ? "Unmute" : "Mute"}>{muted ? "♪̸" : "♪"}</button>}<button className={styles.circle} onClick={() => setBright(x => !x)} aria-label="Toggle brightness">☼</button></div>
      </header>
      {screen === "calculate" ? <Calculation key={mission} mission={mission} onFinish={() => setScreen("position")} /> : screen === "position" ? <Position key={mission} mission={mission} initialProgram={program} onFinish={(nextProgram) => { setProgram(nextProgram); setScreen("run"); }} /> : <Run paused={paused} key={`${mission}-${program.turn}-${program.back}`} mission={mission} program={program} onEdit={() => setScreen("position")} onFinish={() => setAccomplished(true)} />}
    </div>
    {accomplished && <MissionAccomplished mission={mission === "yogi" ? "yogi" : "barnacle"} onReplay={() => { setAccomplished(false); setProgram({ turn: 0, back: 0 }); setScreen("calculate"); }} onContinue={() => { setAccomplished(false); onNext?.(); }} />}
  </main>;
}
