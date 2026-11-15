"use client";

import type { RockMission } from "./RockAnalysis";
import { useEffect, useRef, useState } from "react";
import styles from "./RockAnalysis.module.css";

const TURN_DURATION = 2.2;
const DRIVE_SECONDS_PER_TURN = 0.85;
const MAX_TURNS = 8;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

const missionValues = {
  yogi: { targetDistance: 130, distancePerTurn: 20, rockName: "Yogi" },
  "barnacle-bill": { targetDistance: 150, distancePerTurn: 25, rockName: "Barnacle" },
} as const;

/** Step 3: execute the player's program using mission-specific distances. */
export default function Run({
  mission = "yogi",
  program,
  onFinish,
  paused = false,
  onEdit,
}: {
  program: { turn: number; back: number };
  onFinish?: () => void;
  paused?: boolean;
  onEdit?: () => void;
  mission?: RockMission;
}) {
  const { targetDistance, distancePerTurn, rockName } = missionValues[mission];
  const requiredTurns = targetDistance / distancePerTurn;
  const total = TURN_DURATION + Math.max(0.4, program.back * DRIVE_SECONDS_PER_TURN);
  const correctTurn = program.turn === 180;
  const programmedDistance = program.back * distancePerTurn;
  const correctDistance = Math.abs(programmedDistance - targetDistance) < 0.001;
  const success = correctTurn && correctDistance;

  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const lastFrame = useRef<number | null>(null);
  const completed = elapsed >= total;
  const turned = elapsed >= TURN_DURATION;
  const turnFraction = clamp(elapsed / TURN_DURATION);
  const driveFraction = clamp((elapsed - TURN_DURATION) / (total - TURN_DURATION));
  const traveled = driveFraction * programmedDistance;
  const wheelTurns = driveFraction * program.back;
  const direction = ((program.turn - 180) * Math.PI) / 180;

  // The yellow target line is always 338 SVG units from the start.
  const pixelsPerCm = 338 / targetDistance;
  const roverY = 612 - traveled * pixelsPerCm * Math.cos(direction);
  const roverX = 431 + traveled * pixelsPerCm * Math.sin(direction);
  const pixelsPerTurn = distancePerTurn * pixelsPerCm;
  const phaseLabel = completed
    ? success ? "My arm touched the rock!" : "Program finished — check the result"
    : !turned ? `Turning ${program.turn}°`
    : `Wheel turns: ${wheelTurns.toFixed(1)} of ${program.back.toFixed(1)}`;

  useEffect(() => {
    if (!playing || paused || completed) return;
    let frame = 0;
    const tick = (now: number) => {
      const dt = lastFrame.current === null ? 0 : Math.min(0.06, (now - lastFrame.current) / 1000);
      lastFrame.current = now;
      setElapsed(previous => Math.min(total, previous + dt));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lastFrame.current = null; };
  }, [playing, paused, completed, total]);

  // The parent keys this component by mission and program, resetting state on edits.
  const restart = () => { lastFrame.current = null; setElapsed(0); setPlaying(false); };
  const difference = programmedDistance - targetDistance;
  const feedback = !correctTurn
    ? "Wrong direction! Sojourner did not face the rock. Edit your turn angle."
    : difference < 0
      ? `Stopped ${Math.round(-difference)} cm short of the rock. Try again.`
      : `Overshot the rock by ${Math.round(difference)} cm. Try again.`;

  return <div className={styles.layout}>
    <section className={`${styles.scene} ${styles.runScene}`} aria-label="Sojourner executes its movement program">
      <svg viewBox="0 0 860 740" className={styles.sceneSvg} role="img" aria-label="Animated Sojourner driving toward target rock">
        <defs><linearGradient id="runMarsGround" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d77d48"/><stop offset="1" stopColor="#a14a2f"/></linearGradient></defs>
        <rect width="860" height="740" fill="url(#runMarsGround)"/>
        {[[90,110,7],[760,155,8],[61,300,4],[731,350,5],[795,581,6],[211,659,9]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="#9b4b30" opacity=".48"/>)}
        <image href="/assets/rock-analysis/yogi-rock.svg" x="320" y="68" width="220" height="172"/>
        <rect x={rockName === "Yogi" ? 398 : 380} y="20" width={rockName === "Yogi" ? 66 : 102} height="35" rx="17" fill="#fff3df"/>
        <text x="431" y="44" fontSize="18" fontWeight="900" textAnchor="middle" fill="#29283b">{rockName}</text>
        <line x1="323" x2="690" y1="270" y2="270" stroke="#fff2db" strokeWidth="3" strokeDasharray="7 8"/>
        <line x1="323" x2="690" y1="612" y2="612" stroke="#fff2db" strokeWidth="3" strokeDasharray="7 8" opacity=".55"/>
        <line x1="431" y1="612" x2="431" y2="270" stroke="#f9c64e" strokeWidth="3" strokeDasharray="5 9" opacity=".6"/>
        <line x1="662" y1="612" x2="662" y2="270" stroke="#fff1d9" strokeWidth="3"/>
        {Array.from({ length: Math.floor(targetDistance / distancePerTurn) + 1 }, (_, i) => {
          const n = i * distancePerTurn;
          const y = 612 - n * pixelsPerCm;
          return <g key={n}><line x1="645" x2="679" y1={y} y2={y} stroke="#fff1d9" strokeWidth="3"/><text x="636" y={y + 6} textAnchor="end" fill="#fff1d9" fontSize="17" fontWeight="900">{n}</text></g>;
        })}
        {/* Show the target value even when it falls between whole-turn ticks (Yogi: 130). */}
        {requiredTurns % 1 !== 0 && <text x="636" y="276" textAnchor="end" fill="#f8c64e" fontSize="17" fontWeight="900">{targetDistance}</text>}
        <line x1="623" x2="701" y1="270" y2="270" stroke="#f8c64e" strokeWidth="5"/>
        {Array.from({ length: MAX_TURNS }, (_, i) => {
          const amount = clamp(wheelTurns - i);
          if (amount <= 0) return null;
          const bottom = 612 - i * pixelsPerTurn;
          const fullHeight = pixelsPerTurn - 3;
          const top = bottom - fullHeight * amount;
          const targetY = 270;
          const belowTargetHeight = Math.max(0, bottom - Math.max(top, targetY));
          const aboveTargetHeight = Math.max(0, Math.min(bottom, targetY) - top);
          return <g key={i}>
            {belowTargetHeight > 0 && <rect x="705" y={bottom - belowTargetHeight} width="23" height={belowTargetHeight} rx="4" fill="#59c6bd" stroke="#29283b" strokeWidth="2"/>}
            {aboveTargetHeight > 0 && <rect x="705" y={top} width="23" height={aboveTargetHeight} rx="4" fill="#f16a64" stroke="#29283b" strokeWidth="2"/>}
          </g>;
        })}
        <g><rect x="738" y="254" width="113" height="37" rx="17" fill="#f8c64e"/><text x="794" y="279" fontSize="17" textAnchor="middle" fontWeight="900" fill="#28283b">Stop here!</text></g>
        <g transform={`translate(${roverX} ${roverY}) rotate(${program.turn * turnFraction})`}><image href="/assets/rock-analysis/sojourner-rover.svg" x="-58" y="-75" width="116" height="150"/></g>
        {completed && success && <g><circle cx="431" cy="264" r="18" fill="#59c6bd" stroke="#fff2df" strokeWidth="4"/><text x="431" y="272" textAnchor="middle" fill="#173d3b" fontSize="24" fontWeight="900">✓</text><rect x="475" y="307" width="160" height="42" rx="19" fill="#fff3df"/><text x="555" y="334" textAnchor="middle" fill="#29283b" fontSize="19" fontWeight="900">Contact!</text></g>}
        {!completed && <g><rect x="480" y={Math.max(322,roverY-34)} width="166" height="43" rx="18" fill="#fff3df"/><text x="563" y={Math.max(322,roverY-34)+28} textAnchor="middle" fill="#29283b" fontSize="18" fontWeight="900">{turned ? "Wheel turn!" : "Turning around"}</text></g>}
        <g><rect x="25" y="671" width="200" height="40" rx="18" fill="#27232e"/><circle cx="48" cy="691" r="10" fill="#59c8bf" stroke="#fff3df" strokeWidth="2"/><text x="66" y="698" fill="#fff3df" fontSize="17" fontWeight="900">APXS sensor</text></g>
      </svg>
    </section>
    <aside className={`${styles.panel} ${styles.calcPanel} ${styles.runPanel}`}>
      <div className={styles.questionKicker}>STEP 3 OF 4 · RUN</div>
      <h1 className={styles.runHeading}>Watch me go!</h1>
      <div className={styles.runSpeech}><span className={styles.calcFace}>▣</span><strong>{completed ? (success ? "My arm touched the rock!" : "That did not reach the rock!") : `Turn ${program.turn}°, then back up ${program.back.toFixed(1)} turns!`}</strong></div>
      <div className={styles.progressBox}><div className={styles.progressIcon}>✦</div><div className={styles.progressText}><strong>{phaseLabel}</strong><div className={styles.bar}><div className={styles.barFill} style={{ transform: `scaleX(${clamp(traveled / targetDistance)})` }}/></div><small>{Math.round(traveled)} cm traveled · target {targetDistance} cm</small></div></div>
      <div className={`${styles.task} ${turned ? styles.taskDone : styles.taskCurrent}`}><span>{turned ? "✓" : "1"}</span><strong>Turn {program.turn}°</strong></div>
      <div className={`${styles.task} ${completed ? styles.taskDone : turned ? styles.taskCurrent : ""}`}><span>{completed ? "✓" : "2"}</span><strong>Back up {program.back.toFixed(1)} turns</strong><div className={styles.dots}>{Array.from({ length: MAX_TURNS }, (_, i) => <i key={i} className={wheelTurns >= i + 1 ? styles.dotOn : ""}/>)}</div></div>
      <div className={`${styles.task} ${completed && success ? styles.taskDone : ""}`}><span>{completed && success ? "✓" : "3"}</span><strong>Touch the rock</strong></div>
      {completed && <div className={`${styles.answerFeedback} ${success ? styles.feedbackCorrect : styles.feedbackWrong}`} role="status">{success ? "Success! Sojourner reached the target rock." : feedback}</div>}
      <div className={styles.panelBottom}>
        {completed ? <button className={styles.primaryOrange} onClick={success ? onFinish : onEdit}>{success ? "Study rock →" : "Edit program →"}</button> : <button className={styles.primary} onClick={() => setPlaying(value => !value)}>{playing ? "Pause" : elapsed === 0 ? "Run program ▶" : "Resume"}</button>}
        <button className={styles.replay} onClick={restart} aria-label="Reset run">↻</button>
      </div>
    </aside>
  </div>;
}
