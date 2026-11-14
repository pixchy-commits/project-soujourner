"use client";
import { useEffect, useRef } from "react";

export default function Dust({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    void import("pixi.js").then(async ({ Application, Graphics }) => {
      const app = new Application();
      try {
        await app.init({ resizeTo: window, backgroundAlpha: 0, antialias: false, resolution: 1, preference: "webgl" });
        if (cancelled) { app.destroy(true, { children: true }); return; }
        host.current?.appendChild(app.canvas);
        const motes = Array.from({ length: 32 }, (_, i) => {
          const mote = new Graphics().circle(0, 0, i % 3 === 0 ? 1.8 : 1).fill({ color: 0xffdfae, alpha: 0.16 + (i % 4) * 0.07 });
          mote.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height);
          app.stage.addChild(mote); return mote;
        });
        app.ticker.add((ticker) => motes.forEach((mote, i) => {
          mote.x += (0.12 + i % 3 * 0.06) * ticker.deltaTime;
          mote.y -= 0.05 * ticker.deltaTime;
          if (mote.x > app.screen.width) mote.x = 0;
          if (mote.y < 0) mote.y = app.screen.height;
        }));
        const visibility = () => document.hidden ? app.stop() : app.start();
        document.addEventListener("visibilitychange", visibility);
        dispose = () => { document.removeEventListener("visibilitychange", visibility); app.destroy(true, { children: true }); };
      } catch { if (app.renderer) app.destroy(true, { children: true }); }
    });
    return () => { cancelled = true; dispose?.(); };
  }, [paused]);
  return <div ref={host} className="dust" aria-hidden="true" />;
}
