import type { ComponentType } from "react";
import type { ActivityId, ActivityResult } from "./story";
import styles from "./Handoff.module.css";
import { InteractionHint } from "../ui/InteractionHint";
export type ActivityProps = { onComplete: (result: ActivityResult) => void; onExit: () => void; paused?: boolean; instant?: boolean };
export type ActivityModules = Partial<Record<ActivityId, ComponentType<ActivityProps>>>;
type Props = ActivityProps & { title: string; activityId: ActivityId; onBack?: () => void; category?: "gameplay" | "mission" | "historical"; description?: string; sourcePage?: number; references?: readonly number[] };
const labels = { gameplay: "GAMEPLAY TEAM HANDOFF", mission: "MISSION UI TEAM HANDOFF", historical: "HISTORICAL POP-UP TEAM HANDOFF" };
export function ActivityGate({ title, activityId, onComplete, onExit, onBack, paused = false, category = "gameplay", description, sourcePage, references = [] }: Props) {
 return <section className={styles.stage} aria-labelledby="activity-title">
  <p className={styles.category}>NARRATIVE PREVIEW · {labels[category]}</p>
  <h1 id="activity-title">{title}</h1>
  <p className={styles.description}>{description ?? "This playable sequence is provided by the gameplay team. Continue to preview the next narrative scene."}</p>
  <p className={styles.meta}>{sourcePage ? `PDF ${[sourcePage, ...references].join(", ")} · ` : ""}Placeholder · Continue does not complete a mission</p>
  <div className={styles.buttons}>
   {onBack && <button className="game-button" disabled={paused} onClick={onBack}>‹ Back</button>}
   <button data-scene-advance className="story-advance" disabled={paused} onClick={() => onComplete({ activityId, outcome: "skipped" })}><InteractionHint /></button>
   <button className="game-button" disabled={paused} onClick={onExit}>Title screen</button>
  </div>
 </section>;
}
