import type { LandingStage, CraftPhase } from "./stages";
import { RING_MAX } from "./stages";
import styles from "./LandingGame.module.css";
export function InstructionHeader({
  index,
  stage,
}: {
  index: number;
  stage: LandingStage;
}) {
  return (
    <header className={styles.instructions}>
      <span className={styles.eyebrow}>LANDING · {index + 1} OF 4</span>
      <h1>{stage.title}</h1>
      <p>{stage.description}</p>
    </header>
  );
}

export function DescentBackground({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={styles.background}
      style={{
        "--descent": String(progress),
        "--motion": reducedMotion ? "0" : "1",
      } as React.CSSProperties}
    >
      <div className={styles.streaks} />
      <div className={styles.dust} />
      <div className={styles.surface} />
    </div>
  );
}

export function Craft({ phase }: { phase: CraftPhase }) {
  return (
    <div
      className={`${styles.craft} ${styles[phase]}`}
      aria-label={`Spacecraft: ${phase}`}
      role="img"
    >
      <div className={styles.parachute} />
      <div className={styles.cords} />
      <div className={styles.capsule}>
        <div className={styles.window} />
      </div>
      <div className={styles.airbagsShape} />
      <div className={styles.rocketFlame} />
    </div>
  );
}
export function ActionButton({
  stage,
  approach,
  ready,
  late,
  holdProgress,
  disabled,
  onPress,
  onRelease,
}: {
  stage: LandingStage;
  approach: number;
  ready: boolean;
  late: boolean;
  holdProgress: number;
  disabled: boolean;
  onPress: () => void;
  onRelease: () => void;
}) {
  return (
    <div className={styles.actionArea}>
      <p className={styles.hint}>{stage.hint}</p>
      <div className={styles.ringWrap}>
        <div className={styles.targetRing} />
        <div
          className={`${styles.approachRing} ${ready ? styles.ready : late ? styles.late : ""}`}
          style={{ transform: `scale(${1 + (1 - approach) * (RING_MAX - 1)})` }}
        />
        <button
          className={styles.action}
          disabled={disabled}
          onPointerDown={(e) => {
            e.preventDefault();
            onPress();
          }}
          onPointerUp={onRelease}
          onPointerCancel={onRelease}
          onPointerLeave={onRelease}
          aria-label={stage.label}
          style={{ "--hold": `${holdProgress * 100}%` } as React.CSSProperties}
        >
          <span>{stage.icon}</span>
          <strong>{stage.label}</strong>
        </button>
      </div>
    </div>
  );
}
export function Altimeter({
  stage,
  value,
  ready,
  stable,
}: {
  stage: LandingStage;
  value: number;
  ready: boolean;
  stable: boolean;
}) {
  const span = stage.high - stage.low;
  const fraction = Math.max(0, Math.min(1, (value - stage.low) / span));
  return (
    <aside
      className={`${styles.altimeter} ${ready ? styles.altReady : ""}`}
      aria-label="Altitude"
    >
      <small>ALTITUDE</small>
      <strong>
        {value.toFixed(stage.unit === "km" ? 1 : 0)} {stage.unit}
      </strong>
      <span>
        {stage.ideal === 0
          ? stable
            ? "READY TO OPEN"
            : "WAIT FOR STILLNESS"
          : `TARGET · ${stage.ideal} ${stage.unit}`}
      </span>
      <div className={styles.gauge}>
        <div
          className={styles.gaugeFill}
          style={{ height: `${fraction * 100}%` }}
        />
        <div
          className={styles.gaugeZone}
          style={{
            bottom: `${((stage.winLow - stage.low) / span) * 100}%`,
            height: `${((stage.winHigh - stage.winLow) / span) * 100}%`,
          }}
        />
        <div
          className={styles.gaugeMarker}
          style={{ bottom: `${fraction * 100}%` }}
        />
      </div>
    </aside>
  );
}
export function Timer({ seconds }: { seconds: number }) {
  return (
    <div className={styles.timer}>
      <small>TIME LEFT</small>
      <strong>{seconds.toFixed(1)} s</strong>
    </div>
  );
}
export function Feedback({ message }: { message: string }) {
  return (
    <div className={styles.feedback} role="status">
      {message}
    </div>
  );
}
export function Briefing({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.overlay}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="landing-brief-title"
      >
        <span className={styles.eyebrow}>
          MARS PATHFINDER · MISSION BRIEFING
        </span>
        <h2 id="landing-brief-title">🚀 Let’s land on Mars!</h2>
        <p>
          You are the mission controller. Help the spacecraft land safely in
          four steps.
        </p>
        <ol>
          <li>🪂 Parachute at 10 km</li>
          <li>🎈 Airbags at 350 m</li>
          <li>🔥 Rockets at 90 m</li>
          <li>🛬 Open the lander after the bounce</li>
        </ol>
        <p>
          Watch the shrinking ring. Press when it turns green. Early presses are
          safe to retry!
        </p>
        <button autoFocus onClick={onStart}>
          START MISSION →
        </button>
      </div>
    </div>
  );
}
export function Tutorial({ onContinue }: { onContinue: () => void }) {
  return (
    <div className={styles.overlay}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="landing-tut-title"
      >
        <span className={styles.eyebrow}>STEP 1 OF 4</span>
        <h2 id="landing-tut-title">🪂 Open the parachute</h2>
        <p>
          Watch the altitude bar as we fall toward 10 km. The ring around the
          big button shrinks as we get closer.
        </p>
        <p>
          When the ring touches the button and turns green,{" "}
          <strong>press and HOLD</strong> until the edge fills up.
        </p>
        <p>Pressed too early? Just try again!</p>
        <button autoFocus onClick={onContinue}>
          CONTINUE →
        </button>
      </div>
    </div>
  );
}
export function ResultScreen({
  onAgain,
  onComplete,
}: {
  onAgain: () => void;
  onComplete?: () => void;
}) {
  return (
    <div className={styles.overlay}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="landing-result-title"
      >
        <span className={styles.eyebrow}>MARS PATHFINDER</span>
        <h2 id="landing-result-title">We’ve landed on Mars!</h2>
        <p>Sojourner’s adventure is about to begin.</p>
        <button onClick={onAgain}>PLAY AGAIN ↻</button>
        {onComplete && <button onClick={onComplete}>CONTINUE STORY →</button>}
      </div>
    </div>
  );
}
