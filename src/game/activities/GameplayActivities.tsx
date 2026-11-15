"use client";
import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";
import type { ActivityModules, ActivityProps } from "../flow/ActivityGate";
import type { ActivityId } from "../flow/story";
import MissionPopupGate from "@/components/MissionPopupGate";
import HistoricalRecord, { type HistoricalId } from "./HistoricalRecord";
import styles from "./GameplayActivities.module.css";
const Landing = dynamic(() => import("@/components/landing/LandingGame"), { ssr:false });
const Rover = dynamic(() => import("@/components/rover/RoverGame"), { ssr:false });
const Wheels = dynamic(() => import("@/components/wheel-test/WheelTest"), { ssr:false });
const Analysis = dynamic(() => import("@/components/rock-analysis/RockAnalysis"), { ssr:false });
const Rescue = dynamic(() => import("@/components/rescue-sojo/RescueSojo"), { ssr:false });

function Frame({ children, paused, onExit, onBack }: ActivityProps & {children:ReactNode}) {
 return <section className={styles.stage} aria-label="Playable mission">
  <div className={styles.content} inert={paused}>{children}</div>
  <nav className={styles.navigation} aria-label="Story navigation">
   {onBack && <button type="button" disabled={paused} onClick={onBack}>Back</button>}
   <button type="button" disabled={paused} onClick={onExit}>Title screen</button>
  </nav>
  {paused && <div className={styles.paused} role="status">Mission paused</div>}
 </section>;
}
function useCompletion(id:ActivityId, props:ActivityProps) {
 const completed = useRef(false);
 return () => {
  if (completed.current || props.paused) return;
  completed.current = true;
  props.onComplete({activityId:id,outcome:"completed"});
 };
}
function LandingActivity(props:ActivityProps) {
 const finish=useCompletion("landing",props);
 return <Frame {...props}><MissionPopupGate mission="landing"><Landing paused={props.paused} onHome={props.onExit} onComplete={finish}/></MissionPopupGate></Frame>;
}
function driving(id:ActivityId, missionNumber:1|2|3|4) {
 return function DrivingActivity(props:ActivityProps) {
  const finish=useCompletion(id,props);
  return <Frame {...props}><Rover missionNumber={missionNumber} paused={props.paused} reducedMotion={props.instant} onMissionComplete={finish}/></Frame>;
 };
}
function WheelsActivity(props:ActivityProps) {
 const finish=useCompletion("wheel-test",props);
 // The inner game's result screen owns Replay/Next; completion alone must not skip it.
 return <Frame {...props}><MissionPopupGate mission="soil"><Wheels paused={props.paused} onHome={props.onExit} onNext={finish}/></MissionPopupGate></Frame>;
}
function analysis(id:ActivityId, mission:"yogi"|"barnacle-bill") {
 return function AnalysisActivity(props:ActivityProps) {
  const finish=useCompletion(id,props);
  return <Frame {...props}><Analysis mission={mission} paused={props.paused} onNext={finish}/></Frame>;
 };
}
function RescueActivity(props:ActivityProps) {
 const finish=useCompletion("yogi-rescue",props);
 return <Frame {...props}><MissionPopupGate mission="rescue"><Rescue paused={props.paused} onComplete={finish}/></MissionPopupGate></Frame>;
}
function historical(id:HistoricalId) {
 return function HistoricalActivity(props:ActivityProps) {
  const finish=useCompletion(id,props);
  return <Frame {...props}><HistoricalRecord {...props} id={id} onComplete={finish}/></Frame>;
 };
}
export const gameplayActivities:ActivityModules = {
 "opening-history":historical("opening-history"),
 "primary-mission-history":historical("primary-mission-history"),
 "yogi-failed":historical("yogi-failed"),
 "extended-mission-history":historical("extended-mission-history"),
 landing:LandingActivity,
 "exploration-barnacle-bill":driving("exploration-barnacle-bill",1),
 "travel-yogi-viewpoint":driving("travel-yogi-viewpoint",2),
 "travel-yogi":driving("travel-yogi",3),
 "travel-yogi-other-side":driving("travel-yogi-other-side",4),
 "rock-analysis":analysis("rock-analysis","barnacle-bill"),
 "wheel-test":WheelsActivity,
 "yogi-rescue":RescueActivity,
 "yogi-analysis-attempt":analysis("yogi-analysis-attempt","yogi"),
 "yogi-final-analysis":analysis("yogi-final-analysis","yogi"),
};
