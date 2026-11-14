"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./RockAnalysis.module.css";
import Calculation from "./Calculation";

type Phase = "turn" | "drive" | "failed";
const TURN_SECONDS = 2.3;
const DRIVE_SECONDS = 6.3;
const TOTAL = TURN_SECONDS + DRIVE_SECONDS;
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));

/** The Try it page only. All animation state is local to this minigame. */
export default function RockAnalysis({ onNext }: { onNext?: () => void }) {
  const [screen, setScreen] = useState<"try" | "calculate">("try");
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [bright, setBright] = useState(false);
  const clock = useRef<number | null>(null);
  const last = useRef<number | null>(null);
  const reset = useCallback(() => { setScreen("try"); setElapsed(0); setPlaying(true); last.current = null; }, []);
  useEffect(() => {
    const frame = (now: number) => {
      const dt = Math.min(0.07, (now - (last.current ?? now)) / 1000);
      last.current = now;
      if (playing && screen === "try") setElapsed(t => Math.min(TOTAL, t + dt));
      clock.current = requestAnimationFrame(frame);
    };
    clock.current = requestAnimationFrame(frame);
    return () => { if (clock.current !== null) cancelAnimationFrame(clock.current); };
  }, [playing, screen]);
  useEffect(() => { if (elapsed >= TOTAL) setPlaying(false); }, [elapsed]);
  const phase: Phase = elapsed >= TOTAL ? "failed" : elapsed < TURN_SECONDS ? "turn" : "drive";
  const turnFraction = clamp(elapsed / TURN_SECONDS);
  const driveFraction = clamp((elapsed - TURN_SECONDS) / DRIVE_SECONDS);
  const distance = Math.round(driveFraction * 110);
  const turns = driveFraction * 5.5;
  // Rover rotates 180 degrees first, then travels toward Yogi. SVG assets stay upright in the source file.
  const rotation = turnFraction * 180;
  const roverY = 398 - driveFraction * 164;
  const status = phase === "turn" ? "Turning around..." : phase === "drive" ? `Wheel turns: ${Math.min(5, Math.floor(turns))} of 5½` : "Stopped short!";
  const caption = phase === "turn" ? "Turning around..." : phase === "drive" ? `Wheel turn ${Math.max(1, Math.min(6, Math.ceil(turns))) }!` : "Huh? Where’s Yogi?";

  return <main className={`${styles.root} ${bright ? styles.bright : ""}`}>
    <div className={styles.shell}>
      <header className={styles.header}>
        <button className={styles.circle} aria-label="Home" onClick={reset}>⌂</button>
        <nav className={styles.nav} aria-label="Mission stages">
          <span className={styles.mission}>Mission</span><strong className={styles.navTitle}>Yogi Rock</strong>
          <span className={screen === "try" ? styles.active : styles.inactive}><b>★</b> Try it</span>
          <span className={screen === "calculate" ? styles.active : styles.inactive}><b>1</b> Calculate</span>
          <span className={styles.inactive}><b>2</b> Position</span>
          <span className={styles.inactive}><b>3</b> Run</span>
        </nav>
        <div className={styles.headerRight}><button className={styles.circle} onClick={() => setMuted(x => !x)} aria-label={muted ? "Unmute" : "Mute"}>{muted ? "♪̸" : "♪"}</button><button className={styles.circle} onClick={() => setBright(x => !x)} aria-label="Toggle brightness">☼</button></div>
      </header>
      {screen === "calculate" ? <Calculation onFinish={onNext} /> : <div className={styles.layout}>
        <section className={styles.scene} aria-label="Sojourner approaching Yogi Rock">
          <svg viewBox="0 0 510 430" className={styles.sceneSvg} role="img" aria-label="Top-down rover approach with distance ruler">
            <defs><linearGradient id="marsGroundTry" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d77b46"/><stop offset="1" stopColor="#a94e2e"/></linearGradient></defs>
            <rect width="510" height="430" fill="url(#marsGroundTry)"/>
            {[[54,72,4],[452,95,5],[38,183,2],[89,249,3],[453,318,4],[122,382,5],[415,220,3],[320,84,2]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="#9e4d2e" opacity=".5"/>)}
            <image href="/assets/rock-analysis/yogi-rock.svg" x="192" y="39" width="130" height="105"/>
            <rect x="230" y="13" width="45" height="22" rx="11" fill="#fff3d9"/><text x="252" y="28" fontSize="12" fontWeight="900" fill="#262132" textAnchor="middle">Yogi</text>
            <line x1="198" y1="142" x2="421" y2="142" stroke="#54c9c2" strokeWidth="2.5" strokeDasharray="5 5"/>
            <circle cx="255" cy="142" r="11" stroke="#fff0c8" strokeDasharray="3 3" strokeWidth="2" fill="none"/>
            <rect x="365" y="117" width="100" height="18" rx="10" fill="#56c6bf"/><text x="415" y="130" fontSize="10" textAnchor="middle" fontWeight="800" fill="#23303a">Arm reaches Yogi</text>
            {phase === "failed" && (
              <g aria-label="Sojourner stopped 20 centimeters short of Yogi">
                {/* The dashed red region is the distance between the APXS reach line and the rover. */}
                <rect x="239" y="153" width="32" height="34" rx="6" fill="#f36b69" fillOpacity=".12" stroke="#f36b69" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="255" y1="144" x2="255" y2="187" stroke="#f36b69" strokeWidth="1.5" strokeDasharray="3 4" />
                <rect x="136" y="160" width="80" height="20" rx="11" fill="#f46e68" />
                <text x="176" y="174" textAnchor="middle" fontSize="10" fontWeight="900" fill="#321c20">20 cm short!</text>
              </g>
            )}
            <path d="M255 398 Q341 416 314 334 Q297 302 255 304" fill="none" stroke="#f3a04d" strokeWidth="3" opacity=".8" strokeDasharray="0"/>
            <path d="M255 398 V142" stroke="#55c6be" strokeWidth="2" strokeDasharray="4 5" opacity={phase === "turn" ? 0 : 0.9}/>
            <g stroke="#ffe7c4" strokeWidth="2"><line x1="380" y1="155" x2="380" y2="317"/>{[0,1,2,3,4,5,6].map(i=><line key={i} x1="370" y1={317-i*27} x2="390" y2={317-i*27}/>)}</g>
            {[0,20,40,60,80,100,120].map((n,i)=><text key={n} x="360" y={321-i*27} textAnchor="end" fontSize="11" fontWeight="800" fill="#fff3df">{n}</text>)}
            {Array.from({length:6},(_,i)=><rect key={i} x="395" y={294-i*27} width="13" height="24" rx="5" fill={distance >= i*20+12 ? "#59c8c0" : "#d38959"} stroke="#4e302a" strokeWidth="1.5"/>)}
            <rect x="421" y="148" width="65" height="18" rx="9" fill={phase === "failed" ? "#f18d85" : "#df7859"}/><text x="453" y="160" textAnchor="middle" fontSize="10" fontWeight="800" fill="#372126">My guess</text><g transform={`translate(255 ${roverY}) rotate(${rotation})`}><image href="/assets/rock-analysis/sojourner-rover.svg" x="-34" y="-47" width="68" height="94"/></g>
            <g transform={`translate(${phase === "turn" ? 299 : 299} ${Math.max(208, roverY-10)})`}><rect x="0" y="-17" width={phase === "failed" ? 113 : 92} height="26" rx="13" fill="#fff3d9"/><text x={phase === "failed" ? 56 : 46} y="0" fontSize="11" fontWeight="900" textAnchor="middle" fill="#272337">{phase === "failed" ? "Huh? Where’s Yogi?" : phase === "turn" ? "Turning around..." : caption}</text></g>
          </svg>
        </section>
        <aside className={styles.panel}>
          <div className={styles.kicker}>WATCH FIRST</div><h1>Can I reach Yogi?</h1>
          <div className={styles.speech}><span className={styles.face}>▣</span><strong>Let me guess... 5½ turns!</strong></div>
          <div className={styles.progressBox}>
            <div className={styles.progressIcon}>✦</div><div className={styles.progressText}><strong>{status}</strong><div className={styles.bar}><div className={styles.barFill} style={{ transform: `scaleX(${(distance / 130).toFixed(4)})` }}/></div><small>{distance} of 130 cm</small></div>
          </div>
          <div className={`${styles.task} ${elapsed >= TURN_SECONDS ? styles.taskDone : ""}`}><span>1</span><strong>Turn around</strong>{elapsed >= TURN_SECONDS && <b>✓</b>}</div>
          <div className={`${styles.task} ${phase === "drive" ? styles.taskCurrent : ""} ${phase === "failed" ? styles.taskDone : ""}`}><span>2</span><strong>Back up 5½ turns</strong><div className={styles.dots}>{Array.from({length:6},(_,i)=><i key={i} className={turns >= i+0.8 ? styles.dotOn : ""}/>)}</div></div>
          <div className={styles.task}><span>3</span><strong>Reach Yogi?</strong></div>
          {phase === "failed" && <div className={styles.error}>I stopped too early! Help me find out why.</div>}
          <div className={styles.panelBottom}>
            {phase === "failed" ? <button className={styles.primaryOrange} onClick={() => setScreen("calculate")}>Find out why <span>→</span></button> : <button className={styles.primary} onClick={() => setPlaying(x => !x)}>{playing ? "Pause" : "Resume"}</button>}
            <button className={styles.replay} onClick={reset} aria-label="Replay animation">↻</button>
          </div>
        </aside>
      </div>}
    </div>
  </main>;
}
