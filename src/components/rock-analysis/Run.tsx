"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./RockAnalysis.module.css";

const TURN_DURATION = 2.2;
const DRIVE_DURATION = 6.5;
const TOTAL = TURN_DURATION + DRIVE_DURATION;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Step 3: execute the already-validated plan. No position controls appear here. */
export default function Run({ onFinish }: { onFinish?: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const lastFrame = useRef<number | null>(null);
  const completed = elapsed >= TOTAL;
  const turned = elapsed >= TURN_DURATION;
  const turnFraction = clamp(elapsed / TURN_DURATION);
  const driveFraction = clamp((elapsed - TURN_DURATION) / DRIVE_DURATION);
  const traveled = driveFraction * 130;
  const wheelTurns = driveFraction * 6.5;
  const roverY = 612 - driveFraction * 338;
  const phaseLabel = completed ? "My arm touched Yogi!" : !turned ? "Half turn around" : `Wheel turns: ${wheelTurns.toFixed(1)} of 6½`;

  useEffect(() => {
    if (!playing || completed) return;
    let frame = 0;
    const tick = (now: number) => {
      const dt = lastFrame.current === null ? 0 : Math.min(0.06, (now - lastFrame.current) / 1000);
      lastFrame.current = now;
      setElapsed(previous => Math.min(TOTAL, previous + dt));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lastFrame.current = null; };
  }, [playing, completed]);

  const restart = () => { lastFrame.current = null; setElapsed(0); setPlaying(true); };

  return <div className={styles.layout}>
    <section className={`${styles.scene} ${styles.runScene}`} aria-label="Sojourner executes its movement program">
      <svg viewBox="0 0 860 740" className={styles.sceneSvg} role="img" aria-label="Animated Sojourner driving toward Yogi Rock">
        <defs><linearGradient id="runMarsGround" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d77d48"/><stop offset="1" stopColor="#a14a2f"/></linearGradient></defs>
        <rect width="860" height="740" fill="url(#runMarsGround)"/>
        {[[90,110,7],[760,155,8],[61,300,4],[731,350,5],[795,581,6],[211,659,9]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="#9b4b30" opacity=".48"/>)}
        <image href="/assets/rock-analysis/yogi-rock.svg" x="320" y="68" width="220" height="172"/>
        <rect x="398" y="20" width="66" height="35" rx="17" fill="#fff3df"/><text x="431" y="44" fontSize="18" fontWeight="900" textAnchor="middle" fill="#29283b">Yogi</text>
        <line x1="323" x2="690" y1="270" y2="270" stroke="#fff2db" strokeWidth="3" strokeDasharray="7 8"/>
        <line x1="323" x2="690" y1="612" y2="612" stroke="#fff2db" strokeWidth="3" strokeDasharray="7 8" opacity=".55"/>
        <line x1="431" y1="612" x2="431" y2="270" stroke="#f9c64e" strokeWidth="3" strokeDasharray="5 9" opacity=".6"/>
        <line x1="662" y1="612" x2="662" y2="270" stroke="#fff1d9" strokeWidth="3"/>
        {[0,20,40,60,80,100,120].map(n => { const y = 612 - n / 130 * 338; return <g key={n}><line x1="645" x2="679" y1={y} y2={y} stroke="#fff1d9" strokeWidth="3"/><text x="636" y={y+6} textAnchor="end" fill="#fff1d9" fontSize="17" fontWeight="900">{n}</text></g>; })}
        <line x1="623" x2="701" y1="270" y2="270" stroke="#f8c64e" strokeWidth="5"/>
        {Array.from({length:7},(_,i) => {
          const amount = Math.max(0, Math.min(1, wheelTurns-i));
          if (amount <= 0) return null;
          const bottom = 612-i*52;
          return <rect key={i} x="705" y={bottom-49*amount} width="23" height={49*amount} rx="5" fill="#59c6bd" stroke="#29283b" strokeWidth="2"/>;
        })}
        <g><rect x="738" y="254" width="113" height="37" rx="17" fill="#f8c64e"/><text x="794" y="279" fontSize="17" textAnchor="middle" fontWeight="900" fill="#28283b">Stop here!</text></g>
        <g transform={`translate(431 ${roverY}) rotate(${180 * turnFraction})`}><image href="/assets/rock-analysis/sojourner-rover.svg" x="-58" y="-75" width="116" height="150"/></g>
        {completed && <g><circle cx="431" cy="264" r="18" fill="#59c6bd" stroke="#fff2df" strokeWidth="4"/><text x="431" y="272" textAnchor="middle" fill="#173d3b" fontSize="24" fontWeight="900">✓</text><rect x="475" y="307" width="160" height="42" rx="19" fill="#fff3df"/><text x="555" y="334" textAnchor="middle" fill="#29283b" fontSize="19" fontWeight="900">Contact!</text></g>}
        {!completed && <g><rect x="480" y={Math.max(322,roverY-34)} width="166" height="43" rx="18" fill="#fff3df"/><text x="563" y={Math.max(322,roverY-34)+28} textAnchor="middle" fill="#29283b" fontSize="18" fontWeight="900">{turned ? "Wheel turn!" : "Turning around"}</text></g>}
        <g><rect x="25" y="671" width="200" height="40" rx="18" fill="#27232e"/><circle cx="48" cy="691" r="10" fill="#59c8bf" stroke="#fff3df" strokeWidth="2"/><text x="66" y="698" fill="#fff3df" fontSize="17" fontWeight="900">APXS sensor</text></g>
      </svg>
    </section>
    <aside className={`${styles.panel} ${styles.calcPanel} ${styles.runPanel}`}>
      <div className={styles.questionKicker}>STEP 3 OF 4 · RUN</div>
      <h1 className={styles.runHeading}>Watch me go!</h1>
      <div className={styles.runSpeech}><span className={styles.calcFace}>▣</span><strong>{completed ? "My arm touched Yogi!" : "Back me up 6½ turns!"}</strong></div>
      <div className={styles.progressBox}><div className={styles.progressIcon}>✦</div><div className={styles.progressText}><strong>{phaseLabel}</strong><div className={styles.bar}><div className={styles.barFill} style={{ transform: `scaleX(${clamp(traveled/130)})` }}/></div><small>{Math.round(traveled)} of 130 cm</small></div></div>
      <div className={`${styles.task} ${turned ? styles.taskDone : styles.taskCurrent}`}><span>{turned ? "✓" : "1"}</span><strong>Turn around</strong></div>
      <div className={`${styles.task} ${completed ? styles.taskDone : turned ? styles.taskCurrent : ""}`}><span>{completed ? "✓" : "2"}</span><strong>Back up 6½ turns</strong><div className={styles.dots}>{Array.from({length:7},(_,i)=><i key={i} className={wheelTurns >= Math.min(6.5,i+1) ? styles.dotOn : ""}/>)}</div></div>
      <div className={`${styles.task} ${completed ? styles.taskDone : ""}`}><span>{completed ? "✓" : "3"}</span><strong>Touch Yogi</strong></div>
      {completed && <div className={`${styles.answerFeedback} ${styles.feedbackCorrect}`} role="status">Success! Sojourner reached Yogi Rock.</div>}
      <div className={styles.panelBottom}>
        {completed ? <button className={styles.primaryOrange} onClick={onFinish}>Study Yogi →</button> : <button className={styles.primary} onClick={() => setPlaying(value => !value)}>{playing ? "Pause" : "Resume"}</button>}
        <button className={styles.replay} onClick={restart} aria-label="Restart run">↻</button>
      </div>
    </aside>
  </div>;
}
