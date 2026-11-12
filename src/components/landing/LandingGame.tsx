"use client";
import { useLandingGame } from "./useLandingGame";
import {
  InstructionHeader,
  DescentBackground,
  Craft,
  ActionButton,
  Altimeter,
  Timer,
  Feedback,
  Briefing,
  Tutorial,
  ResultScreen,
} from "./parts";
import styles from "./LandingGame.module.css";
export type LandingGameProps = {
  onComplete?: () => void;
  reducedMotion?: boolean;
};
export default function LandingGame({
  onComplete,
  reducedMotion = false,
}: LandingGameProps) {
  const g = useLandingGame();
  const v = g.view;
  return (
    <section className={styles.game} aria-label="Mars landing mini-game">
      <DescentBackground progress={g.progress} reducedMotion={reducedMotion} />
      <div className={styles.playfield}>
        <InstructionHeader index={v.stage} stage={g.stage} />
        <div className={styles.scene}>
          <Craft phase={v.craft} />
        </div>
        <div className={styles.controls}>
          <ActionButton
            stage={g.stage}
            approach={g.approach}
            ready={g.ready}
            late={g.late}
            holdProgress={v.holdProgress}
            disabled={v.phase !== "playing" || v.locked}
            onPress={g.press}
            onRelease={g.release}
          />
          <Timer seconds={g.remaining} />
        </div>
        <Feedback message={v.feedback} />
      </div>
      <Altimeter
        stage={g.stage}
        value={v.value}
        ready={g.ready}
        stable={v.stable}
      />
      {v.phase === "briefing" && <Briefing onStart={g.startBriefing} />}
      {v.phase === "tutorial" && <Tutorial onContinue={g.startPlaying} />}
      {v.phase === "result" && (
        <ResultScreen onAgain={g.reset} onComplete={onComplete} />
      )}
    </section>
  );
}
