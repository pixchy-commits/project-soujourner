"use client";
import { useState } from "react";
import styles from "./RockAnalysis.module.css";
import Calculation from "./Calculation";
import Position, { type RoverProgram } from "./Position";
import Run from "./Run";

export default function RockAnalysis({ onNext }: { onNext?: () => void }) {
  const [screen, setScreen] = useState<"calculate" | "position" | "run">("calculate");
  const [program, setProgram] = useState<RoverProgram>({ turn: 0, back: 0 });
  const [muted, setMuted] = useState(true);
  const [bright, setBright] = useState(false);
  return <main className={`${styles.root} ${bright ? styles.bright : ""}`}>
    <div className={styles.shell}>
      <header className={styles.header}>
        <button className={styles.circle} aria-label="Home" onClick={() => setScreen("calculate")}>⌂</button>
        <nav className={styles.nav} aria-label="Mission stages">
          <span className={styles.mission}>Mission</span><strong className={styles.navTitle}>Yogi Rock</strong>
          <span className={screen === "calculate" ? styles.active : styles.inactive}><b>1</b> Calculate</span>
          <span className={screen === "position" ? styles.active : styles.inactive}><b>2</b> Position</span>
          <span className={screen === "run" ? styles.active : styles.inactive}><b>3</b> Run</span>
        </nav>
        <div className={styles.headerRight}><button className={styles.circle} onClick={() => setMuted(x => !x)} aria-label={muted ? "Unmute" : "Mute"}>{muted ? "♪̸" : "♪"}</button><button className={styles.circle} onClick={() => setBright(x => !x)} aria-label="Toggle brightness">☼</button></div>
      </header>
      {screen === "calculate" ? <Calculation onFinish={() => setScreen("position")} /> : screen === "position" ? <Position initialProgram={program} onFinish={(nextProgram) => { setProgram(nextProgram); setScreen("run"); }} /> : <Run key={`${program.turn}-${program.back}`} program={program} onEdit={() => setScreen("position")} onFinish={onNext} />}
    </div>
  </main>;
}
