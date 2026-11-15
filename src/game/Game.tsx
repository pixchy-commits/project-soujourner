"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMachine } from "@xstate/react";
import gsap from "gsap";
import { gameFlow } from "./flow/machine";
import { getStep, resolveCheckpoint, type ActivityResult, type Checkpoint } from "./flow/story";
import { ActivityGate, type ActivityModules } from "./flow/ActivityGate";
import { narrativeActivities } from "./narrative/missions/BarnacleMission";
import { chapterPhotos } from "./narrative/art/chapter-photos";
import { getScene } from "./narrative/catalog";
import type { SceneShot } from "./narrative/types";
import SceneStage from "./narrative/player/SceneStage";
import { Artwork, type ArtOverrides } from "./narrative/player/Artwork";
import { usePageVisibility, useReducedMotion, useSceneFocus } from "./narrative/player/use-player-environment";
import { useGameStore } from "./state/game-store";
import { useGameEffects } from "./audio/use-game-effects";
import { useNarration } from "./audio/use-narration";
import { useMusic } from "./audio/use-music";
import { sceneScore } from "./audio/score";
import { ambienceFor, useSceneAmbience } from "./audio/use-scene-ambience";
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
 const voiceActive = Boolean(line && data.narrationEnabled && !paused);
 const music = useMusic(data.volume, voiceActive || busy || panel !== null, sceneScore(step.id, flow.context.shotId, title), !visible);
 useSceneAmbience(ambienceFor(scene?.id === "ch02-earth-flashback" && shot?.id === "blink" ? "ch01-first-look" : step.id), effects.unlocked && visible && playing && panel === null, data.soundVolume, voiceActive || busy);
 const lastAudioScene = useRef("");
 const sceneKey = `${flow.value}/${flow.context.stepId}/${flow.context.shotId}`;
 useEffect(() => {
  if (!playing || paused || !effects.unlocked) return;
  const key = `${step.id}/${shot?.id ?? "activity"}`;
  if (lastAudioScene.current === key) return;
  lastAudioScene.current = key;
  if (shot?.kind === "chapter") effects.play("chapter");
  else if (step.id === "ch02-celebration") effects.play("success");
  else if (step.id === "ch01-pathfinder-friendship" && line?.speaker === "PATHFINDER") effects.play("radio");
 }, [playing, paused, effects.unlocked, effects.play, step.id, shot?.id, shot?.kind, line?.speaker]);
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
  if (!useGameStore.getState().narrationEnabled) effects.play(character ? (line?.speaker === "PATHFINDER" ? "pathfinder" : "rover") : "type");
 }, [effects.play, line?.speaker]);

 function cutTo(action: () => void, mode: "soft" | "memory" | "rewind" = "soft") {
  if (locked.current) return;
  narration.stop();
  if (instant) { action(); return; }
  locked.current = true;
  setBusy(true);
  if (mode !== "soft") effects.play(mode === "rewind" ? "rewind" : "memory");
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
   const portalPicture = root.current?.querySelector<HTMLElement>("[data-archive-picture]");
   if (mode === "rewind" && portalPicture && root.current) {
    const stage = root.current;
    const frame = portalPicture.getBoundingClientRect();
    const bounds = stage.getBoundingClientRect();
    const flight = document.createElement("div");
    flight.className = "tv-portal-flight";
    flight.setAttribute("aria-hidden", "true");
    const copy = portalPicture.cloneNode(true) as HTMLElement;
    copy.removeAttribute("data-archive-picture");
    copy.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:hidden;";
    const beam = document.createElement("div");
    beam.className = "tv-crt-beam";
    const spark = document.createElement("div");
    spark.className = "tv-crt-spark";
    flight.append(copy, beam);
    stage.append(flight);
    stage.append(spark);
    context.add(() => () => { flight.remove(); spark.remove(); });
    const centerX = frame.left - bounds.left + frame.width / 2;
    const centerY = frame.top - bounds.top + frame.height / 2;
    const revealScale = Math.hypot(bounds.width, bounds.height) / 20;
    const room = stage.querySelector(".archive-backdrop");
    const monitor = stage.querySelector(".archive-stage");
    const chrome = stage.querySelectorAll(".dialogue-box, .cutscene-controls, .letterbox");
    timeline.set(flight, { left: frame.left - bounds.left, top: frame.top - bounds.top, width: frame.width, height: frame.height, transformOrigin: "50% 50%", borderRadius: 28 })
     .set(spark, { left: centerX, top: centerY, xPercent: -50, yPercent: -50, scale: .1, opacity: 0 })
     .set(beam, { opacity: 0 })
     .to(chrome, { opacity: 0, duration: .25 }, 0)
     .to(copy, { skewX: 2, scaleX: 1.035, filter: "brightness(1.4) saturate(.65)", duration: .16, ease: "sine.inOut" }, .08)
     .to(copy, { skewX: -1, scaleY: .93, duration: .12 }, .24)
     .to(monitor, { opacity: 0, duration: .2 }, .36)
     .to(copy, { skewX: 0, scaleX: 1.08, scaleY: .004, filter: "brightness(3) saturate(0)", duration: .32, ease: "power3.in" }, .38)
     .to(beam, { opacity: 1, duration: .07 }, .64)
     .to(copy, { opacity: 0, duration: .08 }, .7)
     .to(beam, { scaleX: .002, duration: .3, ease: "power3.in" }, .76)
     .to(room, { opacity: .15, duration: .45 }, .64)
     .to(spark, { opacity: 1, scale: 1, duration: .12 }, .98)
     .set(flight, { opacity: 0 }, 1.08)
     .call(action, [], 1.1)
     .to(spark, { x: bounds.width / 2 - centerX, y: bounds.height / 2 - centerY, scale: revealScale, duration: .45, ease: "power3.in" }, 1.12)
     .to(spark, { opacity: 0, duration: .55, ease: "power2.out" }, 1.43);
    return;
   }
   timeline.set(curtain.current, { visibility: "visible", backgroundColor: mode === "memory" ? "#f4e9d6" : "#000" });
   const memoryEyes = root.current?.querySelector("[data-memory-eyes]");
   if (mode === "memory" && memoryEyes) {
    timeline.to(memoryEyes, { scale: 1.8, transformOrigin: "50% 42%", duration: .7, ease: "power3.in" });
   }
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
 const Activity = step.kind === "activity" ? activities?.[step.activityId] ?? narrativeActivities[step.activityId] : undefined;
 const backdropArt = shot?.kind === "archive" ? "archive-room" : shot?.kind === "chapter" ? chapterPhotos[shot.number] ?? shot.art : shot?.art;
 return <main ref={root} className={`game ${title ? "menu" : "cutscene"} ${instant ? "motion-off" : ""}`} aria-busy={busy} onClickCapture={(event) => {
  if ((event.target as Element).closest("button:not(:disabled)")) effects.click();
 }}>
  <div className={`landscape ${shot?.kind === "archive" ? "archive-backdrop" : ""}`} aria-hidden="true">{!title && backdropArt && <Artwork key={backdropArt} id={backdropArt} overrides={artOverrides} fit={shot?.kind === "chapter" ? "cover" : undefined} />}</div><div className="vignette" aria-hidden="true" /><div className="grain" aria-hidden="true" />
  <Dust paused={instant || !title} />
  <MusicButton muted={music.muted} onClick={music.toggle} />
  {title ? <TitleScreen ready={ready} hasSave={Boolean(data.checkpoint)} busy={busy} onStart={start} onOpenPanel={setPanel} />
   : scene && shot ? <SceneStage key={shot.kind === "archive" ? "archive-stage" : shot.kind === "illustration" ? "illustration-stage" : `${scene.id}/${shot.id}`} scene={scene} shot={shot} paused={paused} instant={instant} artOverrides={artOverrides} onNext={next} onBack={back} onHome={home} onType={onType} onMontageSound={effects.play} />
   : playing && step.kind === "activity" ? (Activity ? <Activity key={step.id} onComplete={completeActivity} onExit={home} paused={paused} instant={instant} /> : <ActivityGate title={step.title} activityId={step.activityId} onComplete={completeActivity} onExit={home} />)
   : <section className="ending-screen"><p className="scene-enter">CHAPTERS 1–2</p><h1 className="scene-enter">A little rover.<br />A new beginning.</h1><p className="preview-end scene-enter">END OF NARRATIVE PREVIEW</p><button className="painted-button scene-enter" disabled={busy} onClick={home}><span>TITLE SCREEN</span></button></section>}
  <div ref={curtain} className="scene-curtain" aria-hidden="true" />
  <GamePanels panel={panel} onClose={() => setPanel(null)} muted={music.muted} onToggleMusic={music.toggle} narration={narration} />
 </main>;
}
