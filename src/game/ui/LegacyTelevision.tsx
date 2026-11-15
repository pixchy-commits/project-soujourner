"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { ArtId } from "../narrative/types";
import { Artwork } from "../narrative/player/Artwork";
import { licensedMusic } from "../audio/music-library";
import styles from "./LegacyTelevision.module.css";

const findings = [
 { title:"Evidence of ancient water", text:"Rounded pebbles, cobbles and possible conglomerates suggested that liquid water once flowed across the Martian surface. These observations supported the interpretation that Mars had a warmer and wetter past." },
 { title:"Understanding the Martian atmosphere", text:"Meteorological measurements documented dust devils, temperature fluctuations and atmospheric conditions. Pathfinder also observed early morning water-ice clouds." },
 { title:"Magnetic Martian dust", text:"Pathfinder found that airborne dust was magnetic. Researchers suggested that minerals such as maghemite could explain its properties and offer clues about past interactions with water." },
 { title:"Understanding Mars’s interior", text:"Radio tracking helped constrain the planet’s rotational properties and estimates of the size of its metallic core." },
 { title:"Mission data highlights", text:"2.3 billion bits of information · 16,500+ lander images · 550 rover images · 15+ chemical analyses of rocks and soil.", note:"These are combined Pathfinder mission results, not Sojourner alone." },
 { title:"From Sojourner to modern Mars exploration", text:"Pathfinder demonstrated airbag-assisted landing. Sojourner tested mobile robotic exploration and six-wheel rocker-bogie suspension. Spirit and Opportunity developed these ideas further. Curiosity and Perseverance inherited aspects of this mobility approach, but their greater mass required different landing systems." },
] as const;
const sources = [
 { title:"Mars Pathfinder — mission and scientific discoveries", url:"https://science.nasa.gov/mission/mars-pathfinder/" },
 { title:"Sojourner arrives on the Red Planet — mission data", url:"https://www.nasa.gov/image-article/july-4-1997-sojourner-arrives-red-planet/" },
 { title:"Pathfinder on Mars — evidence of a water-rich past", url:"https://science.nasa.gov/resource/pathfinder-on-mars/" },
];

type Props = { archiveArt?:ArtId; mode:"archive"|"findings"|"credits"; paused:boolean; instant:boolean; onNext?:()=>void; onBack?:()=>void; onHome:()=>void };
export function LegacyTelevision({ mode, paused, instant, onNext, onBack, onHome, archiveArt = "ch04-resting-together/wide-rest" }:Props) {
 const [page,setPage] = useState(0);
 const [rolling,setRolling] = useState(true);
 const roll = useRef<HTMLDivElement>(null);
 const viewport = useRef<HTMLDivElement>(null);
 const animation = useRef<gsap.core.Tween|null>(null);
 useEffect(() => {
  if(mode!=="credits" || instant || !roll.current || !viewport.current) return;
  const context = gsap.context(() => {
   animation.current = gsap.fromTo(roll.current,{y:viewport.current!.clientHeight},{y:-roll.current!.scrollHeight,duration:105,ease:"none",delay:1,onComplete:()=>setRolling(false)});
  },viewport);
  return () => { context.revert(); animation.current=null; };
 },[mode,instant]);
 useEffect(() => { animation.current?.paused(paused || !rolling); },[paused,rolling]);
 const item = findings[page];
 const advance = () => { if(paused)return; if(mode==="findings" && page<findings.length-1)setPage(page+1);else onNext?.(); };
 return <section className={styles.stage} aria-label={mode==="credits"?"End credits":mode==="findings"?"What the mission left behind":"Back to the archive"}>
  <div className={styles.heading}><span>SOJOURNER / MISSION ARCHIVE</span><h1>{mode==="credits"?"The people. The science. The journey.":mode==="findings"?"What the mission left behind":"Back to the archive"}</h1></div>
  <div className={`${styles.tv} ${mode==="archive"?styles.arrival:""}`}>
   <div ref={viewport} className={`${styles.screen} ${mode==="credits" && !instant?styles.rollViewport:""}`}>
    {mode==="archive" ? <><Artwork id={archiveArt} /><div className={styles.archiveCaption}>A little rover. An extraordinary journey.<br/><span>1997 · ARES VALLIS, MARS</span></div></>
     : mode==="findings" ? <article key={page} className={styles.finding}><span>MISSION RECORD / {String(page+1).padStart(2,"0")} — {String(findings.length).padStart(2,"0")}</span><h2>{item.title}</h2><p>{item.text}</p>{"note" in item && <small>{item.note}</small>}<a href={sources[page===4?1:0].url} target="_blank" rel="noreferrer">Read the NASA source ↗</a></article>
     : <div ref={roll} className={`${styles.roll} ${instant?styles.staticRoll:""}`}>
      <p className={styles.kicker}>THE LITTLE ROVER THAT NEVER CAME HOME</p><h2>SOJOURNER</h2><p>A story of curiosity, friendship and exploration.</p>
      <h3>Created by</h3><p>The Sojourner team</p><h3>Inspired by a real mission</h3><p>Mars Pathfinder &amp; Sojourner<br/>NASA · Jet Propulsion Laboratory</p>
      <h3>What the mission left behind</h3>{findings.map(f=><div key={f.title}><h4>{f.title}</h4><p>{f.text}</p>{"note" in f && <small>{f.note}</small>}</div>)}
      <h3>Science &amp; archival sources</h3>{sources.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></p>)}
      <h3>Music</h3><p>Music by Scott Buckley<br/>Licensed under CC BY 4.0</p>{Object.values(licensedMusic).map(track=><p key={track.src}><a href={track.source} target="_blank" rel="noreferrer">{track.title}</a></p>)}<p><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">Creative Commons Attribution 4.0</a><br/>In-game volume adjustments and fades.</p>
      <h3>With thanks</h3><p>To the scientists, engineers and explorers<br/>who made a little rover’s journey possible.</p><h2>Thank you for playing.</h2><p>Keep looking up.<br/>Keep exploring.</p><small>Character dialogue and emotional storytelling are fictional.<br/>Mission findings are based on the sources above.</small>
     </div>}
    <div className={styles.scanlines} aria-hidden="true" />
   </div>
   <div className={styles.knobs} aria-hidden="true"><i/><i/><b/><span/></div><span className={styles.brand}>SOJO · COLOUR TELEVISION</span>
  </div>
  <nav className={styles.actions} aria-label="Archive controls">
   {(mode==="findings" && page>0) ? <button disabled={paused} onClick={()=>setPage(page-1)}>← Previous record</button> : onBack && <button disabled={paused} onClick={onBack}>← Back</button>}
   {mode==="credits" ? <><button disabled={paused||instant} onClick={()=>setRolling(v=>!v)}>{rolling?"Pause credits":"Resume credits"}</button><button disabled={paused} onClick={onHome}>Title screen ⌂</button></> : <button disabled={paused} onClick={advance}>{mode==="findings" && page<findings.length-1?"Next record →":"Continue →"}</button>}
  </nav>
 </section>;
}
