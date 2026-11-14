"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMachine } from "@xstate/react";
import { Howl } from "howler";
import gsap from "gsap";
import { chapters, narrativeMachine } from "@/lib/narrative";
import { useGameStore } from "@/lib/game-store";
import Dust from "./dust";
import RoverGame from "./rover/RoverGame";
import LandingGame from "./landing/LandingGame";
import { useGameEffects } from "@/lib/game-audio";
import { useNarration } from "@/lib/narration";

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function getMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Panel = "settings" | "reports" | null;
type GameEvent = "NEXT" | "BACK" | "HOME";

function MusicIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M12 23V8l14-3v15M12 12l14-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse cx="8" cy="24" rx="4" ry="3" fill="currentColor" />
      <ellipse cx="22" cy="21" rx="4" ry="3" fill="currentColor" />
      {muted && <path d="M5 4l23 24" stroke="currentColor" strokeWidth="2.5" />}
    </svg>
  );
}

function Dialogue({
  text,
  speaker,
  instant,
  onNext,
  disabled,
  onType,
}: {
  text: string;
  speaker: string;
  instant: boolean;
  onNext: () => void;
  disabled: boolean;
  onType: (character: boolean) => void;
}) {
  const [revealed, setRevealed] = useState(0);
  const finished = instant || revealed >= text.length;
  useEffect(() => {
    if (instant || disabled) return;
    const timer = window.setInterval(
      () =>
        setRevealed((count) => {
          if (count >= text.length) {
            window.clearInterval(timer);
            return count;
          }
          return count + 2;
        }),
      32,
    );
    return () => window.clearInterval(timer);
  }, [text, instant, disabled]);
  useEffect(() => {
    if (instant || disabled || revealed === 0 || revealed >= text.length)
      return;
    if (/\S/.test(text.slice(Math.max(0, revealed - 2), revealed)))
      onType(speaker !== "MISSION ARCHIVE");
  }, [revealed, text, speaker, instant, disabled, onType]);
  return (
    <button
      className="dialogue-box"
      disabled={disabled}
      onClick={() => (finished ? onNext() : setRevealed(text.length))}
      aria-label={finished ? "Continue cutscene" : "Show complete dialogue"}
    >
      <span className="speaker">{speaker}</span>
      <span className="dialogue-text" aria-hidden="true">
        {instant ? text : text.slice(0, revealed)}
        <span className={finished ? "type-caret hidden" : "type-caret"}>▍</span>
      </span>
      <span className="sr-only">{text}</span>
      <span className="dialogue-prompt">
        {finished ? "CONTINUE" : "REVEAL TEXT"}
        <span className={finished ? "advance-diamond" : ""}>◆</span>
      </span>
    </button>
  );
}

export default function Game() {
  const [state, send] = useMachine(narrativeMachine);
  const [panel, setPanel] = useState<Panel>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [busy, setBusy] = useState(false);

  const root = useRef<HTMLElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const audio = useRef<Howl | null>(null);
  const transition = useRef<gsap.core.Timeline | null>(null);
  const locked = useRef(false);
  const data = useGameStore();
  const effects = useGameEffects();
  const narration = useNarration();
  const sceneIndex = chapters.findIndex(
    (chapter) => chapter.state === state.value,
  );
  const scene = chapters[sceneIndex];
  const menu = state.matches("menu");
  const complete = state.matches("complete");
  const rover = state.matches("rover");
  const landing = state.matches("landing");
  const systemReducedMotion = useSyncExternalStore(
    subscribeToMotion,
    getMotionPreference,
    () => false,
  );
  const instant = data.reducedMotion || systemReducedMotion;

  useEffect(() => {
    void Promise.resolve(useGameStore.persist.rehydrate())
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (sceneIndex >= 0) useGameStore.getState().saveChapter(sceneIndex);
    if (complete) useGameStore.getState().finish();
  }, [sceneIndex, complete]);
  useEffect(() => {
    // The landing game handles its own animations.
    if (instant || landing) return;

    const ctx = gsap.context(() => {
      const sceneElements = root.current?.querySelectorAll(".scene-enter");

      const dialogueElements = root.current?.querySelectorAll(".dialogue-box");

      const timeline = gsap.timeline();

      if (sceneElements?.length) {
        timeline.fromTo(
          sceneElements,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.14,
            ease: "power2.out",
            delay: 0.25,
          },
        );
      }

      if (dialogueElements?.length) {
        timeline.fromTo(
          dialogueElements,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3",
        );
      }
    }, root);

    return () => ctx.revert();
  }, [state.value, instant, landing]);

  useEffect(() => {
    if (panel) dialog.current?.showModal();
    else dialog.current?.close();
  }, [panel]);
  useEffect(() => {
    audio.current?.volume(
      data.volume *
        (data.narrationEnabled && scene && !busy && !panel ? 0.35 : 1),
    );
  }, [data.volume, data.narrationEnabled, scene, busy, panel]);
  useEffect(() => {
    if (scene && !busy && !panel && data.narrationEnabled)
      narration.speak(scene.text, scene.speaker);
    else narration.stop();
    return narration.stop;
  }, [
    scene,
    busy,
    panel,
    data.narrationEnabled,
    data.narrationVoice,
    data.narrationVolume,
    narration.speak,
    narration.stop,
  ]);
  useEffect(
    () => () => {
      audio.current?.unload();
      transition.current?.kill();
    },
    [],
  );

  function toggleAudio() {
    if (!audio.current)
      audio.current = new Howl({
        src: ["/audio/mars-ambient.wav"],
        loop: true,
        volume: data.volume,
      });
    if (muted) {
      audio.current.play();
      setMuted(false);
    } else {
      audio.current.pause();
      setMuted(true);
    }
  }

  function cutTo(action: () => void, rewind = false) {
    if (locked.current) return;
    narration.stop();
    if (instant) {
      action();
      return;
    }
    effects.play(rewind ? "rewind" : "transition");
    locked.current = true;
    setBusy(true);

    const timeline = gsap.timeline({
      onComplete: () => {
        locked.current = false;
        setBusy(false);
      },
    });
    transition.current = timeline;

    timeline
      .set(curtain.current, { visibility: "visible" })
      .to(curtain.current, {
        opacity: 1,
        duration: rewind ? 0.85 : 0.45,
        ease: "power2.inOut",
      })
      .call(action)
      .to(curtain.current, { opacity: 1, duration: rewind ? 0.65 : 0.2 })
      .to(curtain.current, { opacity: 0, duration: 0.8, ease: "power2.out" })
      .set(curtain.current, { visibility: "hidden" });
  }
  function navigate(type: GameEvent) {
    cutTo(() => send({ type }), sceneIndex === 1 && type === "NEXT");
  }
  function start(resume = false) {
    const savedChapter = Math.min(
      chapters.length - 1,
      Math.max(0, data.chapter),
    );
    cutTo(() => {
      send({ type: "START" });
      if (resume)
        for (let index = 0; index < savedChapter; index++)
          send({ type: "NEXT" });
    });
  }

  return (
    <main
      ref={root}
      className={`game ${landing ? "landing-mode" : menu ? "menu" : "cutscene"} scene-${sceneIndex} ${data.reducedMotion ? "motion-off" : ""}`}
      aria-busy={busy}
      onClickCapture={(event) => {
        if ((event.target as Element).closest("button:not(:disabled)"))
          effects.click();
      }}
    >
      {landing && (
        <LandingGame
          reducedMotion={instant}
          onComplete={() => navigate("NEXT")}
        />
      )}
      {!landing && <div className="landscape" aria-hidden="true" />}
      {!landing && <div className="vignette" aria-hidden="true" />}
      {!landing && <div className="grain" aria-hidden="true" />}
      {!landing && <Dust paused={data.reducedMotion || !menu} />}
      {!landing && (
        <button
          className="music-button"
          onClick={toggleAudio}
          aria-label={muted ? "Enable music" : "Mute music"}
          aria-pressed={!muted}
        >
          <MusicIcon muted={muted} />
        </button>
      )}

      {landing ? null : menu ? (
        <section className="title-screen" aria-labelledby="game-title">
          <div className="title-lockup scene-enter">
            <h1 id="game-title">SOJOURNER</h1>
            <p>The Little Rover That Never Came Home</p>
          </div>
          <nav
            className="game-menu scene-enter"
            aria-label="Game menu"
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
              event.preventDefault();
              const buttons = Array.from(
                event.currentTarget.querySelectorAll<HTMLButtonElement>(
                  "button",
                ),
              );
              const current = buttons.indexOf(
                document.activeElement as HTMLButtonElement,
              );
              buttons[
                (current +
                  (event.key === "ArrowDown" ? 1 : -1) +
                  buttons.length) %
                  buttons.length
              ]?.focus();
            }}
          >
            <button
              className="painted-button"
              disabled={busy}
              onClick={() => start()}
            >
              <span>START</span>
            </button>
            {ready && (data.chapter > 0 || data.completed) && (
              <button
                className="painted-button"
                disabled={busy}
                onClick={() => start(true)}
              >
                <span>CONTINUE</span>
              </button>
            )}
            <button
              className="painted-button"
              onClick={() => setPanel("settings")}
            >
              <span>SETTINGS</span>
            </button>
            <button
              className="painted-button"
              onClick={() => setPanel("reports")}
            >
              <span>REPORTS</span>
            </button>
          </nav>
        </section>
      ) : rover ? (
        <RoverGame
          onComplete={() => send({ type: "NEXT" })}
          onExit={() => send({ type: "BACK" })}
          reducedMotion={instant}
        />
      ) : scene ? (
        <section
          className={`cinematic-stage cinematic-${sceneIndex}`}
          key={scene.state}
          aria-label={scene.title}
        >
          <div className="letterbox top" aria-hidden="true" />
          <div className="letterbox bottom" aria-hidden="true" />
          {sceneIndex < 2 ? (
            <div className="archive-stage scene-enter">
              <div className="monitor-housing">
                <span className="monitor-screw screw-a" />
                <span className="monitor-screw screw-b" />
                <div className="monitor-screen">
                  <div className="monitor-topline">
                    <span className="record-light" />
                    {scene.label}
                    <span>REC 00:0{sceneIndex + 1}</span>
                  </div>
                  {sceneIndex === 0 ? (
                    <div className="archive-montage">
                      <div
                        className="archive-frame archive-frame-one"
                        role="img"
                        aria-label="Mars Pathfinder and the Sojourner rover"
                      />
                      <div
                        className="archive-frame archive-frame-two"
                        role="img"
                        aria-label="A spacecraft on its journey to Mars"
                      />
                      <div
                        className="archive-frame archive-frame-three"
                        role="img"
                        aria-label="The silent Martian landscape"
                      />
                    </div>
                  ) : (
                    <div
                      className="archive-focus"
                      role="img"
                      aria-label="Sojourner on Mars Pathfinder"
                    >
                      <span className="target-bracket bracket-a" />
                      <span className="target-bracket bracket-b" />
                      <span className="archive-ident">
                        PATHFINDER + SOJOURNER
                        <br />
                        19.13° N / 33.22° W
                      </span>
                    </div>
                  )}
                  <span className="monitor-location">{scene.date}</span>
                  <div className="scanlines" aria-hidden="true" />
                </div>
                <div className="monitor-base">
                  <span />
                  <span />
                  <span />
                  <i />
                  <i />
                </div>
              </div>
              {sceneIndex === 1 && (
                <p className="rewind-caption">{scene.aside}</p>
              )}
            </div>
          ) : sceneIndex === 2 ? (
            <div className="chapter-card scene-enter">
              <div
                className="chapter-photo"
                role="img"
                aria-label="Sojourner arrives on Mars aboard Pathfinder"
              />
              <p className="chapter-date">{scene.date}</p>
              <div className="chapter-rule" />
              <h1>
                <span>CHAPTER 1</span>ARRIVAL ON MARS
              </h1>
            </div>
          ) : (
            <div className={`descent-scene descent-${sceneIndex} scene-enter`}>
              <div
                className={`descent-art ${sceneIndex === 3 ? "entry-art" : "window-art"} ${sceneIndex === 5 ? "wonder-art" : ""}`}
                role="img"
                aria-label={
                  sceneIndex === 3
                    ? "Pathfinder’s heat shield glowing as it enters the Martian atmosphere"
                    : "Sojourner gazing through the spacecraft window at Mars"
                }
              />
              <div className="descent-shade" />
              <p className="descent-label">{scene.label}</p>
              <p className="descent-aside">{scene.aside}</p>
            </div>
          )}
          <Dialogue
            text={scene.text}
            speaker={scene.speaker}
            instant={instant}
            disabled={busy || panel !== null}
            onType={(character) => {
              if (!data.narrationEnabled)
                effects.play(character ? "rover" : "type");
            }}
            onNext={() => navigate("NEXT")}
          />
          <div className="cutscene-controls">
            <button disabled={busy} onClick={() => navigate("BACK")}>
              ‹ BACK
            </button>
            <button disabled={busy} onClick={() => navigate("HOME")}>
              RETURN TO TITLE
            </button>
          </div>
        </section>
      ) : (
        <section className="ending-screen">
          <p className="scene-enter">TO BE CONTINUED</p>
          <h1 className="scene-enter">
            A whole world
            <br />
            waiting to be discovered.
          </h1>
          <p className="preview-end scene-enter">END OF NARRATIVE PREVIEW</p>
          <button
            className="painted-button scene-enter"
            disabled={busy}
            onClick={() => navigate("HOME")}
          >
            <span>TITLE SCREEN</span>
          </button>
        </section>
      )}

      <div ref={curtain} className="scene-curtain" aria-hidden="true" />
      <dialog
        ref={dialog}
        className="game-dialog"
        onCancel={() => setPanel(null)}
        onClose={() => setPanel(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
        }}
        aria-labelledby="panel-title"
      >
        <button
          className="close-button"
          onClick={() => setPanel(null)}
          aria-label="Close menu"
        >
          ×
        </button>
        <span className="panel-ornament" aria-hidden="true">
          — ✦ —
        </span>
        <h2 id="panel-title">
          {panel === "settings" ? "SETTINGS" : "MISSION REPORTS"}
        </h2>
        {panel === "settings" ? (
          <div className="settings">
            <label htmlFor="volume">
              Music volume<span>{Math.round(data.volume * 100)}%</span>
            </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={data.volume}
              onChange={(event) => data.setVolume(Number(event.target.value))}
            />
            <label className="effects-volume" htmlFor="effects-volume">
              Sound effects<span>{Math.round(data.soundVolume * 100)}%</span>
            </label>
            <input
              id="effects-volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={data.soundVolume}
              onChange={(event) =>
                data.setSoundVolume(Number(event.target.value))
              }
            />
            <button className="setting-row" onClick={toggleAudio}>
              Music<span>{muted ? "OFF" : "ON"}</span>
            </button>
            <button
              className="setting-row"
              disabled={!narration.supported}
              onClick={() => {
                const enabled = !data.narrationEnabled;
                data.setNarrationEnabled(enabled);
                if (enabled)
                  narration.speak("A little rover. An extraordinary journey.");
                else narration.stop();
              }}
            >
              Free voice narration
              <span>
                {!narration.supported
                  ? "UNAVAILABLE"
                  : data.narrationEnabled
                    ? "ON"
                    : "OFF"}
              </span>
            </button>
            {data.narrationEnabled && (
              <div className="narration-settings">
                <label htmlFor="narration-voice">Voice</label>
                <select
                  id="narration-voice"
                  value={data.narrationVoice}
                  onChange={(event) =>
                    data.setNarrationVoice(event.target.value)
                  }
                >
                  <option value="">Automatic English voice</option>
                  {narration.voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="narration-volume">Voice volume</label>
                <input
                  id="narration-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={data.narrationVolume}
                  onChange={(event) =>
                    data.setNarrationVolume(Number(event.target.value))
                  }
                />
                <p>Free device voices. Available voices vary by browser.</p>
              </div>
            )}
            <label className="setting-row" htmlFor="motion">
              Reduced motion
              <input
                id="motion"
                type="checkbox"
                checked={data.reducedMotion}
                onChange={(event) =>
                  data.setReducedMotion(event.target.checked)
                }
              />
            </label>
          </div>
        ) : (
          <div className="reports">
            {chapters.slice(0, 3).map((chapter, index) => (
              <article key={chapter.state}>
                <span className="report-number">0{index + 1}</span>
                <div>
                  <h3>
                    {
                      [
                        "A trusted companion",
                        "An extraordinary landing",
                        "A little explorer",
                      ][index]
                    }
                  </h3>
                  <p>{chapter.fact}</p>
                </div>
              </article>
            ))}
            <p className="report-note">
              The mission was real. Character dialogue is fictional.
            </p>
            <a
              href="https://science.nasa.gov/mission/mars-pathfinder/"
              target="_blank"
              rel="noreferrer"
            >
              NASA MISSION ARCHIVE ↗
            </a>
          </div>
        )}
        <button
          className="painted-button panel-back"
          onClick={() => setPanel(null)}
        >
          <span>BACK</span>
        </button>
      </dialog>
    </main>
  );
}
