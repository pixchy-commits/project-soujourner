import type { ReactNode } from "react";
import styles from "./ChapterTelevision.module.css";

export function ChapterTelevision({ children }: { children: ReactNode }) {
  return <div className={`chapter-photo ${styles.television}`}>
    <div className={styles.screen}>{children}<div className={styles.glass} aria-hidden="true" /></div>
    <div className={styles.controls} aria-hidden="true"><i className={styles.dial} /><i className={styles.dial} /><div className={styles.speaker} /><span className={styles.power} /></div>
    <div className={styles.feet} aria-hidden="true"><i /><i /></div>
  </div>;
}
