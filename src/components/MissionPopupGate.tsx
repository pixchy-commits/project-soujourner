"use client";

import { useEffect, useState, type ReactNode } from "react";

type PopupName = "landing" | "barnacle" | "soil" | "yogi" | "rescue";

/** Waits for the standalone HTML briefing to send its Start action. */
export default function MissionPopupGate({ mission, children }: { mission: PopupName; children: ReactNode }) {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "sojo-popup-action" && event.data.action === "start" &&
          (event.data.mission === mission || event.data.mission == null)) {
        setStarted(true);
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [mission]);

  return (
    <>
      {started ? children : (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "transparent" }}>
          <iframe
            title={`${mission} mission introduction`}
            src={`/pop-up/${mission}-mission-popups.html?view=brief`}
            style={{ display: "block", width: "100%", height: "100%", border: 0, background: "transparent" }}
          />
        </div>
      )}
    </>
  );
}
