"use client";

import { useEffect, useState } from "react";
import styles from "./RockAnalysis.module.css";

const questions = [
  { title: <>How far do I move in <em>1 wheel turn?</em></>, answer: 20, unit: "cm", help: "One turn covers 24 cm, but the wheel slips backward 4 cm. Subtract the slip.", success: "Yes! 24 − 4 = 20 cm.", high: "Too big! Slipping makes it smaller.", low: "Too small! Subtract only the 4 cm of slip." },
  { title: <>How far do I need to <em>drive?</em></>, answer: 130, unit: "cm", help: "The gap to Yogi is 136 cm, but my arm reaches 6 cm. Subtract the arm reach from the gap.", success: "Yes! 136 − 6 = 130 cm.", high: "Not quite. Try 136 take away 6.", low: "Not quite. The driving distance is the gap minus my 6 cm arm reach." },
  { title: <>How many <em>wheel turns</em> do I need?</>, answer: 6.5, unit: "turns", help: "You need to drive 130 cm. Each wheel turn moves Sojo 20 cm. Divide 130 by 20; half turns are allowed.", success: "Yes! 6½ turns. I’m ready!", high: "That is too many turns. Divide 130 by 20.", low: "Not quite enough turns. Try 130 ÷ 20." },
];

export default function Calculation({ onFinish }: { onFinish?: () => void }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [turns, setTurns] = useState(0);
  const [result, setResult] = useState<"idle" | "wrong" | "correct">("idle");
  const [message, setMessage] = useState("Type your answer. Then press Check.");
  const [hint, setHint] = useState(false);
  const question = questions[index];
  const check = () => {
    if (result === "correct") {
      if (index === questions.length - 1) { onFinish?.(); return; }
      setIndex(i => i + 1); setAnswer(""); setResult("idle"); setHint(false);
      setMessage(index === 1 ? "Tap + until the bar hits the yellow line." : "Type your answer. Then press Check."); return;
    }
    const n = index === 2 ? turns : Number(answer);
    if ((index !== 2 && !answer.trim()) || !Number.isFinite(n)) { setResult("wrong"); setMessage("Enter a number first."); return; }
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
    <section className={`${styles.scene} ${styles.calcScene}`} aria-label="Rock analysis calculation scene">
      <svg viewBox="0 0 860 740" className={styles.sceneSvg} role="img" aria-label="Yogi rock, Sojourner rover and wheel slip diagram">
        <defs><linearGradient id="calcMars" x2="0" y2="1"><stop stopColor="#d47a47"/><stop offset="1" stopColor="#a54c30"/></linearGradient></defs>
        <rect width="860" height="740" fill="url(#calcMars)"/>
        {[[95,125,7],[766,158,8],[60,320,4],[736,350,5],[812,560,6],[226,660,9]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="#9b4d30" opacity=".5"/>)}
        <image href="/assets/rock-analysis/yogi-rock.svg" x="330" y="70" width="215" height="175"/>
        <rect x="398" y="22" width="66" height="34" rx="17" fill="#fff3db"/><text x="431" y="45" textAnchor="middle" fill="#282432" fontWeight="900" fontSize="18">Yogi</text>
        {index === 2 ? <>
          {/* Each block is one full wheel turn (20 cm). The seventh block
              is half-filled at the correct 6.5 turns; turns 7–8 visibly
              continue above the destination and turn red. */}
          <line x1="328" y1="269.5" x2="725" y2="269.5" stroke="#fff0db" strokeWidth="3" strokeDasharray="5 7"/>
          <line x1="328" y1="575" x2="725" y2="575" stroke="#fff0db" strokeWidth="3" strokeDasharray="5 7" opacity=".7"/>
          <line x1="640" y1="269.5" x2="640" y2="575" stroke="#fff0db" strokeWidth="3"/>
          {Array.from({length: 7}, (_, i) => { const y = 575 - i * 47; return <g key={i}><line x1="630" y1={y} x2="658" y2={y} stroke="#fff0db" strokeWidth="2"/><text x="620" y={y+5} textAnchor="end" fill="#fff0db" fontSize="14" fontWeight="900">{i*20}</text></g>; })}
          <line x1="328" y1="269.5" x2="725" y2="269.5" stroke="#f8c64e" strokeWidth="5" strokeLinecap="round"/>
          {Array.from({length: 8}, (_, i) => {
            const x = 663;
            const y = 575 - (i + 1) * 47 + 3;
            const height = 41;
            const fraction = Math.max(0, Math.min(1, turns - i));
            const filledHeight = fraction * height;
            const aboveTarget = i >= 7;
            const partialOvershoot = i === 6;
            return <g key={i}>
              {fraction > 0 && <>
                <rect x={x+1.5} y={y+height-filledHeight} width="20" height={filledHeight} rx={filledHeight >= 14 ? 5 : 1} fill={aboveTarget ? "#f16a64" : "#59c6bd"}/>
                {partialOvershoot && fraction > .5 && <rect x={x+1.5} y={y+height-filledHeight} width="20" height={(fraction-.5)*height} rx="4" fill="#f16a64"/>}
              </>}
              {fraction > 0 && <rect x={x} y={y} width="23" height={height} rx="7" fill="none" stroke="#242a3b" strokeWidth="2"/>}
              {fraction > 0 && <><circle cx="711" cy={y+height/2} r="14" fill={aboveTarget || (partialOvershoot && fraction > .5) ? "#f16a64" : "#59c6bd"} stroke="#242a3b" strokeWidth="2"/><text x="711" y={y+height/2+5} fontSize="15" fontWeight="900" textAnchor="middle" fill="#25283b">{i+1}</text></>}
            </g>;
          })}
          <rect x="730" y="251" width="108" height="36" rx="16" fill="#f8c64e"/><text x="784" y="275" fill="#25283b" fontSize="16" fontWeight="900" textAnchor="middle">Stop here!</text>
          <rect x="68" y="614" width="240" height="43" rx="16" fill="#fff3dc"/><text x="86" y="642" fill="#25283b" fontSize="18" fontWeight="900">Each + is ½ turn!</text>
          <image href="/assets/rock-analysis/sojourner-rover.svg" x="365" y="565" width="135" height="170"/>
          {result === "correct" && <g><rect x="520" y="665" width="285" height="44" rx="18" fill="#59c6bd"/><text x="662" y="693" fill="#163c3a" fontSize="19" fontWeight="900" textAnchor="middle">✓ Saved: 6½ wheel turns</text></g>}
          <rect x="740" y="370" width="107" height="57" rx="19" fill="#fff3dc"/><text x="794" y="392" fill="#25283b" fontSize="17" fontWeight="900" textAnchor="middle">130 cm</text><text x="794" y="411" fill="#25283b" fontSize="13" fontWeight="900" textAnchor="middle">to drive</text>
          <rect x="68" y="614" width="240" height="43" rx="16" fill="#fff3dc"/><text x="86" y="642" fill="#25283b" fontSize="18" fontWeight="900">Each + is ½ turn!</text>
          <image href="/assets/rock-analysis/sojourner-rover.svg" x="365" y="565" width="135" height="170"/>
          {result === "correct" && <g><rect x="520" y="665" width="285" height="44" rx="18" fill="#59c6bd"/><text x="662" y="693" fill="#163c3a" fontSize="19" fontWeight="900" textAnchor="middle">✓ Saved: 6½ wheel turns</text></g>}
        </> : index === 1 ? <>
          <line x1="328" y1="246" x2="685" y2="246" stroke="#fff1da" strokeWidth="3" strokeDasharray="6 9"/>
          <line x1="328" y1="565" x2="685" y2="565" stroke="#fff1da" strokeWidth="3" strokeDasharray="6 9" opacity=".65"/>
          <rect x="574" y="260" width="23" height="305" rx="9" fill="#59c6bd" stroke="#25283b" strokeWidth="3"/>
          <rect x="573" y="246" width="25" height="15" rx="5" fill="#f8c34d" stroke="#25283b" strokeWidth="3"/>
          <line x1="628" y1="246" x2="628" y2="565" stroke="#fff2df" strokeWidth="4"/>
          <line x1="611" y1="246" x2="647" y2="246" stroke="#fff2df" strokeWidth="4"/>
          <line x1="611" y1="565" x2="647" y2="565" stroke="#fff2df" strokeWidth="4"/>
          <g><rect x="660" y="200" width="200" height="42" rx="18" fill="#f8c64e"/><text x="762" y="228" textAnchor="middle" fill="#24273a" fontWeight="900" fontSize="17">6 cm: my arm reaches</text></g>
          {result === "correct" ? <g><rect x="200" y="396" width="235" height="42" rx="18" fill="#5ac7bd"/><text x="315" y="423" textAnchor="middle" fill="#1b3e40" fontWeight="900" fontSize="19">✓ Saved: drive 130 cm</text></g> : <g><rect x="200" y="396" width="130" height="42" rx="18" fill="#5ac7bd"/><text x="263" y="423" textAnchor="middle" fill="#1b3e40" fontWeight="900" fontSize="19">? cm I drive</text></g>}
          <rect x="678" y="395" width="148" height="50" rx="19" fill="#fff3df"/><text x="752" y="427" textAnchor="middle" fill="#27283b" fontWeight="900" fontSize="23">136 cm gap</text>
          <rect x="72" y="625" width="253" height="48" rx="18" fill="#fff3df"/><text x="88" y="656" fill="#25283b" fontSize="20" fontWeight="900">My arm can reach 6 cm!</text>
          <image href="/assets/rock-analysis/sojourner-rover.svg" x="365" y="565" width="135" height="170"/>
          
        </> : <>        <circle cx="194" cy="410" r="130" fill="#eba16e" stroke="#fff3dc" strokeWidth="6"/>
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
        </>}
      </svg>
    </section>
    <aside className={`${styles.panel} ${styles.calcPanel}`}>
      <div className={styles.questionKicker}>QUESTION {index + 1} OF 3</div>
      <div className={styles.questionProgress}>{questions.map((_,i)=><span key={i} className={i < index ? styles.questionProgressDone : i === index ? styles.questionProgressOn : ""}/>)}</div>
      <div className={styles.questionSpeech}><span className={styles.calcFace}>▣</span><div>{question.title}</div></div>
      {index === 2 ? <div className={styles.turnFacts}><div><small>Drive</small><strong>130 cm</strong></div><div><small>1 turn</small><strong>20 cm</strong></div></div> : index === 1 ? <div className={styles.sensorDiagram}>
        <div className={styles.sensorRover} aria-hidden="true">▣</div>
        <div className={styles.sensorDistance}>
          <div className={styles.sensorBlocks}><strong>? cm</strong><b>6</b></div>
          <div className={styles.sensorMeasure}>Gap to Yogi = 136 cm</div>
        </div>
        <div className={styles.sensorRock} aria-hidden="true">◧<small>arm 6</small></div>
      </div> : <div className={styles.slipDiagram}>
        <div className={styles.slipWheel}><span>●</span><small>1 turn</small></div>
        <div className={styles.slipDistance}><div className={styles.slipNote}>slips back 4 cm</div><div className={styles.slipBlocks}><strong>? cm</strong><b>4</b></div><div className={styles.slipMeasure}>1 turn = 24 cm</div></div>
      </div>}
      {index === 2 ? <div className={styles.turnSelector}><p>Tap + until the bar hits the yellow line.</p><div className={styles.turnControls}><button type="button" disabled={result === "correct" || turns <= 0} onClick={() => {setTurns(t => Math.max(0,t-.5));setResult("idle");setMessage("At the yellow line? Press Check.");}} aria-label="Decrease by half a turn">−</button><output aria-live="polite">{turns}</output><button type="button" disabled={result === "correct" || turns >= 8} onClick={() => {setTurns(t => Math.min(8,t+.5));setResult("idle");setMessage("At the yellow line? Press Check.");}} aria-label="Increase by half a turn">+</button></div><div className={styles.turnEquation}>{turns} turns × 20 cm = <strong>{turns*20} cm</strong></div></div> : <div className={styles.answerRow}><label htmlFor="rock-answer">Answer:</label><input id="rock-answer" inputMode="decimal" type="number" value={answer} onChange={e=>{setAnswer(e.target.value);if(result === "wrong") {setResult("idle");setMessage("Type your answer. Then press Check.");}}} placeholder="?" disabled={result === "correct"}/><span>{question.unit}</span></div>}
      <div className={`${styles.answerFeedback} ${result === "correct" ? styles.feedbackCorrect : result === "wrong" ? styles.feedbackWrong : ""}`} role="status">{message}</div>
      {hint && <div className={styles.hintBox}>{question.help}</div>}
      <div className={styles.panelBottom}>
        <button className={styles.primaryOrange} onClick={check}>{result === "correct" ? index === 2 ? "Next: Position →" : "Next question →" : "Check"}</button>
        <button className={styles.hintButton} aria-label="Show hint" onClick={()=>setHint(x=>!x)}>♧</button>
      </div>
    </aside>
  </div>;
}
