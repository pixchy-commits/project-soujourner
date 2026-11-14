"use client";

import { useState } from "react";
import styles from "./RockAnalysis.module.css";

const TARGET_TURN = 180;
const TARGET_BACK = 6.5;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Step 2 only: configure the plan; the real rover never drives on this screen. */
export default function Position({ onFinish }: { onFinish?: () => void }) {
  const [turn, setTurn] = useState(0);
  const [back, setBack] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const aligned = turn === TARGET_TURN;
  const distanceReady = Math.abs(back - TARGET_BACK) < 0.001;
  const ready = aligned && distanceReady;
  const updateTurn = (n: number) => { setTurn(clamp(n, 0, 360)); setConfirmed(false); };
  const updateBack = (n: number) => { setBack(clamp(Math.round(n * 2) / 2, 0, 8)); setConfirmed(false); };
  const plannedDistance = back * 20;
  const plannedY = 615 - (plannedDistance / 130) * 330;
  return <div className={styles.layout}>
    <section className={`${styles.scene} ${styles.positionScene}`} aria-label="Plan Sojourner's position">
      <svg viewBox="0 0 860 740" className={styles.sceneSvg} role="img" aria-label="Yogi, stationary rover, and adjustable projected route">
        <defs><linearGradient id="positionMars" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d77e49"/><stop offset="1" stopColor="#a34d30"/></linearGradient></defs>
        <rect width="860" height="740" fill="url(#positionMars)"/>
        {[[90,110,7],[760,155,8],[61,300,4],[731,350,5],[795,581,6],[211,659,9]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="#9b4b30" opacity=".48"/>)}
        <image href="/assets/rock-analysis/yogi-rock.svg" x="320" y="68" width="220" height="172"/>
        <rect x="398" y="20" width="66" height="35" rx="17" fill="#fff3df"/><text x="431" y="44" fontSize="18" fontWeight="900" textAnchor="middle" fill="#29283b">Yogi</text>
        <line x1="323" x2="610" y1="270" y2="270" stroke="#fff2db" strokeWidth="3" strokeDasharray="7 8"/>
        <line x1="323" x2="610" y1="615" y2="615" stroke="#fff2db" strokeWidth="3" strokeDasharray="7 8" opacity=".5"/>
        <line x1="431" y1="615" x2="431" y2="270" stroke="#f9c64e" strokeWidth="3" strokeDasharray="5 9" opacity=".6"/>
        {back > 0 && <g opacity=".65"><line x1="431" y1="615" x2="431" y2={plannedY} stroke={back > 6.5 ? "#f57570" : "#5bc8bf"} strokeWidth="10" strokeLinecap="round" strokeDasharray="4 12"/></g>}
        <g transform={`translate(431 ${plannedY}) rotate(${turn})`} opacity={back > 0 || turn > 0 ? .55 : 0}>
          <image href="/assets/rock-analysis/sojourner-rover.svg" x="-58" y="-75" width="116" height="150"/>
        </g>
        <g transform="translate(431 615)"><circle r="88" fill="none" stroke="#ffd05b" strokeWidth="3" strokeDasharray="5 7" opacity=".9"/><image href="/assets/rock-analysis/sojourner-rover.svg" x="-58" y="-75" width="116" height="150"/></g>
        <g><rect x="25" y="668" width="200" height="40" rx="18" fill="#27232e"/><circle cx="48" cy="688" r="10" fill="#59c8bf" stroke="#fff3df" strokeWidth="2"/><text x="66" y="695" fill="#fff3df" fontSize="17" fontWeight="900">APXS sensor</text></g>
        <g><rect x="544" y="560" width="235" height="49" rx="19" fill="#fff3df"/><text x="662" y="590" textAnchor="middle" fill="#28283b" fontSize="19" fontWeight="900">Current position</text></g>
        <g><rect x="542" y="300" width="245" height="49" rx="19" fill="#f9c64e"/><text x="665" y="330" textAnchor="middle" fill="#29283b" fontSize="18" fontWeight="900">Target: 130 cm</text></g>
        <g><rect x="45" y="390" width="230" height="57" rx="20" fill="#fff3df"/><text x="160" y="414" textAnchor="middle" fill="#29283b" fontSize="17" fontWeight="900">Planned distance</text><text x="160" y="438" textAnchor="middle" fill="#29283b" fontSize="21" fontWeight="900">{plannedDistance} cm</text></g>
      </svg>
    </section>
    <aside className={`${styles.panel} ${styles.calcPanel} ${styles.positionPanel}`}>
      <div className={styles.questionKicker}>STEP 2 · POSITION</div>
      <h1 className={styles.positionHeading}>Move me to Yogi</h1>
      <div className={styles.positionSpeech}><span className={styles.calcFace}>▣</span><div>Turn around, then back up to the right spot!</div></div>
      <div className={`${styles.positionStatus} ${ready ? styles.positionStatusReady : ""}`} role="status">
        <strong>{ready ? "✓ Ready!" : !aligned ? "Adjust turn" : "Adjust distance"}</strong>
        <span>{ready ? "Your plan is correct. Continue to the Run step." : !aligned ? "Face Yogi by turning 180°." : "Now set the backward travel to 6½ turns."}</span>
      </div>
      <div className={styles.positionControl}>
        <div className={styles.positionControlTitle}><strong>Turn</strong><b>{turn}°</b></div>
        <div className={styles.positionControlRow}><button aria-label="Turn left 15 degrees" onClick={() => updateTurn(turn-15)}>−</button><input aria-label="Turn angle" type="range" min="0" max="360" step="15" value={turn} onChange={e => updateTurn(Number(e.target.value))}/><button aria-label="Turn right 15 degrees" onClick={() => updateTurn(turn+15)}>+</button></div>
        <div className={styles.positionScale}><span>0°</span><span>180°</span><span>360°</span></div>
      </div>
      <div className={styles.positionControl}>
        <div className={styles.positionControlTitle}><strong>Back</strong><b>{back.toFixed(1)} turns</b></div>
        <div className={styles.positionDots} aria-label={`${back} of 8 turns`}>{Array.from({length:16},(_,i)=><i key={i} className={i < back*2 ? styles.positionDotOn : ""}/>)}</div>
        <div className={styles.positionControlRow}><button aria-label="Decrease backward turns by half" onClick={() => updateBack(back-.5)}>−</button><input aria-label="Backward wheel turns" type="range" min="0" max="8" step="0.5" value={back} onChange={e => updateBack(Number(e.target.value))}/><button aria-label="Increase backward turns by half" onClick={() => updateBack(back+.5)}>+</button></div>
        <div className={styles.positionScale}><span>0 turns</span><span>Target: 6½</span><span>8 turns</span></div>
      </div>
      <p className={styles.positionNote}>Preview only — Sojourner will not move until Step 3: Run.</p>
      {showHint && <div className={styles.hintBox}>From your calculations: turn around 180°, then travel 130 cm. Each wheel turn moves 20 cm, so 130 ÷ 20 = 6½ turns.</div>}
      {confirmed && !ready && <div className={styles.answerFeedback} role="status">Adjust both settings before continuing.</div>}
      <div className={styles.panelBottom}>
        <button className={styles.primaryOrange} disabled={!ready} onClick={() => { setConfirmed(true); if (ready) onFinish?.(); }}>{ready ? "Next: Run →" : "Run locked"}</button>
        <button className={styles.hintButton} aria-label="Show positioning hint" onClick={() => setShowHint(v=>!v)}>♧</button>
      </div>
    </aside>
  </div>;
}
