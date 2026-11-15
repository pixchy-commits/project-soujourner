"use client";
import { useState } from "react";
import type { ActivityProps } from "../flow/ActivityGate";
import styles from "./HistoricalRecord.module.css";

export const historicalRecords = {
 "opening-history": { title: "The mission's image archive", cover: "mission's-image-archive-mars-pathfinder-cover.png", page: "mission'image'archive-page.png" },
 "primary-mission-history": { title: "Overview of the mission data", cover: "archive-000-mars-pathfinder-cover.png", page: "archive-000-mars-pathfinder-open.png" },
 "yogi-failed": { title: "Why the Yogi analysis failed", cover: "whydidchemicalanalyissfail-cover.png", page: "whydidchemicalanalyissfail-book.png" },
 "extended-mission-history": { title: "Official extended mission", cover: "appendix-officle-extended-cover.png", page: "appendix-officle-extended-bok.png" },
} as const;
export type HistoricalId = keyof typeof historicalRecords;
const src = (file: string) => `/art/historical/${encodeURIComponent(file)}`;

/** Team-supplied complete artwork, with interaction kept outside the image. */
export default function HistoricalRecord({ id, paused, onComplete }: ActivityProps & { id: HistoricalId }) {
 const record = historicalRecords[id];
 const [opened, setOpened] = useState(false);
 const [zoom, setZoom] = useState(false);
 return <section className={styles.record} aria-label={record.title}>
  <div className={`${styles.viewport} ${zoom ? styles.zoom : ""}`}>
   <button className={styles.imageButton} disabled={paused || opened} onClick={() => setOpened(true)} aria-label={`Open ${record.title}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img key={opened ? "page" : "cover"} className={styles.image} src={src(opened ? record.page : record.cover)} alt={`${record.title}: ${opened ? "complete illustrated report" : "folder cover"}`} />
   </button>
  </div>
  <nav className={styles.controls} aria-label="Report controls">
   <span className={styles.status} aria-live="polite">{opened ? "Report · 1 / 1" : "Mission record"}</span>
   {opened && <button disabled={paused} onClick={() => { setOpened(false); setZoom(false); }}>Cover</button>}
   {opened && <button disabled={paused} aria-pressed={zoom} onClick={() => setZoom(value => !value)}>{zoom ? "Fit image" : "Enlarge"}</button>}
   <button disabled={paused} onClick={() => opened ? onComplete({ activityId:id, outcome:"completed" }) : setOpened(true)}>{opened ? "Return to story" : "Open folder"}<span aria-hidden="true"> →</span></button>
  </nav>
 </section>;
}
