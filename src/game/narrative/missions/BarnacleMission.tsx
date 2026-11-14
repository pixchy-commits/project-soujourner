"use client";

import { useState } from "react";
import Image from "next/image";
import type { ActivityProps, ActivityModules } from "../../flow/ActivityGate";
import styles from "./mission.module.css";

const artRoot = "/art/scenes/barnacle-arrival/";

/** Narrative adapters. Gameplay modules supplied to Game take precedence. */
function BarnacleArrival({ onComplete, onExit, paused = false, instant = false }: ActivityProps) {
  const [phase, setPhase] = useState<"arrival" | "notification" | "mission">("arrival");
  return <section className={styles.stage} aria-label="Arriving at Barnacle Bill" data-instant={instant} data-paused={paused}>
    <div className={styles.canvas}>
    <div key={phase === "mission" ? "first-person" : "third-person"} className={`${styles.visual} ${phase === "notification" ? styles.nearer : ""}`}>
      <Image src={artRoot + (phase === "mission" ? "rocks-v1.webp" : "arrival-v1.webp")} alt={phase === "mission" ? "Barnacle Bill through Sojo's cameras" : "Sojo seen from behind on the trail to Barnacle Bill"} fill unoptimized sizes="100vw" priority />
    </div>
    <span className={styles.location}>ROCK GARDEN / BARNACLE BILL</span>
    {phase !== "mission" && <button autoFocus className={`${styles.marker} ${phase === "notification" ? styles.notification : ""}`} disabled={paused} onClick={() => setPhase(phase === "arrival" ? "notification" : "mission")} aria-label={phase === "arrival" ? "Inspect the destination" : "Open mission from Pathfinder"}>
      <strong>!</strong><span>{phase === "arrival" ? "DESTINATION" : "FROM PATHFINDER"}</span>
    </button>}
    </div>
    {phase === "mission" ? <div className={styles.window} role="region" aria-labelledby="barnacle-mission-title">
      <span className={styles.sender}>FROM PATHFINDER</span><h1 id="barnacle-mission-title">Barnacle Bill</h1>
      <p>Rock analysis</p><ol><li>Find the marked rock.</li><li>Select it to open the analysis view.</li></ol>
      <button className="game-button" autoFocus disabled={paused} onClick={() => onComplete({ activityId: "exploration-barnacle-bill", outcome: "skipped" })}>VIEW ROCK</button>
    </div> : <div className={styles.instruction} aria-live="polite"><span>SOJO</span><p>{phase === "arrival" ? "Select the destination marker." : "A mission notice is waiting. Select ! to look through Sojo’s cameras."}</p></div>}
    <nav className={styles.controls} aria-label="Mission navigation">{phase !== "arrival" && <button className="game-button game-button-small" disabled={paused} onClick={() => setPhase(phase === "mission" ? "notification" : "arrival")}>BACK</button>}<button className="game-button game-button-small" disabled={paused} onClick={onExit}>RETURN TO TITLE</button></nav>
  </section>;
}

function BarnacleScan({ onComplete, onExit, paused = false, instant = false }: ActivityProps) {
  const [step, setStep] = useState<"select" | "review" | "handoff">("select");
  return <section className={styles.stage} aria-label="Barnacle Bill rock-analysis guide" data-instant={instant} data-paused={paused}>
    <div className={styles.canvas}>
    <div className={styles.visual}><Image src={artRoot + "rocks-v1.webp"} alt="Two Martian rocks in Sojo's first-person camera view" fill unoptimized sizes="100vw" priority /></div>
    <span className={styles.location}>BARNACLE BILL / ROCK ANALYSIS</span>
    {step === "select" && <button className={styles.rockTarget} autoFocus disabled={paused} onClick={() => setStep("review")} aria-label="Select Barnacle Bill, the marked rock"><span>1 · SELECT ROCK</span></button>}
    {step === "review" && <div className={styles.stepTag}><span>2</span> Barnacle Bill selected</div>}
    </div>
    {step === "handoff" && <div className={styles.window} role="region" aria-labelledby="analysis-handoff-title"><span className={styles.sender}>BARNACLE BILL</span><h1 id="analysis-handoff-title">Rock analysis</h1><p>The playable analysis sequence goes here.</p><button className="game-button" autoFocus disabled={paused} onClick={() => onComplete({activityId:"rock-analysis", outcome:"skipped"})}>CONTINUE STORY</button></div>}
    {step !== "handoff" && <div className={styles.instruction} aria-live="polite"><span>STEP {step === "select" ? "1" : "2"}</span><p>{step === "select" ? "Select the marked rock to inspect it." : "Target selected. Open the rock-analysis sequence when you’re ready."}</p>{step === "review" && <button className="game-button game-button-small" disabled={paused} onClick={() => setStep("handoff")}>OPEN ANALYSIS</button>}</div>}
    <nav className={styles.controls} aria-label="Analysis navigation">{step !== "select" && <button className="game-button game-button-small" disabled={paused} onClick={() => setStep(step === "handoff" ? "review" : "select")}>BACK</button>}<button className="game-button game-button-small" disabled={paused} onClick={onExit}>RETURN TO TITLE</button></nav>
  </section>;
}

export const narrativeActivities: ActivityModules = {
  "exploration-barnacle-bill": BarnacleArrival,
  "rock-analysis": BarnacleScan,
};
