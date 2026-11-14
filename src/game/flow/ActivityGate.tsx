import type { ComponentType } from "react";
import type { ActivityId, ActivityResult } from "./story";
export type ActivityProps = { onComplete: (result: ActivityResult) => void; onExit: () => void };
export type ActivityModules = Partial<Record<ActivityId, ComponentType<ActivityProps>>>;

export function ActivityGate({ title, activityId, onComplete, onExit }: ActivityProps & { title: string; activityId: ActivityId }) {
 return <section className="ending-screen activity-gate" aria-labelledby="activity-title">
  <p>NARRATIVE PREVIEW</p><h1 id="activity-title">{title}</h1>
  <p className="activity-description">This part of the journey is a playable sequence.<br />Continue to the next story scene.</p>
  <button className="painted-button" onClick={() => onComplete({ activityId, outcome: "skipped" })}><span>CONTINUE STORY</span></button>
  <button className="activity-exit" onClick={onExit}>RETURN TO TITLE</button>
 </section>;
}
