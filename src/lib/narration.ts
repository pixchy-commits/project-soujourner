"use client";
import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "./game-store";

export function useNarration() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported, setSupported] = useState(false);
  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setSupported(true);
    const synth = window.speechSynthesis;
    const refresh = () => setVoices(synth.getVoices().filter((voice) => voice.lang.startsWith("en")));
    const visibility = () => { if (document.hidden) synth.cancel(); };
    refresh();
    synth.addEventListener("voiceschanged", refresh);
    document.addEventListener("visibilitychange", visibility);
    return () => { synth.removeEventListener("voiceschanged", refresh); document.removeEventListener("visibilitychange", visibility); synth.cancel(); };
  }, []);
  const speak = useCallback((text: string, speaker = "MISSION ARCHIVE") => {
    if (!("speechSynthesis" in window) || document.hidden) return;
    const data = useGameStore.getState();
    if (!data.narrationEnabled) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const options = synth.getVoices().filter((voice) => voice.lang.startsWith("en"));
    const voice = options.find((voice) => voice.voiceURI === data.narrationVoice)
      ?? options.find((voice) => /natural|samantha|aria|google uk english/i.test(voice.name))
      ?? options.find((voice) => voice.default) ?? options[0];
    for (const sentence of text.match(/[^.!?…]+[.!?…]*/g) ?? [text]) {
      if (!sentence.trim()) continue;
      const line = new SpeechSynthesisUtterance(sentence.trim());
      if (voice) line.voice = voice;
      line.lang = voice?.lang ?? "en-US";
      line.volume = data.narrationVolume;
      line.rate = speaker === "SOJOURNER" ? 1.04 : .9;
      line.pitch = speaker === "SOJOURNER" ? 1.18 : speaker === "PATHFINDER" ? .92 : 1;
      synth.speak(line);
    }
  }, []);
  return { voices, supported, speak, stop };
}
