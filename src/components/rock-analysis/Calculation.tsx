"use client";

import { useEffect, useState } from "react";
import styles from "./RockAnalysis.module.css";

const questions = [
  { title: <>How far do I move in <em>1 wheel turn?</em></>, answer: 20, unit: "cm", help: "One turn covers 24 cm, but the wheel slips backward 4 cm. Subtract the slip.", success: "Yes! 24 − 4 = 20 cm.", high: "Too big! Slipping makes it smaller.", low: "Too small! Subtract only the 4 cm of slip." },
  { title: <>How far do I travel in <em>5½ turns?</em></>, answer: 110, unit: "cm", help: "Multiply the distance per turn (20 cm) by 5.5 turns.", success: "Yes! 5.5 × 20 = 110 cm.", high: "Too big! Remember the wheel slip.", low: "Too small! Multiply by all 5½ turns." },
  { title: <>How many <em>centimeters short</em> did I stop?</>, answer: 20, unit: "cm", help: "Yogi is 130 cm away. Subtract the 110 cm Sojo actually traveled.", success: "Yes! 130 − 110 = 20 cm short.", high: "Too big! Find the difference, not the full distance.", low: "Too small! Subtract the traveled distance from 130 cm." },
];

export default function Calculation({ onFinish }: { onFinish?: () => void }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"idle" | "wrong" | "correct">("idle");
  const [message, setMessage] = useState("Type your answer. Then press Check.");
  const [hint, setHint] = useState(false);
  const question = questions[index];
  const check = () => {
    if (result === "correct") {
      if (index === questions.length - 1) { onFinish?.(); return; }
      setIndex(i => i + 1); setAnswer(""); setResult("idle"); setHint(false);
      setMessage("Type your answer. Then press Check."); return;
    }
    const n = Number(answer);
    if (!answer.trim() || !Number.isFinite(n)) { setResult("wrong"); setMessage("Enter a number first."); return; }
    if (Math.abs(n - question.answer) < 0.0001) {
      setResult("correct"); setMessage(question.success); 
    } else { setResult("wrong"); setMessage(n > question.answer ? question.high : question.low); }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.target as HTMLElement)?.tagName === "INPUT") { e.preventDefault(); check(); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });
  return <div className={styles.layout}>
    <section className={`${styles.scene} ${styles.calcScene}`} aria-label="Wheel slip calculation scene">
      <svg viewBox="0 0 860 740" className={styles.sceneSvg} role="img" aria-label="Yogi rock, Sojourner rover and wheel slip diagram">
        <defs><linearGradient id="calcMars" x2="0" y2="1"><stop stopColor="#d47a47"/><stop offset="1" stopColor="#a54c30"/></linearGradient></defs>
        <rect width="860" height="740" fill="url(#calcMars)"/>
        {[[95,125,7],[766,158,8],[60,320,4],[736,350,5],[812,560,6],[226,660,9]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="#9b4d30" opacity=".5"/>)}
        <image href="/assets/rock-analysis/yogi-rock.svg" x="330" y="70" width="215" height="175"/>
        <rect x="398" y="22" width="66" height="34" rx="17" fill="#fff3db"/><text x="431" y="45" textAnchor="middle" fill="#282432" fontWeight="900" fontSize="18">Yogi</text>
        <circle cx="194" cy="410" r="130" fill="#eba16e" stroke="#fff3dc" strokeWidth="6"/>
        <path d="M70 476 Q130 461 193 482 T319 476 L319 518 Q200 560 90 520Z" fill="#c77b4c"/>
        <g stroke="#f6bb8d" strokeWidth="5" fill="none" strokeLinecap="round"><path d="M100 516q23 -9 47 0M174 533q33 -10 65 0M235 507q25 -10 49 0"/></g>
        <g transform="translate(194 410)"><g className={result === "correct" ? styles.wheelSpin : ""}>
          <circle r="55" fill="#ed8b43" stroke="#23283c" strokeWidth="5"/>
          {[0,90,180,270].map(a=><line key={a} x1="0" y1="-34" x2="0" y2="-52" transform={`rotate(${a})`} stroke="#23283c" strokeWidth="5" strokeLinecap="round"/>)}
          <circle r="15" fill="#fff4dd" stroke="#23283c" strokeWidth="4"/>
        </g></g>
        <path d="M155 345 Q197 306 251 348" fill="none" stroke="#f8c652" strokeWidth="8" strokeLinecap="round"/><path d="M246 329L257 348L233 347" fill="none" stroke="#f8c652" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M323 435 L388 580" fill="none" stroke="#fff0db" strokeWidth="3" strokeDasharray="4 8"/>
        <rect x="74" y="555" width="285" height="49" rx="20" fill="#fff3dc"/><text x="216" y="586" textAnchor="middle" fontSize="19" fontWeight="900" fill="#24283b">Sand makes my wheels slip!</text>
        <image href="/assets/rock-analysis/sojourner-rover.svg" x="366" y="548" width="135" height="180"/>
        {result === "correct" && <g><rect x="560" y="397" width="265" height="57" rx="22" fill="#59c6bd"/><circle cx="590" cy="425" r="18" fill="#164c49"/><text x="590" y="433" textAnchor="middle" fill="#fff" fontSize="24">✓</text><text x="614" y="432" fontSize="19" fontWeight="900" fill="#183b3a">Saved: 1 turn = 20 cm</text></g>}
      </svg>
    </section>
    <aside className={`${styles.panel} ${styles.calcPanel}`}>
      <div className={styles.questionKicker}>QUESTION {index + 1} OF 3</div>
      <div className={styles.questionProgress}>{questions.map((_,i)=><span key={i} className={i <= index ? styles.questionProgressOn : ""}/>)}</div>
      <div className={styles.questionSpeech}><span className={styles.calcFace}>▣</span><div>{question.title}</div></div>
      <div className={styles.slipDiagram}>
        <div className={styles.slipWheel}><span>●</span><small>1 turn</small></div>
        <div className={styles.slipDistance}><div className={styles.slipNote}>slips back 4 cm</div><div className={styles.slipBlocks}><strong>? cm</strong><b>4</b></div><div className={styles.slipMeasure}>1 turn = 24 cm</div></div>
      </div>
      <div className={styles.answerRow}><label htmlFor="rock-answer">Answer:</label><input id="rock-answer" inputMode="decimal" type="number" value={answer} onChange={e=>{setAnswer(e.target.value);if(result === "wrong") {setResult("idle");setMessage("Type your answer. Then press Check.");}}} placeholder="?" disabled={result === "correct"}/><span>{question.unit}</span></div>
      <div className={`${styles.answerFeedback} ${result === "correct" ? styles.feedbackCorrect : result === "wrong" ? styles.feedbackWrong : ""}`} role="status">{message}</div>
      {hint && <div className={styles.hintBox}>{question.help}</div>}
      <div className={styles.panelBottom}>
        <button className={styles.primaryOrange} onClick={check}>{result === "correct" ? index === 2 ? "Finish →" : "Next question →" : "Check"}</button>
        <button className={styles.hintButton} aria-label="Show hint" onClick={()=>setHint(x=>!x)}>♧</button>
      </div>
    </aside>
  </div>;
}
