"use client";
import { useEffect, useRef } from "react";
import styles from "./MissionAccomplished.module.css";
export type MissionPopupName = "landing" | "barnacle" | "soil" | "yogi" | "rescue";
const content = {
 landing: {title:"Safe on Mars",feedback:"Great flying, explorer!",outcome:"Sojo has landed on Mars!",fact:"The real landing was on 4 July 1997."},
 barnacle:{title:"Barnacle Bill reached",feedback:"Great driving, explorer!",outcome:"Sojo is ready to study the rock.",fact:"It was the first rock Sojourner studied."},
 soil:{title:"All 3 sites tested",feedback:"Brilliant digging, scientist!",outcome:"You found the safest ground!",fact:"Sojourner dug into soil with its wheels too."},
 yogi:{title:"Yogi reached",feedback:"Amazing maths, explorer!",outcome:"Sojo?s arm is touching Yogi!",text:"Now Sojo can find out what it?s made of."},
 rescue:{title:"Sojo is free",feedback:"You did it, rescuer!",outcome:"Sojo is safe again.",text:"Sojo can keep exploring Mars."},
} as const;
function Check(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 5 5L20 6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
const cx=(...names:string[])=>names.map(name=>styles[name]).join(" ");
/** Native game UI: actions call the owning mission directly. */
export default function MissionAccomplished({mission,metrics=[],onReplay,onContinue}:{mission:MissionPopupName;metrics?:readonly {label:string;value:number}[];onReplay:()=>void;onContinue:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const next=useRef<HTMLButtonElement>(null);
 const copy=content[mission];
 useEffect(()=>{
  const element=dialog.current,previous=document.activeElement;
  element?.showModal();next.current?.focus();
  return ()=>{element?.close();if(previous instanceof HTMLElement && previous.isConnected)previous.focus();};
 },[]);
 return <dialog ref={dialog} className={styles.dialog} aria-label="Mission accomplished" onCancel={event=>event.preventDefault()} onPointerDown={event=>event.stopPropagation()} onClick={event=>event.stopPropagation()} onKeyDown={event=>event.stopPropagation()}>
  <div className={styles.card}>
   <div className={styles["badge-wrap"]} aria-hidden="true"><div className={styles.burst}/><div className={styles.badge}>
    <div className={styles.rib} style={{left:36,background:"#3fb8a9",transform:"skewX(14deg)"}}/><div className={styles.rib} style={{left:84,background:"#e8793a",transform:"skewX(-14deg)"}}/>
    <div className={styles.disc}>
     {/* eslint-disable-next-line @next/next/no-img-element */}
     <img src="/art/mission-popup/medal-rover.svg" width="84" height="84" alt=""/>
    </div><div className={styles.check}><Check/></div>
   </div></div>
   <h2 className={styles["done-h"]}>Mission accomplished<span className={styles.ex}>!</span></h2>
   <div className={styles["done-name"]}><span className={styles.ic} aria-hidden="true">?</span>{copy.title}</div>
   <p className={styles["done-fb"]}>{copy.feedback}</p>
   <div className={styles.outcome}><div className={styles.art} aria-hidden="true">
    {mission==="soil"?<span className={styles.soil}>?</span>:
     /* eslint-disable-next-line @next/next/no-img-element */
     <img src={`/art/mission-popup/${mission}.svg`} width="92" height="92" alt=""/>}
   </div><div><b>{copy.outcome}</b><span>{"fact" in copy?<><em>Fun fact:</em> {copy.fact}</>:copy.text}</span></div></div>
   {metrics.length>0&&<div className={styles.results} style={{gridTemplateColumns:`repeat(${Math.min(metrics.length,3)},minmax(0,1fr))`}}>{metrics.slice(0,3).map(metric=><div className={styles.metric} key={metric.label}><span className={styles.ic}><Check/></span><strong className={styles.val}>{metric.value}</strong><span className={styles.lbl}>{metric.label}</span></div>)}</div>}
   <div className={styles["done-btns"]}><button type="button" className={cx("btn","btn-ghost")} onClick={onReplay}><span aria-hidden="true">?</span> Play Again</button><button ref={next} type="button" className={cx("btn","btn-primary")} onClick={onContinue}>Continue <span aria-hidden="true">?</span></button></div>
  </div>
 </dialog>;
}
