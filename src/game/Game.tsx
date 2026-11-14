"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMachine } from "@xstate/react";
import gsap from "gsap";
import { gameFlow } from "./flow/machine";
import { getStep, resolveCheckpoint, type ActivityResult, type Checkpoint } from "./flow/story";
import { ActivityGate, type ActivityModules } from "./flow/ActivityGate";
import { getScene } from "./narrative/catalog";
import type { SceneShot } from "./narrative/types";
import SceneStage from "./narrative/player/SceneStage";
import { Artwork, type ArtOverrides } from "./narrative/player/Artwork";
import { usePageVisibility, useReducedMotion, useSceneFocus } from "./narrative/player/use-player-environment";
import { useGameStore } from "./state/game-store";
import { useGameEffects } from "./audio/use-game-effects";
import { useNarration } from "./audio/use-narration";
import { useMusic } from "./audio/use-music";
import TitleScreen from "./ui/TitleScreen";
import MusicButton from "./ui/MusicButton";
import GamePanels, { type Panel } from "./ui/GamePanels";
import Dust from "./ui/Dust";

type Props = {
 initialCheckpoint?: Checkpoint;
 previewMode?: boolean;
 artOverrides?: ArtOverrides;
 activities?: ActivityModules;
 onCheckpointChange?: (checkpoint: Checkpoint) => void;
};
export default function Game({ initialCheckpoint, previewMode = false, artOverrides, activities, onCheckpointChange }: Props) {
 const [flow, send] = useMachine(gameFlow);
 const [panel, setPanel] = useState<Panel>(null);
 const [ready, setReady] = useState(false);
 const [busy, setBusy] = useState(false);
 const root = useRef<HTMLElement>(null);
 const curtain = useRef<HTMLDivElement>(null);
 const transition = useRef<gsap.core.Timeline | null>(null);
 const transitionContext = useRef<gsap.Context | null>(null);
 const locked = useRef(false);
 const initial = useRef(initialCheckpoint);
 const data = useGameStore();
 const effects = useGameEffects();
 const narration = useNarration();
 const instant = useReducedMotion(data.reducedMotion);
 const visible = usePageVisibility();
 const title = flow.matches("title");
 const playing = flow.matches("playing");
 const step = getStep(flow.context.stepId);
 const scene = playing && step.kind === "narrative" ? getScene(step.sceneId) : null;
 const shot: SceneShot | null = scene ? scene.shots.find((shot) => shot.id === flow.context.shotId) ?? scene.shots[0] : null;
 const line = shot?.dialogue;
 const paused = busy || panel !== null || !visible;
 const music = useMusic(data.volume, Boolean(line && data.narrationEnabled && !paused));
 const sceneKey = `${flow.value}/${flow.context.stepId}/${flow.context.shotId}`;
 useSceneFocus(sceneKey, paused, root);

 useEffect(() => {
  void Promise.resolve(useGameStore.persist.rehydrate()).catch(() => undefined).finally(() => setReady(true));
  if (initial.current) send({ type: "RESUME", checkpoint: initial.current });
 }, [send]);
 useEffect(() => {
  if (playing) onCheckpointChange?.(flow.context);
  if (!previewMode && playing) useGameStore.getState().saveCheckpoint(flow.context);
  if (!previewMode && flow.matches("complete")) useGameStore.getState().finish();
 }, [playing, flow.context, flow.value, previewMode, flow, onCheckpointChange]);
 useEffect(() => {
  if (instant) return;
  const context = gsap.context(() => {
   const entries = root.current?.querySelectorAll(".scene-enter:not(.archive-stage):not([data-illustration])");
   if (entries?.length) gsap.fromTo(entries, { opacity: 0 }, { opacity: 1, duration: .85, stagger: .1, delay: .2 });
  }, root);
  return () => context.revert();
 }, [sceneKey, instant]);
 useEffect(() => {
  if (line && !paused && data.narrationEnabled) narration.speak(line.text, line.speaker);
  else narration.stop();
  return narration.stop;
 }, [line, paused, data.narrationEnabled, data.narrationVoice, data.narrationVolume, narration.speak, narration.stop]);
 useEffect(() => () => { transition.current?.kill(); transitionContext.current?.revert(); }, []);
 const onType = useCallback((character: boolean) => {
  if (!useGameStore.getState().narrationEnabled) effects.play(character ? "rover" : "type");
 }, [effects.play]);

 function cutTo(action: () => void, mode: "soft" | "memory" | "rewind" = "soft") {
  if (locked.current) return;
  narration.stop();
  if (instant) { action(); return; }
  locked.current = true;
  setBusy(true);
  if (mode !== "soft") effects.play(mode === "rewind" ? "rewind" : "transition");
  if (mode === "soft") {
   action();
   transition.current = gsap.timeline({ onComplete: () => { locked.current = false; setBusy(false); } }).to({}, { duration: .5 });
   return;
  }
  const context = gsap.context(() => {}, root);
  transitionContext.current = context;
  const timeline = gsap.timeline({ onComplete: () => { context.revert(); locked.current = false; setBusy(false); } });
  transition.current = timeline;
  context.add(() => {
   timeline.set(curtain.current, { visibility: "visible", backgroundColor: mode === "memory" ? "#f4e9d6" : "#000" });
   const monitor = root.current?.querySelector("[data-archive-monitor]");
   const picture = root.current?.querySelector("[data-archive-picture]");
   const line = root.current?.querySelector(".crt-shutdown-line");
   if (mode === "rewind" && monitor && picture && line) {
    timeline.to(monitor, { scale: 1.16, duration: .7, ease: "power2.inOut" }, 0)
     .to(picture, { opacity: .45, duration: .15, repeat: 1, yoyo: true }, .12)
     .to(picture, { scaleY: .004, duration: .24, ease: "power3.in" }, .48)
     .to(line, { opacity: 1, scaleX: 1, duration: .06 }, .68)
     .to(line, { scaleX: .002, opacity: 0, duration: .3, ease: "power3.in" }, .78)
     .to(monitor, { scale: 1.7, opacity: 0, duration: .6, ease: "power2.in" }, .82);
   }
   timeline.to(curtain.current, { opacity: 1, duration: mode === "rewind" ? .55 : .4, ease: "power2.inOut" })
    .call(action)
    .to(curtain.current, { opacity: 1, duration: mode === "rewind" ? .65 : .18 })
    .to(curtain.current, { opacity: 0, duration: .7, ease: "power2.out" })
    .set(curtain.current, { visibility: "hidden" });
  });
 }
 function next() {
  let memory = false;
  if (scene && shot) {
   const index = scene.shots.findIndex((candidate) => candidate.id === shot.id);
   memory = scene.shots[index + 1]?.transition === "memory";
  }
  const rewind = scene?.id === "prologue-identification" && shot?.id === "rewind";
  cutTo(() => send({ type: "NEXT" }), rewind ? "rewind" : memory ? "memory" : "soft");
 }
 function home() { cutTo(() => send({ type: "HOME" })); }
 function back() {
  if (flow.context.stepId === "prologue-archive" && flow.context.shotId === "report") home();
  else cutTo(() => send({ type: "BACK" }));
 }
 function start(resume: boolean) {
  const checkpoint = resolveCheckpoint(data.checkpoint);
  cutTo(() => resume ? send({ type: "RESUME", checkpoint }) : send({ type: "START" }));
 }
 function completeActivity(result: ActivityResult) {
  if (!playing || step.kind !== "activity" || result.activityId !== step.activityId || locked.current) return;
  cutTo(() => {
   if (!previewMode) useGameStore.getState().recordActivity(result);
   send({ type: "ACTIVITY_COMPLETE", activityId: result.activityId });
  });
 }
 const Activity = step.kind === "activity" ? activities?.[step.activityId] : undefined;
 return <main ref={root} className={`game ${title ? "menu" : "cutscene"} ${instant ? "motion-off" : ""}`} aria-busy={busy} onClickCapture={(event) => {
  if ((event.target as Element).closest("button:not(:disabled)")) effects.click();
 }}>
  <div className={`landscape ${shot?.kind === "archive" ? "archive-backdrop" : ""}`} aria-hidden="true">{!title && shot && <Artwork key={shot.kind === "archive" ? "archive-room" : shot.art} id={shot.kind === "archive" ? "archive-room" : shot.art} overrides={artOverrides} />}</div><div className="vignette" aria-hidden="true" /><div className="grain" aria-hidden="true" />
  <Dust paused={instant || !title} />
  <MusicButton muted={music.muted} onClick={music.toggle} />
  {title ? <TitleScreen ready={ready} hasSave={Boolean(data.checkpoint)} busy={busy} onStart={start} onOpenPanel={setPanel} />
   : scene && shot ? <SceneStage key={shot.kind === "archive" ? "archive-stage" : shot.kind === "illustration" ? "illustration-stage" : `${scene.id}/${shot.id}`} scene={scene} shot={shot} paused={paused} instant={instant} artOverrides={artOverrides} onNext={next} onBack={back} onHome={home} onType={onType} />
   : playing && step.kind === "activity" ? (Activity ? <Activity onComplete={completeActivity} onExit={home} /> : <ActivityGate title={step.title} activityId={step.activityId} onComplete={completeActivity} onExit={home} />)
   : <section className="ending-screen"><p className="scene-enter">CHAPTERS 1–2</p><h1 className="scene-enter">A little rover.<br />A new beginning.</h1><p className="preview-end scene-enter">END OF NARRATIVE PREVIEW</p><button className="painted-button scene-enter" disabled={busy} onClick={home}><span>TITLE SCREEN</span></button></section>}
  <div ref={curtain} className="scene-curtain" aria-hidden="true" />
  <GamePanels panel={panel} onClose={() => setPanel(null)} muted={music.muted} onToggleMusic={music.toggle} narration={narration} />
 </main>;
}
